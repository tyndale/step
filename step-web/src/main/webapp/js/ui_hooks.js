/*******************************************************************************
 * Copyright (c) 2012, Directors of the Tyndale STEP Project
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions 
 * are met:
 * 
 * Redistributions of source code must retain the above copyright 
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright 
 * notice, this list of conditions and the following disclaimer in 
 * the documentation and/or other materials provided with the 
 * distribution.
 * Neither the name of the Tyndale House, Cambridge (www.TyndaleHouse.com)  
 * nor the names of its contributors may be used to endorse or promote 
 * products derived from this software without specific prior written 
 * permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS 
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE 
 * COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, 
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT 
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING 
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF 
 * THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/

/**
 * This file defines a number of hooks that the server code can call. The aim is
 * to redirect the calls quickly to other parts of the UI
 * 
 * The other calls here are for the menu system which are executing in any
 * particular context
 */

// ///////////////////////////////////////////////////////////////////////
// The following section defines method names and controller names
// These are used as part of the rest-like calls
// ///////////////////////////////////////////////////////////////////////
BOOKMARKS_GET =                     STEP_SERVER_BASE_URL + "favourites/getBookmarks";
BOOKMARKS_ADD =                     STEP_SERVER_BASE_URL + "favourites/addBookmark/";
HISTORY_GET =                       STEP_SERVER_BASE_URL + "favourites/getHistory/";
HISTORY_ADD =                       STEP_SERVER_BASE_URL + "favourites/addHistory/";

ALTERNATIVE_TRANSLATIONS =          STEP_SERVER_BASE_URL + "alternativeTranslations/get/"

BIBLE_GET_MODULES =                 STEP_SERVER_BASE_URL + "bible/getModules/";
BIBLE_GET_BIBLE_TEXT =              STEP_SERVER_BASE_URL + "bible/getBibleText/";
BIBLE_GET_FEATURES =                STEP_SERVER_BASE_URL + "bible/getFeatures/";
BIBLE_GET_ALL_FEATURES =            STEP_SERVER_BASE_URL + "bible/getAllFeatures/";
BIBLE_GET_BIBLE_BOOK_NAMES =        STEP_SERVER_BASE_URL + "bible/getBibleBookNames/";
BIBLE_GET_NEXT_CHAPTER =            STEP_SERVER_BASE_URL + "bible/getNextChapter/";
BIBLE_GET_PREVIOUS_CHAPTER =        STEP_SERVER_BASE_URL + "bible/getPreviousChapter/";
BIBLE_GET_BY_NUMBER =               STEP_SERVER_BASE_URL + "bible/getBibleByVerseNumber/";
BIBLE_GET_KEY_INFO =                STEP_SERVER_BASE_URL + "bible/getKeyInfo/";
BIBLE_EXPAND_TO_CHAPTER =           STEP_SERVER_BASE_URL + "bible/expandKeyToChapter/";

DICTIONARY_GET_BY_HEADWORD =        STEP_SERVER_BASE_URL + "dictionary/lookupDictionaryByHeadword/";
DICTIONARY_SEARCH_BY_HEADWORD =     STEP_SERVER_BASE_URL + "dictionary/searchDictionaryByHeadword/";

MODULE_GET_ALL_MODULES =            STEP_SERVER_BASE_URL + "module/getAllModules/";
MODULE_GET_ALL_INSTALLABLE_MODULES= STEP_SERVER_BASE_URL + "module/getAllInstallableModules/";
MODULE_GET_INFO =                   STEP_SERVER_BASE_URL + "module/getInfo/";
MODULE_GET_QUICK_INFO =             STEP_SERVER_BASE_URL + "module/getQuickInfo/";

SETUP_INSTALL_FIRST_TIME =          STEP_SERVER_BASE_URL + "setup/installFirstTime/";
SETUP_GET_PROGRESS =                STEP_SERVER_BASE_URL + "setup/getProgress/";
SETUP_IS_COMPLETE =                 STEP_SERVER_BASE_URL + "setup/isInstallationComplete/"
SETUP_INSTALL_BIBLE =               STEP_SERVER_BASE_URL + "setup/installBible/";
SETUP_PROGRESS_INSTALL =            STEP_SERVER_BASE_URL + "setup/getProgressOnInstallation/";
SETUP_PROGRESS_INDEX =              STEP_SERVER_BASE_URL + "setup/getProgressOnIndexing/";
SETUP_REMOVE_MODULE =               STEP_SERVER_BASE_URL + "setup/removeModule/";
SETUP_REINDEX =                     STEP_SERVER_BASE_URL + "setup/reIndex/";

SEARCH_DEFAULT =                    STEP_SERVER_BASE_URL + "search/search/";
SEARCH_ESTIMATES =                  STEP_SERVER_BASE_URL + "search/estimateSearch/"
SEARCH_SUGGESTIONS =                STEP_SERVER_BASE_URL + "search/getLexicalSuggestions/";

SUBJECT_VERSES =                    STEP_SERVER_BASE_URL + "search/getSubjectVerses/";

TIMELINE_GET_EVENTS =               STEP_SERVER_BASE_URL + "timeline/getEvents/";
TIMELINE_GET_EVENTS_IN_PERIOD =     STEP_SERVER_BASE_URL + "timeline/getEventsInPeriod/";
TIMELINE_GET_EVENTS_FROM_REFERENCE= STEP_SERVER_BASE_URL + "timeline/getEventsFromReference/";
TIMELINE_GET_CONFIGURATION =        STEP_SERVER_BASE_URL + "timeline/getTimelineConfiguration";
TIMELINE_GET_EVENT_INFO =           STEP_SERVER_BASE_URL + "timeline/getEventInformation/";

GEOGRAPHY_GET_PLACES =              STEP_SERVER_BASE_URL + "geography/getPlaces/";

USER_CHECK =                        STEP_SERVER_BASE_URL + "user/checkValidUser/";

// ////////////////////////
// SOME DEFAULTS
// ////////////////////////
var DEFAULT_POPUP_WIDTH = 500;
var DETAIL_LEVELS = [ __s.basic_view, __s.intermediate_view, __s.advanced_view ];

/** a simple toggler for the menu items */
function toggleMenuItem(menuItem) {
    // try and find a menu name
    var menuName = getParentMenuName(menuItem);

    var passageId = step.passage.getPassageId(menuItem);
    if (!passageId) {
        passageId = "";
    }

    $.shout("MENU-" + menuName.name, {
        menu : getParentMenuName(menuItem),
        menuItem : {
            element : menuItem,
            name : menuItem.name
        },
        passageId : passageId
    });
};

function getParentMenuName(menuItem) {
    var menu = $(menuItem).closest("li[menu-name]");
    return {
        element : menu,
        name : menu.attr("menu-name")
    };
}

/**
 * show bubble from relevant passage object
 * 
 * @param element
 * @param passageReference
 */
function viewPassage(passageIdOrElement, passageReference, element) {
    // only shout preview if the preview bar is not displaying options on it.
    if (!$("#previewBar").is(":visible") || !$("#previewReference").is(":visible")) {
        var passageId = passageIdOrElement;
        if(isNaN(parseInt(passageIdOrElement))) {
            passageId = step.passage.getPassageId(passageIdOrElement);
            element = passageIdOrElement;
        }
        
        $.shout("show-preview-" + passageId, {
            source : element,
            reference : passageReference
        });
    }
}


/**
 * shows the login popup
 */
function login() {
    $.shout("show-login-popup");
};


/**
 * called when click on a piece of text.
 */
function showDef(source) {
    var s = $(source);

    var strong = s.attr("strong");
    var morph = s.attr("morph");
    var passageId = step.passage.getPassageId(s);

    $.shout("show-all-strong-morphs", {
        strong : strong,
        morph : morph,
        source : source,
        passageId: passageId
    });
};

/**
 * TODO: move this out of here to utils.js if we have more utility
 * classes/functions helper function for morph and strongs
 */
function showInfo(tag, sourceElement) {
    // trigger the parent event - to show everything
    $(sourceElement).parent().click();

    // need to find what event is coming in, to get the clicked element and pass
    // that down
    $("#lexiconDefinition span:contains(" + tag + ")").parent().click();
};

function showArticle(headword, instance) {
    var passageId = $("#selectedPane").val();

    $.getSafe(DICTIONARY_GET_BY_HEADWORD + headword + "/" + instance, function(data) {
        // TODO finish this off...
        $(".passageContainer[passage-id = " + passageId + "]").html(data.text);
    });
}

function makeMasterInterlinear(element, newVersion) {
    $.shout("make-master-interlinear-" + step.passage.getPassageId(element), newVersion);
}

