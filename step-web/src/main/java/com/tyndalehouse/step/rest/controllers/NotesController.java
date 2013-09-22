package com.tyndalehouse.step.rest.controllers;

import com.tyndalehouse.step.core.models.ClientSession;
import com.tyndalehouse.step.core.models.Note;
import com.tyndalehouse.step.core.service.NotesService;
import com.tyndalehouse.step.guice.providers.ClientSessionProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Provider;
import javax.inject.Singleton;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Caters for retrieving and persisting notes in the system.
 * The method names are mostly the same name to tie in with the Backbone architecture
 *
 * @author chrisburrell
 */
@Singleton
public class NotesController {
    private static final Logger LOGGER = LoggerFactory.getLogger(NotesController.class);
    private NotesService notesService;

    /**
     */
    @Inject
    public NotesController(NotesService notesService) {
        this.notesService = notesService;
    }

    /**
     * @return all the notes in the system
     */
    public List<Note> notes() {
        return this.notesService.getAllNotes();
    }


    /**
     * Gets a particular note.
     *
     * @return the particular note of interest
     */
    public Note notes(String id) {
        return notesService.getFullNote(id);
    }

    /**
     * Need to persist the note
     *
     * @param id   the id of the note
     * @param note the actual note object
     */
    public void notes(String id, Note note) {
        LOGGER.debug("Persisting the note [{}]", id);
        notesService.saveNote(note);
    }
}
