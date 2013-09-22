var NotesCriteria = Backbone.View.extend({
    events : {
        "click .personalNotesSave" : "saveNotes"
    },
    initialize: function (options) {
        this.passageId = options.passageId;
        _.bindAll(this);

        //load list of notes
        this.notesList = this.$el.find(".personalNotesSearch");
//        this.listenTo(NotesModels, "add", this.populateNotesList);
        
        NotesModels.fetch({ data : $.param({ partial: true }), success : this.populateNotesList});
//        this.listenTo(NotesModels, "selected", this.changeSelected);
        
        this.$el.find(".personalNotesDelete").button({ icons : { primary : "ui-icon-trash"}, text : false });
        this.$el.find(".personalNotesSave").button({ icons : { primary : "ui-icon-disk" }, text : false});
        this.$el.find(".personalNotesNew").button({ icons : { primary : "ui-icon-document" }, text : false});
    },
    
    saveNotes : function() {
        console.log("Saving ", this.model.get("id"));
        this.model.trigger("saveToServer", this.model, {});
    },

    changeSelected : function(model) {
        this.model  = model;
    },
    
    populateNotesList : function() {
        var self = this;
        var titles = NotesModels.map(function(model) { return {value : model.get("title"), label : model.get("title") }});
        step.util.ui.autocompleteSearch(this.notesList, titles, false, function(element, value, label) {
            var newModel = NotesModels.findWhere({ title : value });
            self.model = newModel;
            newModel.trigger("selected", newModel);
        });
    }
});
