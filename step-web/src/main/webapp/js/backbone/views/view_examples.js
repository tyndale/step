var ExamplesView = Backbone.View.extend({
    events: {
        'click .accordion-heading': 'onClickHeading'
    },
    initialize: function () {
        this.render();
    },
    render: function () {
        var exPanelWidth = $('.examplesContainer').width();
        this.$el.load("jsps/examples.jsp", null, _.bind(this.initAccordions, this));
        if ((exPanelWidth != undefined) && (exPanelWidth != null) && (!isNaN(exPanelWidth))) {
            if (exPanelWidth < 365) $('.hidenarrow').hide();
            else $('.hidenarrow').show();
        }
     },
    initAccordions: function () {
        var count = this.$el.find(".accordion-row").length;
        var i;

        for (i = 0; i < count; i++) {
            if (localStorage.getItem("stepBible-displayQuickTryoutAccordion" + i) === "true") {
                this.toggleAccordion(i);
            }
        }
    },
    toggleAccordion: function (index) {
        var query = ".accordion-row[data-row=" + index + "]";
        var $accordionRow = this.$el.find(query);
        var $accordionBody = $accordionRow.find(".accordion-body");
        var storageKey = "stepBible-displayQuickTryoutAccordion" + index;

        if ($accordionBody.is(":visible")) {
            $accordionRow.find(".accordion-body").slideUp(400);
            $accordionRow.find(".plusminus").text("+");
            localStorage.setItem(storageKey, "false");
        }
        else {
            $accordionRow.find(".accordion-body").slideDown(400);
            $accordionRow.find(".plusminus").text("-");
            localStorage.setItem(storageKey, "true");
        }
    },
    onClickHeading: function (event) {
        var $target = $(event.target);
        var $accordionRow = $target.parent();
        var index = $accordionRow.attr("data-row");
        this.toggleAccordion(index);
    }
});
