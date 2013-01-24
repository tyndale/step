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
// call the initialisation functions



init();

//some extensions (perhaps should go in another file)
String.prototype.startsWith = function(nonEscapedString) { 
    var str = nonEscapedString.replace('+', '\\+');
    return (this.match("^"+str)==nonEscapedString); 
};



var topMenu;
var timeline;

function init() {
	$(document).ready(function() {
	    checkValidUser();
	    
	    initMenu();
		$("li[menu-name] a[name]").bind("click", function() { step.menu.handleClickEvent(this); });
		
		initGlobalHandlers();
		initLayout();

		
		initData();

	      // read state from the cookie
        step.state.restore();

        hearViewChanges();
        $.shout("view-change");

        initJira();
	});
}

function initJira() {
    if(location.hostname.toLowerCase().indexOf("step.tyndalehouse.com") >= 0) {
        //init JIRA hook
        jQuery.ajax({
            url: "js/jira/issue_collector_dfa819bd.js",
            type: "get",
            cache: true,
            dataType: "script"
        });
    
        jQuery.ajax({
            url: "js/jira/issue_collector_bf70a912.js",
            type: "get",
            cache: true,
            dataType: "script"
        });
        
        jQuery.ajax({
            url: "js/jira/issue_collector_88fe2a64.js",
            type: "get",
            cache: true,
            dataType: "script"
        });
    
         window.ATL_JQ_PAGE_PROPS =  {
                 "88fe2a64" : {
                    "triggerFunction": function(showCollectorDialog) {
                        //Requries that jQuery is available! 
                        jQuery("#provideFeedback").click(function(e) {
                            e.preventDefault();
                            showCollectorDialog();
                        });
                    }
                },
                "dfa819bd" : {
                    "triggerFunction": function(showCollectorDialog) {
                        //Requries that jQuery is available! 
                        jQuery("#raiseBug").click(function(e) {
                            e.preventDefault();
                            showCollectorDialog();
                        });
                    }
                }
         }
    } else {
        //hide some links
        $("#provideFeedback, #raiseBug").hide();
    }

}
	
function checkValidUser() {
    //if we're running locally, then just return
    if(window.location.host.startsWith("localhost")) {
        return;
    }
    
    var email = $.localStore("userEmail");
    if(!step.util.isBlank(email)) {
        return;
    }
    
    $("#validUser").dialog({
        buttons: {
            "Register" : function() {
                //to do register
                var name = $("#userName").val();
                var email = $("#userEmail").val();
                
                if(step.util.isBlank(name)) {
                    $("#validationMessage").html("Please provide your name.");
                    $("#validationMessage").css("display", "block");
                    $("#userName").focus();
                    return;
                } 
                
                if(step.util.isBlank(email)) {
                    $("#validationMessage").html("Please provide your email.");
                    $("#validationMessage").css("display", "block");
                    $("#userEmail").focus();
                    return;
                }
                
                var self = this;
                $.getSafe(USER_CHECK, [email, name], function(data) {
                    if(""+data == "true") {
                        //success so store information
                        $.localStore("userEmail", email);
                        $.localStore("userName", name);
                        $(self).dialog("close");
                    } else {
                        //say sorry and reset form
                        $("#validationMessage").html(__s.error_registration_closed);
                        $("#validationMessage").css("display", "block");
                    }
                });
            }
        },
        modal: true,
        closeOnEscape: false,
        title: __s.register_to_use_step
    });
    
    $("#ui-dialog-title-validUser").parent().css("display", "none");
}


function refreshLayout() {
	//we resize the heights:
	var windowHeight = $(window).height();
	var topMenuHeight = $("#topMenu").height();
	var imageAndFooterHeight = $(".northBookmark").height() + $(".logo").height();
	var bottomSectionHeight = $("#bottomSection").height();
	var windowWithoutMenuNorModule = windowHeight - topMenuHeight - bottomSectionHeight; 
	var bookmarkHeight = windowWithoutMenuNorModule - imageAndFooterHeight ;
	
	$("body").height($(window).height()-10);
	$(".bookmarkPane").height(bookmarkHeight);
	
	
	step.passage.ui.resize();
}

function hearViewChanges() {
    
    $(window).hear("view-change", function(self, data) {
        var view = data == undefined ||  data.viewName == undefined ? step.state.view.getView() : data.viewName;  
        step.state.view.storeView(view);
        
        if(view == 'SINGLE_COLUMN_VIEW') {
            if(isSmallScreen()) {
                doSmallScreenView();
            } else {
                $(".leftColumn").removeClass("column").addClass("singleColumn");
                $(".column").toggle(false);
                $("#centerPane").toggle(false);
                
                //add the holding page
                $("#holdingPage").toggle(true);
                $(".leftColumn").resizable({ handles: 'e', resize: function(e, ui) { 
                    //called when the left column is resized
                    adjustColumns();
                }});
                adjustColumns();
            }
       } else {
           $(".column").toggle(true);
           $(".leftColumn").removeClass("singleColumn").addClass("column");
           $("#centerPane").toggle(true);
           $("#holdingPage").toggle(false);
           $(".leftColumn").resizable("destroy");
           step.toolbar.refreshLayout('rightPaneMenu');
       }
        
        $.shout("view-change-done");
    });
}

function isSmallScreen() {
    return window.screen.availWidth < 1030;
}

function doSmallScreenView() {
        $(".rightColumn, #holdingPage,#centerPane").css("display", "none");
        $(".leftColumn").css("width", "100%");
}

function adjustColumns() {
    var windowWidth = $(window).width();
    var firstColumnWidth = $(".singleColumn").width();
    $("#holdingPage").width(windowWidth - firstColumnWidth -5);
}

/**
 * initialises layout
 */
function initLayout() {
    //add the defaults slider bar
    $("#topMenu").detailSlider({title: __s.view_title_controls_level_of_detail, key : "top"});
    $(document).hear("slideView-top", function(self, data) {
        var value = $("#topMenu").detailSlider("value");
        $(".detailSliderContainer").parent().not("#topMenu").detailSlider("update", { value : value});
    });
    
    
	$("body").hear("passage-changed", function() {
		refreshLayout();
	});
	
	//listen to layout changes and alert
	$(window).resize(function() {
		refreshLayout();
	});
	
	
}

function initMenu() {
//	topMenu = new TopMenu($("#topMenu-ajax"));		
	var menusToBe = $(".innerMenus");
	menusToBe.each(function(index, value) {
		new ToolbarMenu(index, value);
	});
}

/**
 * sets up the initial data and passages
 */
function initData() {
	
	//get all supported versions
	var options = {};
	$.getSafe(BIBLE_GET_ALL_FEATURES, function(data) {
			options = data;
	});
	
	//get data for passages
	// make call to server first and once, to cache all passages:
	$.getSafe(BIBLE_GET_MODULES + true, function(versionsFromServer) {
	    step.versions = versionsFromServer.versions;
	    step.keyedVersions = {};
	    step.strongVersions = {};
	    for(var i = 0; i < step.versions.length; i++) {
	        step.keyedVersions[step.versions[i].initials.toUpperCase()] = step.versions[i];
	        
	        if(step.versions[i].hasStrongs) {
	            step.strongVersions[step.versions[i].initials.toUpperCase()] = step.versions[i];
	        }
	    }
	    
	    step.user = {
	            language : {
	                code : versionsFromServer.languageCode,
	                name : versionsFromServer.languageName
	            }
	    }
	    
	    $.shout("versions-initialisation-completed");
	    
		var passages = initPassages(options);
		initModules(passages);
	});
}

/**
 * creates the passages components
 * @param allVersions the list of versions to be given to a dropdown
 * @param strongedVersions a list of version containing strong tagging
 * @param options a list of options to be displayed in the toolbar
 * @return a list of passage objects so that synchronous calls can be made
 */
function initPassages(options) {
	//set up initial passages with reference data:
	var passages = [];
	
	$(".column, .singleColumn").each(
		function(index) {
			var passageContainer = $(".passageContainer", this);
			passages.push(new Passage(passageContainer, index));
		}
	);
	return passages;
}

function initGlobalHandlers() {
	//set always visible - should probably be its own class
	$( "#loading" ).position({
		of: $( "body" ),
		my: "top",
		at: "top",
		collision: "fit"
	});
	
	//TODO refactor as error object
	$("#error").slideUp(0);
	$("#error").click(function() {
		$(this).slideUp(250);
	});
	
	$("#error").hear("caught-error-message", function(selfElement, data) {
		step.util.raiseError(data);
	});
	
	
	var infoBar = $(".infoBar").toggle(false);
	infoBar.find(".closeInfoBar").click(function() {
	    $(this).closest(".infoBar").toggle(false);
	    step.passage.ui.resize();
	}); 
}

function isFullyVisible (elem) {
    var off = elem.offset();
    var et = off.top;
    var el = off.left;
    var eh = elem.height();
    var ew = elem.width();
    var wh = window.innerHeight;
    var ww = window.innerWidth;
    var wx = window.pageXOffset;
    var wy = window.pageYOffset;
    return (et >= wy && el >= wx && et + eh <= wh + wy && el + ew <= ww + wx);  
  }

/**
 * initialises the modules 	
 * @param passages a list of passages that were provided
 */
function initModules(passages) {
	new LexiconDefinition();

	var bottomSection = $("#bottomSectionContent");
	timeline = new TimelineWidget(bottomSection);
	new GeographyWidget(bottomSection, passages);
}


