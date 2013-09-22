package com.tyndalehouse.step.core.data.entities.impl;

import static com.tyndalehouse.step.core.utils.StringUtils.isBlank;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.joda.time.LocalDateTime;

import com.tyndalehouse.step.core.data.EntityManager;
import com.tyndalehouse.step.core.data.FieldConfig;
import com.tyndalehouse.step.core.data.create.PostProcessor;
import com.tyndalehouse.step.core.exceptions.StepInternalException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Reads a file and creates the equivalent Lucene index for it. This class is not thread safe.
 *
 * @author chrisburrell
 */
public class TrackingEntityIndexWriterImpl extends EntityIndexWriterImpl {
    private static final Logger LOGGER = LoggerFactory.getLogger(TrackingEntityIndexWriterImpl.class);
    private Document doc;

    /**
     * @param entityManager the entity manager
     * @param entityName    the entity that we're about to write to
     */
    public TrackingEntityIndexWriterImpl(final EntityManager entityManager, final String entityName) {
        super(entityManager, entityName);
    }

    /**
     * Adds a field to the current document
     *
     * @param fieldName  the field name
     * @param fieldValue the field value
     */
    public void addFieldToCurrentDocument(final String fieldName, final Number fieldValue) {
        final FieldConfig fieldConfig = getFieldConfig(fieldName, fieldValue);
        if (fieldConfig == null) {
            return;
        }
        this.doc.add(fieldConfig.getField(fieldValue));
    }

    /**
     * Adds a field to the current document
     *
     * @param fieldName  the field name
     * @param fieldValue the field value
     */
    public void addFieldToCurrentDocument(final String fieldName, final LocalDateTime fieldValue) {
        addFieldToCurrentDocument(this.doc, fieldName, fieldValue);
    }


    /**
     * Safely gets a new field config, for a type
     *
     * @param fieldName  the name of the field
     * @param fieldValue the value of the field
     * @return the field config
     */
    private FieldConfig getFieldConfig(final String fieldName, final Object fieldValue) {
        if (fieldValue == null) {
            return null;
        }

        ensureNewDocument();
        final FieldConfig fieldConfig = getLuceneFieldConfigurationByRaw().get(fieldName);
        if (fieldConfig == null) {
            LOGGER.trace("Skipping field: [{}]", fieldName);
            return null;
        }
        return fieldConfig;
    }

    /**
     * Adds a field to the current document
     *
     * @param fieldName  the field name
     * @param fieldValue the field value
     */
    public void addFieldToCurrentDocument(final String fieldName, final String fieldValue) {
        if (isBlank(fieldValue)) {
            return;
        }

        FieldConfig fieldConfig = getFieldConfig(fieldName, fieldValue);

        //check if we've got the field already...
        //if so, then we'll simply append to the existing data, as we don't want
        //to be storing stuff in different fields...
        Field existingValue = this.doc.getField(fieldConfig.getName());
        if (existingValue != null && fieldConfig.isAppend()) {
            existingValue.setValue(existingValue.stringValue() + " " + fieldValue);
            return;
        }

        //otherwise, either add for the first time, or add multiple times
        this.doc.add(fieldConfig.getField(fieldValue));
    }

    /**
     * Adds a field to the current document
     *
     * @param fieldName  the field name
     * @param fieldValue the field value
     */
    public void addFieldToCurrentDocument(final Document doc, final String fieldName, final LocalDateTime fieldValue) {
        final FieldConfig fieldConfig = getFieldConfig(fieldName, fieldValue);
        if (fieldConfig == null) {
            return;
        }

        doc.add(fieldConfig.getField(fieldValue));
    }

    /**
     * Creates a document if it doesn't already exist
     */
    private void ensureNewDocument() {
        if (this.doc == null) {
            this.doc = new Document();
        }
    }

    /**
     * saves the current document, by running the processor and adding it to the index
     */
    public void save() {
        final PostProcessor postProcessorInstance = super.getConfig().getPostProcessorInstance();
        if (postProcessorInstance != null && this.doc != null) {
            postProcessorInstance.process(super.getConfig(), this.doc);
        }
        addDocument();
    }

    /**
     * adds a document to the index
     */
    private void addDocument() {
        if (this.doc != null) {
            super.saveDocument(this.doc);
            this.doc = null;
        }
    }

}
