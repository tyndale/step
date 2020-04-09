var HeaderView = Backbone.View.extend({
    events: {
        "click .showStats": "toggleSidebar"
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
    }
});
