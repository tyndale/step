var NotesDisplayView = Backbone.View.extend({
    initialize: function (options) {
        this.$el = $(".passageContent").eq(options.passageId);
        this.listenTo(NotesModels, "selected", this.changeSelected);

        //initialise editor if not already done.
        //show current note in editor
//        this.listenTo(this.model, "saveToServer", this.saveToServer);
    },

    saveToServer : function() {
        console.log("Saving to server", this.model.get("id"), this.notesEditor.html());
        this.model.save({
            noteContent : this.notesEditor.html() 
        });
    },
    
    changeSelected: function (model) {
        //need to warn around losing content?
        console.log("model is", model);
        
        
        this.stopListening(this.model);
        this.model = model;
        this.listenTo(this.model, "saveToServer", this.saveToServer);
        
        
        
        if (this.editor == undefined) {
            this.$el.empty();
            
            //need to initialise editor
            this.notesEditor = $("<textarea class='notesEditor'></textarea>");
            this.$el.append(this.notesEditor);
            this.notesEditor.tinymce({
                script_url: 'libs/tinymce/tinymce.min.js',
                theme: "modern",
                width: "95%",
                height: "100%",
                theme: "modern",
                plugins: [
                    "advlist autolink lists link charmap print preview hr anchor pagebreak",
                    "searchreplace fullscreen",
                    "nonbreaking save table contextmenu directionality",
                    "paste textcolor"
                ],
                toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
                toolbar2: "link | forecolor backcolor emoticons | print preview ",
//                statusbar : false
                menubar : "edit insert view format table"
                
            });
        }
    }
});
