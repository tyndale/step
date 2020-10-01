var HeaderView = Backbone.View.extend({
    events: {
        "click .toggleSidebar": "toggleSidebar",
        "click .openNewTab": "openNewTab"
    },
    el: $(".navbar-fixed-top"),
    initialize: function () {
        this.render();
    },
    render: function () {

        return this;
    },
    toggleSidebar: function () {
        require(["sidebar"], function (module) {
            step.util.ui.initSidebar();
        });
    },
    openNewTab: function (ev) {
        step.util.createNewColumn();
        ev.stopPropagation();
    }
});
