var ExamplesView = Backbone.View.extend({
	exampleTemplate: _.template(
		'<div id="welcomeExamples" class="passageContainer examplesContainer">' +
			'<a class="closeColumn" title="<%= __s.close %> />">' +
				'<i class="glyphicon glyphicon-remove"></i>' +
			'</a>' +
			'<h3><%= __s.simple_intro_welcome %></h3>' +
			'<h4><%= __s.simple_intro_tyndale_house_project %></h4>' +
			'<p><%= __s.simple_intro %></p>' +
			'<div class="accordion-row" data-row="0">' +
				'<h5 class="accordion-heading"><%= __s.quick_tutorial_header1 %>' +
					'<span class="plusminus">+</span>' +
				'</h5>' +
				'<div class="accordion-body">' +
					'<br>' +
					'<span class="input-group" style="overflow: hidden">' +
					'<a href="/?q=version=ESV|reference=Ps.23&options=VHNUG" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">ESV</span><span class="argSelect select-reference">Psalm 23</span></span>' +
					'</a>' +
					'</span>' +
					'<span class="explanationText"><%= __s.simple_passage_explanation %></span>' +
					'<a href="javascript:step.util.showVideoModal(\'Psalm23.gif\', 15)">&nbsp;<span class="glyphicon glyphicon-film" style="font-size:16px"></span></a>' +

					'<span class="input-group" style="overflow: hidden">' +
					'<a href="/?q=version=NIV|version=ESV|version=KJV|reference=Joh.3&options=HVGUN&display=COLUMN" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">NIV, ESV, KJV</span><span class="argSelect select-reference">John 3</span></span>' +
					'</a>' +
					'</span>' +
					'<span class="explanationText"><%= __s.multiple_versions_explanation %></span>' +
   					'<a href="javascript:step.util.showVideoModal(\'John3.gif\', 27)">&nbsp;<span class="glyphicon glyphicon-film" style="font-size:16px"></span></a>' +
					
					'<span class="input-group" style="overflow: hidden">' +
					'<a href="/?q=version=ESV|strong=G0080&options=HVNGU" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">ESV</span><span class="argSelect"><span class="glyphicon glyphicon-search" style="color:#498090;line-height:13px;font-size:12px"></span><span class="select-greekMeanings" style="color:#498090;line-height:13px"> brother</span></span></span>' +
					'</a>' +
					'</span>' +
					'<span class="explanationText"><%= __s.simple_search_explanation %></span>' +
   					'<a href="javascript:step.util.showVideoModal(\'ESV_brother.gif\', 39)">&nbsp;<span class="glyphicon glyphicon-film" style="font-size:16px"></span></a>' +

					'<span class="input-group" style="overflow: hidden">' +
						'<a href="/?q=version=NIV|version=ESV|text=land|strong=H2617a&options=VGUVNH&display=INTERLEAVED" title="<%= __s.click_to_try_this %>">' +
						'<span class="form-control input-sm argSummary newArgSummary">' +
						'<span class="argSelect select-version">NIV, ESV</span><span class="argSelect"><span class="glyphicon glyphicon-search" style="color:#498090;line-height:13px;font-size:12px"></span><span class="select-text" style="color:#498090;line-height:13px"> land,&nbsp;</span><span class="select-hebrewMeanings transliteration" style="color:#498090;line-height:13px">he.sed</span></span></span>' +
						'</a>' +
					'</span>' +
					'<span class="explanationText"><%= __s.chained_searches_explanation %></span>' +
   					'<a href="javascript:step.util.showVideoModal(\'ESV_NIV_land_chesed.gif\', 65)">&nbsp;<span class="glyphicon glyphicon-film" style="font-size:16px"></span></a>' +

					'<span class="input-group" style="overflow: hidden">' +
					'<a href="/?q=version=ESV|meanings=throne|subject=david|reference=Isa-Rev&options=HNVUG" title="<%= __s.click_to_try_this %>">' +
						'<span class="form-control input-sm argSummary newArgSummary">' +
							'<span class="argSelect select-version">ESV</span>' +
							'<span class="argSelect select-reference">Isa-Rev</span>' +
							'<span class="argSelect">' +
								'<span class="glyphicon glyphicon-search" style="color:#498090;line-height:13px;font-size:12px"></span>' +
								'<span class="select-meanings" style="color:#498090;line-height:13px"> throne, David</span>' +
							'</span>' +
						'</span>' +
					'</a>' +
					'</span>' +
					'<span class="explanationText"><%= __s.chained_searches_explanation_subject %></span>' +
   					'<a href="javascript:step.util.showVideoModal(\'ESV_Isa_Rev_throne_david.gif\', 63)">&nbsp;<span class="glyphicon glyphicon-film" style="font-size:16px"></span></a>' +

					'<span class="input-group" style="overflow: hidden">' +
						'<a href="javascript:cf.setNextPageURL(\'/?q=version=ESV|reference=1Jo.1&options=HVGUN\', \'function:openStats\', \'esv_word_frequency_explanation\')" title="<%= __s.click_to_try_this %>">' +
							'<span class="form-control input-sm argSummary newArgSummary">' +
							'<span class="argSelect select-version">ESV</span><span class="argSelect select-reference">1Jo 1</span>' +
							'&nbsp;<span class=\'glyphicon glyphicon-stats\' style="line-height:13px;color:#498090"></span>' +
						'</a>' +
					'</span>' +
					'<span class="explanationText"><%= __s.esv_word_frequency_explanation %></span>' +
  					'<a href="javascript:step.util.showVideoModal(\'1Joh_passage_analysis.gif\', 12)">&nbsp;<span class="glyphicon glyphicon-film" style="font-size:16px"></span></a>' +

				'</div>' +
			'</div>' +
			'<div class="accordion-row" data-row="1">' +
				'<h5 class="accordion-heading"><%= __s.quick_tutorial_header2 %>' +
					'<span class="plusminus">+</span>' +
				'</h5>' +
				'<div class="accordion-body">' +
					'<br>' +
					
					'<span class="input-group" style="overflow: hidden">' +
					'<a href="/?q=version=KJV|version=THGNT|reference=John.1&options=HVLUNM&display=INTERLINEAR" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">KJV, THGNT</span><span class="argSelect select-reference">John 1</span></span>' +
					'</a>' +
					'</span>' +
					'<span class="explanationText"><%= __s.interlinear_versions_explanation %></span>' +
   					'<a href="javascript:step.util.showVideoModal(\'KJV_THGNT_John1.gif\', 35)">&nbsp;<span class="glyphicon glyphicon-film" style="font-size:16px"></span></a>' +

					'<span class="input-group" style="overflow: hidden">' +
					'<a href="/?q=version=OHB|version=ESV&options=LVUMCHN&display=INTERLINEAR" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">OHB, ESV</span><span class="argSelect select-reference">Gen 1</span></span>' +
					'</a>' +
					'</span>' +
					'<span class="explanationText"><%= __s.interlinear_versions_explanation %></span>' +
   					'<a href="javascript:step.util.showVideoModal(\'OHB_ESV_Gen1.gif\', 40)">&nbsp;<span class="glyphicon glyphicon-film" style="font-size:16px"></span></a>' +

					'<span class="input-group" style="overflow: hidden">' +
                    '<a href="/?q=version=ESV|reference=John.1&options=TLHVAGUN" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">ESV</span><span class="argSelect select-reference">John 1</span>' +
					'&nbsp;<span class=\'glyphicon glyphicon-cog\' style="line-height:13px;color:#498090">&nbsp;</span><span style="line-height:13px;color:#498090"><%= __s.display_greekVocab %></span></span>' +
					'</a>' +
					'</span>' +
					'<span class="explanationText"><%= __s.vocab_explanation %></span>' +
   					'<a href="javascript:step.util.showVideoModal(\'ESV_orig_voc_transliteration.gif\', 35)">&nbsp;<span class="glyphicon glyphicon-film" style="font-size:16px"></span></a>' +
                
				'</div>' +
			'</div>' +
			'<div class="accordion-row" data-row="2">' +
				'<h5 class="accordion-heading"><%= __s.quick_tutorial_header3 %>' +
					'<span class="plusminus">+</span>' +
				'</h5>' +
				'<div class="accordion-body">' +
					'<br>' +

					'<span class="input-group" style="overflow: hidden">' +
					'<a href="javascript:cf.setNextPageURL(\'/?q=version=KJV|reference=Col.3&options=HVGUNC\', \'verb, imperative mood\', \'kjv_verb_imperative_explanation\')" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">KJV</span><span class="argSelect select-reference">Col 3</span>' +
					'&nbsp;<span class=\'glyphicon glyphicon-cog\' style="line-height:13px;color:#498090">&nbsp;</span><span style="line-height:13px;color:#498090"><%= __s.display_grammarColor %></span></span>' +
					'</a>' +
					'</span>' +
					'<span class="explanationText"><%= __s.kjv_verb_imperative_explanation %></span>' +
   					'<a href="javascript:step.util.showVideoModal(\'color_code_1.gif\', 92)">&nbsp;<span class="glyphicon glyphicon-film" style="font-size:16px"></span></a>' +

					'<span class="input-group" style="overflow: hidden">' +
					'<a href="javascript:cf.setNextPageURL(\'/?q=version=KJV|reference=Col.1&options=HVGUNC\', \'verb, main vs supporting verbs\', \'kjv_verb_main_supporting_explanation\')" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version" style="line-height:13px">KJV</span>' +
					'<span class="argSelect select-reference" style="line-height:13px">Col 1</span>' +
					'&nbsp;<span class=\'glyphicon glyphicon-cog\' style="line-height:13px;color:#498090">&nbsp;</span><span style="line-height:13px;color:#498090"><%= __s.display_grammarColor %></span></span>' +
					'</a>' +
					'</span>' +
					'<div class="explanationText"><%= __s.kjv_verb_main_supporting_explanation %></div>' +
					
					'<span class="input-group" style="overflow: hidden">' +
					'<a href="javascript:cf.setNextPageURL(\'/?q=version=KJV|reference=Mat.1&options=HVGUNC\', \'gender and number\', \'kjv_verb_number_and_gender_explanation\')" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">KJV</span><span class="argSelect select-reference">Mat 1</span>' +
					'&nbsp;<span class=\'glyphicon glyphicon-cog\' style="line-height:13px;color:#498090">&nbsp;</span><span style="line-height:13px;color:#498090"><%= __s.display_grammarColor %></span></span>' +
					'</a>' +
					'</span>' +
					'<div class="explanationText"><%= __s.kjv_verb_number_and_gender_explanation %></div>' +

					'<span class="input-group" style="overflow: hidden">' +
					'<a href="javascript:cf.setNextPageURL(\'/?q=version=KJV|reference=Eph.1&options=HVGUNC\', \'verb, gender and number\', \'look_at_color_table\')" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">KJV</span><span class="argSelect select-reference">Eph 1</span>' +
					'&nbsp;<span class=\'glyphicon glyphicon-cog\' style="line-height:13px;color:#498090">&nbsp;</span><span style="line-height:13px;color:#498090"><%= __s.display_grammarColor %></span></span>' +
					'</a>' +
					'</span>' +
					'<div class="explanationText"><%= __s.kjv_verb_colour_explanation %></div>' +
					
					'<span class="input-group" style="overflow: hidden">' +
					'<a href="javascript:cf.setNextPageURL(\'/?q=version=SBLG|reference=Rom.12&options=CEMVALHUN\', \'verb, gender and number\', \'look_at_color_table\')" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">SBLG</span><span class="argSelect select-reference">Rom 12</span>' +
					'&nbsp;<span class=\'glyphicon glyphicon-cog\' style="line-height:13px;color:#498090">&nbsp;</span><span style="line-height:13px;color:#498090"><%= __s.display_grammarColor %></span></span>' +
					'</a>' +
					'</span>' +
                   
					'<div class="explanationText">Look at Greek New Testament with color code grammar, Greek root word and English vocabulary</div>' +
					'<span class="input-group" style="overflow: hidden">' +
					'<a href="javascript:cf.setNextPageURL(\'/?q=version=THOT|reference=Gen.1&options=HVLUNC\', \'verb, gender and number\', \'\')" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">THOT</span><span class="argSelect select-reference">Gen 1</span>' +
					'&nbsp;<span class=\'glyphicon glyphicon-cog\' style="line-height:13px;color:#498090">&nbsp;</span><span style="line-height:13px;color:#498090"><%= __s.display_grammarColor %></span></span>' +
					'</a>' +
					'</span>' +
					'<div class="explanationText">Look at Hebrew Testament with color code grammar and morphology information in the lexicon</div>' +
					
					'<span class="input-group" style="overflow: hidden">' +
					'<a href="javascript:cf.setNextPageURL(\'/?q=version=CUn|reference=Col.1&options=HVGUNC\', \'verb, gender and number\', \'look_at_color_table\')" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">CUn</span><span class="argSelect select-reference">Col 1</span>' +
					'&nbsp;<span class=\'glyphicon glyphicon-cog\' style="line-height:13px;color:#498090">&nbsp;</span><span style="line-height:13px;color:#498090"><%= __s.display_grammarColor %></span></span>' +
					'</a>' +
					'</span>' +
					'<div class="explanationText">Look at Chinese Union New Testament with color highlighted verbs</div>' +
					
					'<span class="input-group" style="overflow: hidden">' +
					'<a href="javascript:cf.setNextPageURL(\'/?q=version=SBLG|version=KJV|version=CUn|reference=Eph.5&options=CVLHUVNEAM&display=INTERLEAVED\', \'verb, gender and number\', \'look_at_color_table\')" title="<%= __s.click_to_try_this %>">' +
					'<span class="form-control input-sm argSummary newArgSummary">' +
					'<span class="argSelect select-version">SBLG, KJV, CUn</span><span class="argSelect select-reference">Eph 5</span>' +
					'&nbsp;<span class=\'glyphicon glyphicon-cog\' style="line-height:13px;color:#498090">&nbsp;</span><span style="line-height:13px;color:#498090"><%= __s.display_grammarColor %></span></span>' +
					'</a>' +
					'</span>' +
					'<div class="explanationText"><%= __s.interlinear_verb_color_explanation %></div><div id=\'colorCodeTableDiv\'></div>' +
				'</div>' +
			'</div>' +
			'<div class="text-muted step-copyright">' +
				'<span>&copy; <a href="http://www.tyndale.cam.ac.uk" target="_blank">STEPBible</a> - 2021</span>' +
			'</div>' +
		'</div>'
	),
    events: {
        'click .closeColumn': 'onClickClose',
        'click .accordion-heading': 'onClickHeading'
    },
    initialize: function () {
        this.render();
    },
    render: function () {
        //this.$el.load("/jsps/examples.jsp", null, _.bind(this.initAccordions, this));
		if ($('#welcomeExamples').length == 0) this.$el.append(this.exampleTemplate);
        this.initAccordions();
    },
    initAccordions: function () {
        var count = this.$el.find(".accordion-row").length;
        var i;
        var hasStoredState = false;

        for (i = 0; i < count; i++) {
            if (localStorage.getItem("stepBible-displayQuickTryoutAccordion" + i) === "true") {
                hasStoredState = true;
                this.toggleAccordion(i);
            }
        }

        if (!hasStoredState) {
            this.toggleAccordion(0);
        }
    },
    toggleAccordion: function (index) {
        var query = ".accordion-row[data-row=" + index + "]";
        var $accordionRow = this.$el.find(query);
        var $accordionBody = $accordionRow.find(".accordion-body");
        var storageKey = "stepBible-displayQuickTryoutAccordion" + index;

        if ($accordionBody.is(":visible")) {
            $accordionRow.find(".accordion-body").slideUp();
            $accordionRow.find(".plusminus").text("+");
            localStorage.setItem(storageKey, "false");
        }
        else {
            $accordionRow.find(".accordion-body").slideDown();
            $accordionRow.find(".plusminus").text("-");
            localStorage.setItem(storageKey, "true");
        }
    },
    onClickHeading: function (event) {
		event.stopImmediatePropagation();
		event.stopPropagation(); //prevent the bubbling up
        var $target = $(event.target);
        var $accordionRow = $target.parent();
        var index = $accordionRow.attr("data-row");
        this.toggleAccordion(index);
    },
    onClickClose: function () {
        step.util.showOrHideTutorial(true);
    },
	showVideoModal: function (videoFile) {
        var element = document.getElementById('videoModal');
        if (element) element.parentNode.removeChild(element);
        var videoModalDiv = $('<div id="videoModal" class="modal selectModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-test="' + videoFile + '">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">');
        videoModalDiv.appendTo("body");
        $('#videoModal').modal('show').find('.modal-content').load('/html/video_modal.html');
    }
});
