/*******************************************************************************
 * Copyright (c) 2012, Directors of the Tyndale STEP Project
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions 
 * are met:
 * 
 * Redistributions of source code must retain the above copyright 
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright 
 * notice, this list of conditions and the following disclaimer in 
 * the documentation and/or other materials provided with the 
 * distribution.
 * Neither the name of the Tyndale House, Cambridge (www.TyndaleHouse.com)  
 * nor the names of its contributors may be used to endorse or promote 
 * products derived from this software without specific prior written 
 * permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS 
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE 
 * COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, 
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT 
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING 
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF 
 * THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
package com.tyndalehouse.step.rest.framework;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Injector;
import com.google.inject.Singleton;
import com.google.inject.name.Named;
import com.tyndalehouse.step.core.exceptions.StepInternalException;

/**
 * The FrontController acts like a minimal REST server. The paths are resolved as follows:
 * 
 * /step-web/rest/controllerName/methodName/arg1/arg2/arg3
 * 
 * @author chrisburrell
 * 
 */
@Singleton
public class FrontController extends HttpServlet {
    /** The Constant UTF_8_ENCODING. */
    public static final String UTF_8_ENCODING = "UTF-8";
    private static final String EXTERNAL_CONTROLLER_SUB_PACKAGE = "external";
    private static final Logger LOGGER = LoggerFactory.getLogger(FrontController.class);
    private static final String CONTROLLER_PACKAGE = "com.tyndalehouse.step.rest.controllers";
    private static final char PACKAGE_SEPARATOR = '.';
    private static final long serialVersionUID = 7898656504631346047L;
    private static final String CONTROLLER_SUFFIX = "Controller";
    private final transient Injector guiceInjector;
    private final transient ObjectMapper jsonMapper = new ObjectMapper();

    private final transient Map<String, Method> methodNames = new HashMap<String, Method>();
    private final transient Map<String, Object> controllers = new HashMap<String, Object>();
    private final boolean isCacheEnabled;
    private final transient ClientErrorResolver errorResolver;
    private final transient ResponseCache responseCache;

    /**
     * creates the front controller which will dispatch all the requests
     * <p />
     * 
     * @param guiceInjector the injector used to call the relevant controllers
     * @param isCacheEnabled indicates whether responses should be cached for fast retrieval
     * @param errorResolver the error resolver is the object that helps us translate errors for the client
     * @param responseCache cache in which are put any number of responses to speed up processing
     */
    @Inject
    public FrontController(final Injector guiceInjector,
            @Named("frontcontroller.cache.enabled") final Boolean isCacheEnabled,
            final ClientErrorResolver errorResolver, final ResponseCache responseCache) {
        this.guiceInjector = guiceInjector;
        this.responseCache = responseCache;

        this.errorResolver = errorResolver;
        this.isCacheEnabled = Boolean.TRUE.equals(isCacheEnabled);
    }

    @Override
    protected void doGet(final HttpServletRequest request, final HttpServletResponse response) {
        // first of all check cache against URI: (only cached responses go here)
        byte[] jsonEncoded = this.responseCache.get(request.getRequestURI());

        StepRequest sr = null;
        try {
            // cache miss?
            if (jsonEncoded == null || jsonEncoded.length == 0) {
                sr = new StepRequest(request, UTF_8_ENCODING);
                if (jsonEncoded == null) {
                    LOGGER.debug("The cache was missed so invoking method now...");
                    jsonEncoded = invokeMethod(sr);
                }
            } else {
                LOGGER.debug("Returning answer from cache [{}]", request.getRequestURI());
            }

            setupHeaders(response, jsonEncoded.length);
            response.getOutputStream().write(jsonEncoded);
            // CHECKSTYLE:OFF We allow catching errors here, since we are at the top of the structure
        } catch (final Exception e) {
            // CHECKSTYLE:ON
            handleError(response, e, sr);
        }
    }

    /**
     * Invokes the method on the controller instance and returns JSON-ed results
     * 
     * @param sr the STEP Request containing all pertinent information
     * @return byte array representation of the return value
     */
    byte[] invokeMethod(final StepRequest sr) {

        // controller instance on which to call a method
        final Object controllerInstance = getController(sr.getControllerName(), sr.isExternal());

        // resolve method
        final Method controllerMethod = getControllerMethod(sr.getMethodName(), controllerInstance,
                sr.getArgs(), sr.getCacheKey().getMethodKey());

        // invoke the three together
        Object returnVal;
        try {
            returnVal = controllerMethod.invoke(controllerInstance, (Object[]) sr.getArgs());

            // CHECKSTYLE:OFF
        } catch (final Exception e) {
            LOGGER.warn(e.getMessage(), e);
            returnVal = convertExceptionToJson(e);
        }
        final byte[] encodedJsonResponse = getEncodedJsonResponse(returnVal);
        cache(encodedJsonResponse, sr, controllerMethod);
        return encodedJsonResponse;
        // CHECKSTYLE:ON
    }

    /**
     * We attempt here to rethrow the exception that caused the invocation target exception, so that we can
     * handle it nicely for the user
     * 
     * @param e the wrapped exception that happened during the reflective call
     * @return a client handled issue which wraps the exception that was raised
     */
    private ClientHandledIssue convertExceptionToJson(final Exception e) {
        // first we check to see if it's a step exception, or an illegal argument exception

        final Throwable cause = e.getCause();
        if (cause instanceof StepInternalException) {
            LOGGER.trace(e.getMessage(), e);
            return new ClientHandledIssue(cause.getMessage(), this.errorResolver.resolve(cause.getClass()));
        } else if (cause instanceof IllegalArgumentException) {
            // a validation exception occurred
            LOGGER.warn(e.getMessage(), e);
            return new ClientHandledIssue(cause.getMessage());
        }

        LOGGER.error(e.getMessage(), e);
        return new ClientHandledIssue("An internal error has occurred");
    }

    /**
     * Returns a json response that is encoded
     * 
     * @param responseValue the value that should be encoded
     * @return the encoded form of the JSON response
     */
    byte[] getEncodedJsonResponse(final Object responseValue) {
        LOGGER.debug("Encoding the following response [{}]", responseValue);

        try {
            String response;
            if (responseValue == null) {
                return new byte[0];
            } else {
                response = this.jsonMapper.writeValueAsString(responseValue);
            }

            return response.getBytes(UTF_8_ENCODING);
        } catch (final JsonGenerationException e) {
            throw new StepInternalException(e.getMessage(), e);
        } catch (final JsonMappingException e) {
            throw new StepInternalException(e.getMessage(), e);
        } catch (final IOException e) {
            throw new StepInternalException(e.getMessage(), e);
        }
    }

    /**
     * caches the results for future use
     * 
     * @param jsonEncoded json encoding of the response
     * @param sr the processed request URI containg the the cache key
     * @param controllerMethod the method so that we can inspect whether an annotation is present
     */
    void cache(final byte[] jsonEncoded, final StepRequest sr, final Method controllerMethod) {
        if (this.isCacheEnabled && controllerMethod.isAnnotationPresent(Cacheable.class)) {
            this.responseCache.put(sr.getCacheKey().getResultsKey(), jsonEncoded);
        }
    }

    /**
     * sets up the headers and the length of the message
     * 
     * @param response the response
     * @param length the length of the message
     */
    void setupHeaders(final HttpServletResponse response, final int length) {
        // we ensure that headers are set up appropriately
        response.addDateHeader("Date", System.currentTimeMillis());
        response.setCharacterEncoding(UTF_8_ENCODING);
        response.setContentType("application/json");
        response.setContentLength(length);
    }

    /**
     * deals with an error whilst executing the request
     * 
     * @param response the response
     * 
     * @param e the exception
     * @param sr the step request
     */
    void handleError(final HttpServletResponse response, final Throwable e, final StepRequest sr) {
        String requestId = null;
        LOGGER.debug("Handling error...");
        try {
            requestId = sr == null ? "Failed to parse request?" : sr.getCacheKey().getResultsKey();
            if (e != null) {
                final ClientHandledIssue issue = new ClientHandledIssue(e.getMessage());
                final byte[] errorMessage = this.getEncodedJsonResponse(issue);
                response.getOutputStream().write(errorMessage);
                setupHeaders(response, errorMessage.length);

                LOGGER.error("An internal error has occurred for [{}]", requestId, e);
            }
            // CHECKSTYLE:OFF We allow catching errors here, since we are at the top of the structure
        } catch (final Exception unableToSendError) {
            // CHECKSTYLE:ON
            LOGGER.error("Unable to output error for request" + requestId, unableToSendError);
            LOGGER.error("Due to original Throwable", e);
        }
    }

    /**
     * Retrieves a controller, either from the cache, or from Guice.
     * 
     * @param controllerName the name of the controller (used as the key for the cache)
     * @param isExternal indicates whether the request should be found in the external controllers
     * @return the controller object
     */
    Object getController(final String controllerName, final boolean isExternal) {
        Object controllerInstance = this.controllers.get(controllerName);

        // if retrieving yields null, get controller from Guice, and put in cache
        if (controllerInstance == null) {
            // make up the full class name
            final String packageName = CONTROLLER_PACKAGE;
            final StringBuilder className = new StringBuilder(packageName.length() + controllerName.length()
                    + CONTROLLER_SUFFIX.length() + 1);

            className.append(packageName);
            className.append(PACKAGE_SEPARATOR);
            if (isExternal) {
                className.append(EXTERNAL_CONTROLLER_SUB_PACKAGE);
                className.append(PACKAGE_SEPARATOR);
            }

            className.append(Character.toUpperCase(controllerName.charAt(0)));
            className.append(controllerName.substring(1));
            className.append(CONTROLLER_SUFFIX);

            try {
                final Class<?> controllerClass = Class.forName(className.toString());
                controllerInstance = this.guiceInjector.getInstance(controllerClass);

                // we use the controller name as it came in to key the map
                this.controllers.put(controllerName, controllerInstance);
            } catch (final ClassNotFoundException e) {
                throw new StepInternalException("Unable to find a controller for " + className, e);
            }
        }
        return controllerInstance;
    }

    /**
     * Returns the method to be invoked upon the controller
     * 
     * @param methodName the method name
     * @param controllerInstance the instance of the controller
     * @param args the list of arguments, required to resolve the correct method if they have arguments
     * @param cacheKey the key to retrieve in the cache
     * @return the method to be invoked
     */
    Method getControllerMethod(final String methodName, final Object controllerInstance, final Object[] args,
            final String cacheKey) {
        final Class<? extends Object> controllerClass = controllerInstance.getClass();

        // retrieve method from cache, or put in cache if not there
        Method controllerMethod = this.methodNames.get(cacheKey);
        if (controllerMethod == null) {
            // resolve method

            try {
                final Class<?>[] classes = getClasses(args);
                controllerMethod = controllerClass.getMethod(methodName, classes);
                this.methodNames.put(cacheKey, controllerMethod);

                // put method in cache
            } catch (final NoSuchMethodException e) {
                throw new StepInternalException("Unable to find matching method for " + methodName, e);
            }
        }

        return controllerMethod;
    }

    /**
     * @param args a number of arguments
     * @return an array of classes matching the list of arguments passed in
     */
    Class<?>[] getClasses(final Object[] args) {
        if (args == null) {
            return new Class<?>[0];
        }

        final Class<?>[] classes = new Class<?>[args.length];

        for (int ii = 0; ii < classes.length; ii++) {
            classes[ii] = args[ii].getClass();
        }

        return classes;
    }
}
