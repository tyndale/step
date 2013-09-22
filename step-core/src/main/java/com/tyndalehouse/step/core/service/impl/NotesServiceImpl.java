package com.tyndalehouse.step.core.service.impl;

import com.tyndalehouse.step.core.data.EntityDoc;
import com.tyndalehouse.step.core.data.EntityIndexReader;
import com.tyndalehouse.step.core.data.EntityManager;
import com.tyndalehouse.step.core.data.entities.EntityIndexWriter;
import com.tyndalehouse.step.core.exceptions.StepInternalException;
import com.tyndalehouse.step.core.models.ClientSession;
import com.tyndalehouse.step.core.models.Note;
import com.tyndalehouse.step.core.service.AppManagerService;
import com.tyndalehouse.step.core.service.NotesService;
import com.tyndalehouse.step.core.service.UserService;
import com.tyndalehouse.step.core.utils.IOUtils;
import com.tyndalehouse.step.core.utils.StringUtils;
import org.apache.lucene.document.Document;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Provider;
import javax.inject.Singleton;
import java.io.File;
import java.io.FilenameFilter;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

/**
 * Carries out operations on personal notes, including validating access, etc.
 * Notes are stored twice, to ensure we can re-index should the index
 * become corrupt for some reason.
 *
 * @author chrisburrell
 */
@Singleton
public class NotesServiceImpl implements NotesService {
    public static final String NOTES_ENTITY = "notes";
    public static final String NOTE_TITLE = "title";
    public static final String DETAILS_EXTENSION = ".properties";
    public static final String CONTENT_EXTENSION = ".txt";
    private final EntityIndexReader notesReader;
    private final EntityIndexWriter notesWriter;
    private final File notesDirectory;
    private Provider<ClientSession> clientSessionProvider;
    private UserService userService;

    @Inject
    public NotesServiceImpl(final EntityManager entityManager,
                            final @Named("app.notes.path") String notesLocation,
                            final AppManagerService appManagerService,
                            final Provider<ClientSession> clientSessionProvider,
                            final UserService userService) {
        this.clientSessionProvider = clientSessionProvider;
        this.userService = userService;
        this.notesReader = entityManager.getReader(NOTES_ENTITY);
        this.notesWriter = entityManager.getEntityWriter(NOTES_ENTITY);
        this.notesDirectory = new File(appManagerService.getHomeDirectory(), notesLocation);

        if (!this.notesDirectory.exists()) {
            this.notesDirectory.mkdirs();
        }
    }


    @Override
    public int saveNote(Note note) {
        //validate access to this note
        validateAccessToNote(note);

        saveNoteToDisk(note);
//        updateNoteIndex(note);
        return 0;
    }

    @Override
    public List<Note> getAllNotes() {
        //list all the *.properties files and read them all up
        File userNotes = new File(this.notesDirectory, sanitize(userService.currentUser()));

        final File[] notesDetails = userNotes.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(final File dir, final String name) {
                return name.endsWith(".txt");
            }
        });

        //read each file in turn
        List<Note> notes = new ArrayList<Note>();
        for (File noteDetailFile : notesDetails) {
            notes.add(readNoteDetails(userNotes, noteDetailFile));
        }

        return notes;
    }

    @Override
    public Note getFullNote(String noteId) {
        //list all the *.properties files and read them all up
        File userNotes = new File(this.notesDirectory, sanitize(userService.currentUser()));
        File specificNoteDetails = new File(userNotes, noteId + DETAILS_EXTENSION);
        File specificNoteContent = new File(userNotes, noteId + ".txt");

        Note n = readNoteDetails(userNotes, specificNoteDetails);
        n.setNoteContent(IOUtils.readFile(specificNoteContent));
        return n;
    }


    /**
     * Reads the note details from file
     *
     * @param userNotes      the list of user notes
     * @param noteDetailFile the note detail file name
     * @return the fully fledged note (does not include note content)
     */
    private Note readNoteDetails(final File userNotes, final File noteDetailFile) {
        final String noteFileName = noteDetailFile.getName();
        return convertFromProperties(
                noteFileName.substring(0, noteFileName.length() - 4),
                IOUtils.readProperties(noteDetailFile));
    }

    /**
     * Takes a bunch of properties and constructs a Note object from them.
     *
     * @param properties the properties representing the note
     * @return the note object
     */
    private Note convertFromProperties(String noteId, final Properties properties) {
        Note n = new Note();
        n.setId(noteId);
        n.setTitle((String) properties.get(NOTE_TITLE));
        return n;
    }


    /**
     * Saves the note to disk, in two forms: first the {id}.properties which record all the details
     * and secondly the {id}.txt file which is the actual content
     *
     * @param note the note to be saved
     */
    private void saveNoteToDisk(final Note note) {
        String user = sanitize(userService.currentUser());

        //ensure the user directory exists already
        File userDirectory = new File(this.notesDirectory, user);
        if (!userDirectory.exists() && !userDirectory.mkdirs()) {
            throw new StepInternalException("Unable to make a user home directory.");
        }

        //write the content to disk
        Properties details = new Properties();
        details.put(NOTE_TITLE, note.getTitle());
        IOUtils.writeFile(new File(userDirectory, note.getId() + DETAILS_EXTENSION), details);
        IOUtils.writeFile(new File(userDirectory, note.getId() + CONTENT_EXTENSION), note.getNoteContent());
    }
    
    private void updateNoteIndex(final Note note) {
        //lookup the note first if it exits, and if not, we will create a separate document
        Document doc = null;
        if (StringUtils.isNotBlank(note.getId())) {
            final EntityDoc[] noteDocs = notesReader.searchUniqueBySingleField("id", note.getId());
            if (noteDocs.length != 0) {
                doc = noteDocs[0].getInternalDocument();
            }
        }
        if (doc == null) {
            doc = new Document();
        }
    }

    /**
     * @param userIdentifier the user identified
     * @return a sanitized version
     */
    private String sanitize(final String userIdentifier) {
        if (StringUtils.isBlank(userIdentifier)) {
            throw new StepInternalException("Unable to work out who the user is");
        }
        return userIdentifier.replaceAll("@", "-");
    }

    /**
     * Validates that the current user is allowed to access this particular note
     *
     * @param note the note in question
     */
    private void validateAccessToNote(final Note note) {

    }
}
