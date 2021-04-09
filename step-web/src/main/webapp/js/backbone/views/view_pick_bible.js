var PickBibleView = Backbone.View.extend({
    versionTemplate: _.template('' +
        '<% _.each(versions, function(languageBibles, key) { %>' +
        '<span class="langSpan btn_<%= key.replaceAll(/[()\\s,\']/g, "_") %>"><button class="langBtn btn_<%= key.replaceAll(/[()\\s,\']/g, "_") %>" style="background:white">' +
        '<%= key %>&nbsp;<span class="langPlusMinus plusminus_<%= key.replaceAll(/[()\\s,\']/g, "_") %>">+</span></button><br></span>' +
        '<ul class="list-group langUL ul_<%= key.replaceAll(/[()\\s,\']/g, "_") %>" style="display:none">' +
        '<% _.each(languageBibles, function(languageBible) { %>' +
        '<li class="list-group-item" data-initials="<%= languageBible.shortInitials %>">' +
        '<a class="glyphicon glyphicon-info-sign" title="<%= __s.passage_info_about_version %>" target="_blank" href="http://<%= step.state.getDomain() %>/version.jsp?version=<%= languageBible.shortInitials %>"></a>' +
        '<a class="resource" href="javascript:void(0)">' +
        '<%= languageBible.shortInitials %> - <%= languageBible.name %> <span class="pull-right"><%= step.util.ui.getFeaturesLabel(languageBible) %></span></a></li>' +
        '<% }) %>' +
        '</li>' +
        '</ul>' +
        '<% }) %>'),
    filtersTemplate: _.template('<form role="form" class="form-inline">' +
        '<span class="form-group btn-group" data-toggle="buttons">' +
        '<label class="btn btn-default btn-sm"><input type="radio" name="languageFilter" data-lang="_all" /><%= __s.all  %></label>' +
        '<label class="btn btn-default btn-sm"><input type="radio" name="languageFilter" data-lang="en"  checked="checked" /><%= __s.english %></label>' +
        '<% if(step.userLanguageCode != "en") { %>' +
        '<label class="btn btn-default btn-sm"><input type="radio" name="languageFilter" data-lang="<%= step.userLanguageCode %>" /><%= step.userLanguage %></label>' +
        '<% } %>' +
        '<label class="btn btn-default btn-sm"><input type="radio" name="languageFilter" data-lang="_ancient" /><%= __s.ancient %></label>' +
        '</span>' +
		'&nbsp;&nbsp;&nbsp;<button type="button" class="closeModal" data-dismiss="modal">X</button>' +
        '</form>'),
    modalPopupTemplate: _.template('<div class="modal selectModal" id="bibleVersions" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-body">' +
        '<span class="pull-right"><%= view.filtersTemplate({myLanguage: myLanguage}) %></span>' +
        '<ul class="nav nav-tabs">' +
        '<li><a href="#bibleList" data-toggle="tab"><%= __s.bibles %></a></li>' +
        '<li><a href="#commentaryList" data-toggle="tab"><%= __s.commentaries %></a></li>' +
        '</ul>' +
		'<label class="selectGeo" for="selectGeo">Filter languges by geography:</label>' +
		'<select class="selectGeo" onchange=\'step.util.showByGeo()\'>' +
		  '<option value="all">All</option>' +
		  '<option value="africa">Africa</option>' +
		  '<option value="americas">Americas</option>' +
		  '<option value="east_south_east_asia">East and Southeast Asia</option>' +
		  '<option value="europe">Europe</option>' +
		  '<option value="oceania">Oceania</option>' +
		  '<option value="south_asia">South Asia</option>' +
		  '<option value="western_asia">Western Asia</option>' +
		'</select>' +
        '<p>Features: N=Notes G=Grammar V=Vocab I=Interlinear S=Septuagint interlinear A=Alt verse numbers</p>' +
        '<div class="tab-content">' +
        '<div class="tab-pane" id="bibleList">' +
        '</div>' +
        '<div class="tab-pane" id="commentaryList">' +
        '</div>' +
        '</div>' + //end body
        '<div class="modal-footer"><button id ="order_button_bible_modal" class="btn btn-default btn-sm" data-dismiss="modal"><label>Update display order</label></button>' +
                                  '<button id ="ok_button_bible_modal" class="btn btn-default btn-sm" data-dismiss="modal"><label><%= __s.ok %></label></button></div>' +
        '</div>' + //end content
        '</div>' + //end dialog
        '</div>' +
        '</div>'),
    suggestedEnglish: ['ESV', 'NIV', 'NASB_th', 'KJVA', 'NETfull', 'HCSB', 'BSB', 'ASV-TH', 'DRC', 'CPDV'],
    ancientBlackList: ["HebModern"],
    ancientOrder: [
        [__s.widely_used, ['THOT', 'LXX', 'THGNT', 'Byz', 'TR', 'SBLG']],
        [__s.hebrew_ot, ['THOT', "Alep", "OHB", "WLC", "MapM"]],
        [__s.greek_ot, ["LXX_th", "AB", "abpen_th", "abpgk_th"]],
        [__s.greek_nt, ["Ant", "Byz", "Elzevir", "Nestle", "SBLG", "THGNT", "Tisch", "TNT", "TR", "WHNU"]],
        [__s.coptic_texts, ["CopNT", "CopSahHorner", "CopSahidica", "CopSahidicMSS"]],
        [__s.latin_texts, ["DRC", "Vulgate", "VulgSistine", "VulgHetzenauer", "VulgConte", "VulgClementine"]],
        [__s.coptic_texts, ["CopNT", "CopSahHorner", "CopSahidica", "CopSahidicMSS"]],
        [__s.syriac_texts, ["Peshitta", "Etheridge", "Murdock"]],
        [__s.alternative_samaritan, ["SP", "SPMT", "SPVar", "SPDSS", "SPE"]],
        [__s.uncategorized_resources, []]
    ],
    userHasUpdated: false,
    numberOfVersionsSelected: 0,
    el: function () {
        var el = $("<div>");
        $("body").append(el);
        return el;
    },
    _populateAncientBibles: function (arr) {
        var addedBibles = {};
        if (_.isEmpty(arr)) {
            //pre-populate the groups in the right order
            for (var i = 0; i < this.ancientOrder.length; i++) {
                var group = arr[this.ancientOrder[i][0]] = [];
                for (var j = 0; j < this.ancientOrder[i][1].length; j++) {
                    var currentVersion = step.keyedVersions[this.ancientOrder[i][1][j]];
                    if (currentVersion) {
                        group.push(currentVersion);
                        addedBibles[currentVersion.shortInitials] = currentVersion;
                    }
                }
            }
        }
        return addedBibles;
    },
    _addGroupingByLanguage: function (arr, key, version) {
        //we don't add it if the key isn't the short initials
        if(key != version.shortInitials) {
            return;
        }
        
        if (!arr[version.languageName]) {
            arr[version.languageName] = [];
        }
        arr[version.languageName].push(version);
    },
    initialize: function (opts) {
        _.bindAll(this);
        var self = this;
        this.searchView = opts.searchView;

        this.$el.append(this.modalPopupTemplate({
            view: this,
            myLanguage: "en"
        }));

        //make the right button active
        var language = this._getLanguage();
        userHasUpdated = false;
        this.$el.find(".btn").has("input[data-lang='" + language + "']").addClass("active");

        var navTabsLi = $(".nav-tabs li");
        navTabsLi.has("a[href='" + this._getSelectedTab() + "']").addClass("active");
        navTabsLi.on('shown.bs.tab', function (event) {
            self.model.save({ selectedVersionsTab: $(event.target).attr("href") });
            self._filter();
        });

        this.$el.find(this._getSelectedTab()).addClass("active");
        this.bibleVersions = this.$el.find("#bibleVersions").modal({ show: true});
        this.$el.find("input[type='text']").focus();
        this.$el.find(".btn").click(this.handleLanguageButton);
        this.$el.find(".closeModal").click(this.closeModal);
        this.$el.find("#order_button_bible_modal").click(this.orderButton);
        this.$el.find("#ok_button_bible_modal").click(this.okButton);
        $('#bibleVersions').on('hidden.bs.modal', function (ev) {
            $('#bibleVersions').remove(); // Need to be removed, if not the next call to this routine will display an empty tab (Bible or Commentary).
        });
        this._filter();
    },
    closeModal: function (ev) {
        if (ev) ev.preventDefault();
        this.bibleVersions.modal("hide");
        this.remove();
    },
    orderButton: function (ev) {
        this.closeModal(ev);
        var orderVersionDiv = $('<div id="orderVersionModal" class="modal selectModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">');
        if (document.getElementById('orderVersionModal')) {
            var element = document.getElementById('orderVersionModal');
            element.parentNode.removeChild(element);
        }
        orderVersionDiv.appendTo("body");
        $('#orderVersionModal').modal('show').find('.modal-content').load('/html/order_version.html');
    },
    okButton: function (ev) {
        this.closeModal(ev);
        if (userHasUpdated) {
            userHasUpdated = false;
            window.searchView.search();
            return;
        }
    },
    handleLanguageButton: function (ev) {
        var target = $(ev.target).find("input");
        var language = target.data("lang");

        this.model.save({
            selectedLanguageSet: language
        });
        this._filter();
    },
    _getSelectedTab: function () {
        var selectedTab = this.model.get("selectedVersionsTab");
        if (selectedTab == null) {
            selectedTab =  "#bibleList";
            this.model.save({
                selectedVersionsTab: selectedTab
            })
        }
        return selectedTab;
    },
    _getLanguage: function () {
        var selectedLanguage = this.model.get("selectedLanguageSet");
        if (selectedLanguage == null) {
            selectedLanguage = step.userLanguageCode;
            this.model.save({ selectedLanguageSet: selectedLanguage });
        }
        return selectedLanguage;
    },
    _filter: function () {
        var self = this;
        var selectedTab = this._getSelectedTab();
        var selectedLanguage = this._getLanguage();
		if (selectedLanguage == "zh_TW") selectedLanguage = "zh";

        var filter = "BIBLE"
        var showGeoSelection = false;
        if (selectedTab == '#commentaryList') {
            filter = "COMMENTARY";
        }
        else if (selectedLanguage == "_all") showGeoSelection = true;

        var bibleList = {};
        if (selectedLanguage == "_ancient" && filter == 'BIBLE') {
            var added = this._populateAncientBibles(bibleList);
            //now go through Bibles adding if not already present
            for (var v in step.keyedVersions) {
                var version = step.keyedVersions[v];
                if ((version.languageCode == 'he' || version.languageCode == 'grc') &&
                    version.category == 'BIBLE' && 
                    !added[version.shortInitials] &&
                    this.ancientBlackList.indexOf(version.shortInitials) == -1) {
                    bibleList[this.ancientOrder[this.ancientOrder.length - 1][0]].push(version);
                }
            }
        } else {
            if (selectedLanguage == 'en' && filter == 'BIBLE') {
                //if English, add the English Bibles first...
                for (var i = 0; i < this.suggestedEnglish.length; i++) {
                    var v = step.keyedVersions[this.suggestedEnglish[i]];
                    if (v) {
                        if (!bibleList[__s.widely_used]) {
                            bibleList[__s.widely_used] = [];
                        }
                        bibleList[__s.widely_used].push(v);
                    }
                }
            }

            for (var v in step.keyedVersions) {
                var version = step.keyedVersions[v];
                if(version.category != filter) {
                    continue;
                }

                if (this._isLanguageValid(version.languageCode, selectedLanguage)) {
                    if (selectedLanguage == "_all") {
                        //now filter by language:
                        this._addGroupingByLanguage(bibleList, v, version);
                    } else if (selectedLanguage == "en") {
                        if (version.languageCode == "en") {
                            this._addGroupingByLanguage(bibleList, v, version);
                        }
                    } else if(selectedLanguage == "_ancient") { 
                        if((version.languageCode == 'he' || version.languageCode == 'grc')) {
                            this._addGroupingByLanguage(bibleList, v, version);
                        }  
                    } else {
                        // a single non-English language, so can re-use the group by functionality
                        this._addGroupingByLanguage(bibleList, v, version);
                    }
                }
            }
        }
        this.$el.find(".tab-pane").empty();
        this.$el.find(selectedTab).append(this.versionTemplate({
            versions: bibleList
        }));

        this.$el.find(".glyphicon-info-sign").click(function (ev) {
            ev.stopPropagation();
        });
        var versionsSelected = (typeof self.searchView._getCurrentInitials === "undefined") ?
			window.searchView._getCurrentInitials() : self.searchView._getCurrentInitials();
        numberOfVersionsSelected = 0;
        for (i = 0; ((i < versionsSelected.length) && (numberOfVersionsSelected <= 1)); i ++) {
            if (versionsSelected[i] !== undefined) numberOfVersionsSelected ++;
        }
        if (numberOfVersionsSelected > 1) $('#order_button_bible_modal').show();
        else $('#order_button_bible_modal').hide();
        this.$el.find(".list-group-item").click(function () {
            var target = $(this);
            var version = step.keyedVersions[target.data("initials")];

            //also look for the item in the rest of the list and mark that
            self.$el.find("[data-initials='" + version.shortInitials + "']").toggleClass("active");
            var added = target.hasClass("active");
            userHasUpdated = true;
            if (added) {
                Backbone.Events.trigger("search:add", { value: version, itemType: VERSION });
                numberOfVersionsSelected ++;
            } else {
                Backbone.Events.trigger("search:remove", { value: version, itemType: VERSION});
                numberOfVersionsSelected --;
            }
            if (numberOfVersionsSelected > 1) $('#order_button_bible_modal').show();
            else $('#order_button_bible_modal').hide();
        }).each(function (i, item) {
            var el = $(this);
            if (versionsSelected.indexOf(el.data("initials")) != -1) {
                el.addClass("active");
            }
        });
        this._addTagLine();
        if (showGeoSelection) $('.selectGeo').show();
        else {
            $('.selectGeo').hide();
            $('.langSpan').show();
            $('.langSpan').css('background', 'white').css('color', 'black');
            $('.langBtn').show();
            $('.langBtn').css('background', '#336600').css('color', 'white');
            $('.langPlusMinus').text('-');
            $('.langUL').show();
        }
        this.$el.find(".langBtn").click(this._handleUsrClick);
    },
    _addTagLine: function(){
        var bibleVersions = $("#bibleVersions");
        var length = bibleVersions.find(".list-group-item").length;
        var total = step.itemisedVersions.length;
        var message = '<span class="tagLine">' + sprintf(__s.filtering_total_bibles_and_commentaries, length, total) + "</span>";
        this.bibleVersions.find(".modal-footer").find(".tagLine").remove().end().prepend(message);
        
    },
    _isLanguageValid: function (actualLanguage, wantedLanguage) {
        if (wantedLanguage == "_all") {
            return true;
        }
        if (wantedLanguage == "_ancient") {
            return actualLanguage == "he" || actualLanguage == "grc";
        }
        return actualLanguage == wantedLanguage;
    },
    _handleUsrClick: function (event) {
        var btnClassName = "";
        var plusminusClassName = "";
        var ulClassName = "";
        for (var i = 0; i < event.target.classList.length; i++) {
            if ((event.target.classList[i].substr(0, 4) === "btn_") ||
                (event.target.classList[i].substr(0, 10) === "plusminus_")) {
                btnClassName = '.' + event.target.classList[i];
                plusminusClassName = ".plusminus_" + event.target.classList[i].substr(4);
                ulClassName = ".ul_" + event.target.classList[i].substr(4);
                break;
            }
        }
        if (btnClassName !== "") {
            if ($(ulClassName).is(":visible")) {
                $(ulClassName).hide();
                $(btnClassName).css('background', 'white').css('color', 'black');
                $(plusminusClassName).text('+');
            }
            else {
                $(ulClassName).show();
                $(btnClassName).css('background', '#336600').css('color', 'white');
                $(plusminusClassName).text('-');
            }
        }
    }
});