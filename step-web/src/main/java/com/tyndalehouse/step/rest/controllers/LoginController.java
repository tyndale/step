package com.tyndalehouse.step.rest.controllers;

import com.google.inject.Inject;
import com.google.inject.servlet.RequestScoped;
import com.tyndalehouse.step.core.models.ClientSession;

import javax.inject.Provider;
import javax.inject.Singleton;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author chrisburrell
 */
@RequestScoped
public class LoginController {
    private HttpServletRequest request;
    private HttpServletResponse response;

    @Inject
    public LoginController(HttpServletRequest request, HttpServletResponse response) {
    }

    public void login() throws IOException {
    }

    public void redirect() {
    }
}
