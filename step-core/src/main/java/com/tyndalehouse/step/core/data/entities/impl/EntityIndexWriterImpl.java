package com.tyndalehouse.step.core.data.entities.impl;

import com.tyndalehouse.step.core.data.EntityConfiguration;
import com.tyndalehouse.step.core.data.EntityManager;
import com.tyndalehouse.step.core.data.FieldConfig;
import com.tyndalehouse.step.core.data.entities.EntityIndexWriter;
import com.tyndalehouse.step.core.exceptions.StepInternalException;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.store.RAMDirectory;
import org.joda.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * @author chrisburrell
 */
public class EntityIndexWriterImpl implements EntityIndexWriter {
    private static final Logger LOGGER = LoggerFactory.getLogger(EntityIndexWriterImpl.class);
    private final Directory ramDirectory;
    private final Map<String, FieldConfig> luceneFieldConfigurationByRaw;
    private final EntityConfiguration config;
    private final EntityManager manager;
    private IndexWriter writer;

    public EntityIndexWriterImpl(final EntityManager entityManager, final String entityName) {
        LOGGER.trace("Creating writer for [{}]", entityName);
        this.manager = entityManager;
        this.config = entityManager.getConfig(entityName);
        final Map<String, FieldConfig> luceneFieldConfiguration = this.config.getLuceneFieldConfiguration();
        this.luceneFieldConfigurationByRaw = new HashMap<String, FieldConfig>(luceneFieldConfiguration.size());

        // key the map by its data fields
        final Set<Map.Entry<String, FieldConfig>> entrySet = luceneFieldConfiguration.entrySet();
        for (final Map.Entry<String, FieldConfig> entry : entrySet) {
            final String[] rawDataField = entry.getValue().getRawDataField();
            for (final String rawDString : rawDataField) {
                this.luceneFieldConfigurationByRaw.put(rawDString, entry.getValue());
            }
        }
        this.ramDirectory = getNewRamDirectory();
        try {
            this.writer = new IndexWriter(this.ramDirectory, this.config.getAnalyzerInstance(),
                    IndexWriter.MaxFieldLength.UNLIMITED);
        } catch (final IOException e) {
            throw new StepInternalException("Unable to initialise creation of index", e);
        }

    }

    /**
     * @return a new ram directory
     */
    Directory getNewRamDirectory() {
        return new RAMDirectory();
    }

    /**
     * @param properties a set of key value pairs which will form the new document to be saved
     */
    public void saveDocument(final Map<String, String> properties) {
        Document doc = new Document();
        for(Map.Entry<String,String> entry : properties.entrySet()) {
            
        }
        try {
            this.writer.addDocument(doc);
        } catch (final IOException e) {
            throw new StepInternalException("Unable to write document", e);
        }
    }
    
    /**
     * @param doc the document to be saved
     */
    public void saveDocument(final Document doc) {
        try {
            this.writer.addDocument(doc);
        } catch (final IOException e) {
            throw new StepInternalException("Unable to write document", e);
        }
    }

    /**
     * writes the index to the relevant file location
     *
     * @return the number of entries in the index
     */
    public int close() {
        final int numEntries = getNumEntriesInIndex();
        final File file = new File(this.config.getLocation());
        Directory destination;
        try {
            // we've finished writing entries now, so close our writer
            this.writer.close();

            // open up a location on disk
            destination = FSDirectory.open(file);

            final IndexWriter fsWriter = new IndexWriter(destination, this.config.getAnalyzerInstance(),
                    true, IndexWriter.MaxFieldLength.UNLIMITED);
            fsWriter.addIndexesNoOptimize(this.ramDirectory);
            fsWriter.optimize();
            fsWriter.close();
            destination.close();
            this.ramDirectory.close();
            this.manager.refresh(this.config.getName());
        } catch (final IOException e) {
            throw new StepInternalException("Unable to write index", e);
        }
        return numEntries;
    }

    /**
     * @return the writer of the index into RAM
     */
    IndexWriter getRamWriter() {
        return this.writer;
    }

    /**
     * @return the number of entries in index
     */
    int getNumEntriesInIndex() {
        return this.writer.maxDoc();
    }

    /**
     * @return the entity name
     */
    String getEntityName() {
        return this.config.getName();
    }

    /**
     * @return the configuration for lucene
     */
    public Map<String, FieldConfig> getLuceneFieldConfigurationByRaw() {
        return luceneFieldConfigurationByRaw;
    }

    /**
     * @return the config
     */
    public EntityConfiguration getConfig() {
        return config;
    }
}
