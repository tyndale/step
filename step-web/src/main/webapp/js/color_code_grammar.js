function ULOBJ(nameOfUlObj) {
  this.name = nameOfUlObj;
  this.img = new Image();
  this.canvas = null;
  this.context = null;
  this.animCount = 0;
  this.animIncrement = 1;
  this.displayStatusSelectedByMood = true;
  this.displayStatusSelectedByTense = true;
}
var uLBASEIMGS = [new ULOBJ('ulArrow'), new ULOBJ('ulDash'), new ULOBJ('ulSolid'),
                  new ULOBJ('ulDoubleSolid'), new ULOBJ('ulDot'), new ULOBJ('ulWave'),
                  new ULOBJ('ulDashDot'), new ULOBJ('ulDashDotDot'), new ULOBJ('ulShortArrow'),
                  new ULOBJ('ulReverseArrow'), new ULOBJ('ulShortReverseArrow'), new ULOBJ('ulNone')
];

var ulVerbCSS = [
  new ULOBJ('pai'), /* 0 */  new ULOBJ('pmi'), /* 1 */  new ULOBJ('ppi'), // 2
  new ULOBJ('pas'), /* 3 */  new ULOBJ('pms'), /* 4 */  new ULOBJ('pps'), // 5
  new ULOBJ('pao'), /* 6 */  new ULOBJ('pmo'), // 7
  new ULOBJ('pam'), /* 8 */  new ULOBJ('pmm'), /* 9 */  new ULOBJ('ppm'), // 10
  new ULOBJ('pan'), /* 11 */ new ULOBJ('pmn'), /* 12 */ new ULOBJ('ppn'), // 13
  new ULOBJ('pap'), /* 14 */ new ULOBJ('pmp'), /* 15 */ new ULOBJ('ppp'), // 16

  new ULOBJ('iai'), /* 17 */ new ULOBJ('imi'), /* 18 */ new ULOBJ('ipi'), // 19
  new ULOBJ('ias'), // 20
  new ULOBJ('iap'), // 21

  new ULOBJ('rai'), /* 22 */ new ULOBJ('rmi'), /* 23 */ new ULOBJ('rpi'), // 24
  new ULOBJ('ras'), /* 25 */
  new ULOBJ('rao'), /* 26 */
  new ULOBJ('ram'), /* 27 */ new ULOBJ('rmm'), /* 28 */ new ULOBJ('rpm'), // 29
  new ULOBJ('ran'), /* 30 */ new ULOBJ('rmn'), /* 31 */ new ULOBJ('rpn'), // 32
  new ULOBJ('rap'), /* 33 */ new ULOBJ('rmp'), /* 34 */ new ULOBJ('rpp'), // 35

  new ULOBJ('lai'), /* 36 */ new ULOBJ('lmi'), /* 37 */ new ULOBJ('lpi'), // 38
                             new ULOBJ('lmp'), /* 39 */ new ULOBJ('lpp'), // 40

  new ULOBJ('aai'), /* 41 */ new ULOBJ('ami'), /* 42 */ new ULOBJ('api'), // 43
  new ULOBJ('aas'), /* 44 */ new ULOBJ('ams'), /* 45 */ new ULOBJ('aps'), // 46
  new ULOBJ('aao'), /* 47 */ new ULOBJ('amo'), /* 48 */ new ULOBJ('apo'), // 49
  new ULOBJ('aam'), /* 50 */ new ULOBJ('amm'), /* 51 */ new ULOBJ('apm'), // 52
  new ULOBJ('aan'), /* 53 */ new ULOBJ('amn'), /* 54 */ new ULOBJ('apn'), // 55
  new ULOBJ('aap'), /* 56 */ new ULOBJ('amp'), /* 57 */ new ULOBJ('app'), // 58

  new ULOBJ('fai'), /* 59 */ new ULOBJ('fmi'), /* 60 */ new ULOBJ('fpi'), // 61
  new ULOBJ('fas'), /* 62 */ new ULOBJ('fms'), /* 63 */ new ULOBJ('fps'), // 64
  new ULOBJ('fao'), /* 65 */ new ULOBJ('fmo'), /* 66 */
  new ULOBJ('fan'), /* 67 */ new ULOBJ('fmn'), /* 68 */ new ULOBJ('fpn'), // 69
  new ULOBJ('fam'), // 70 
  new ULOBJ('fap'), /* 71 */ new ULOBJ('fmp'), /* 72 */ new ULOBJ('fpp')  // 73
];

var ulOTVbCSS = [];

function NAMEANDARRAY(argName, argArray) {
  this.name = argName;
  this.array = argArray;
}
var moodIndexArray = [
  new NAMEANDARRAY('indicative', [0, 1, 2, 17, 18, 19, 22, 23, 24, 36, 37, 38, 41, 42, 43, 59, 60, 61]),
  new NAMEANDARRAY('subjunctive', [3, 4, 5, 20, 25, 44, 45, 46, 62, 63, 64]),
  new NAMEANDARRAY('optative', [6, 7, 26, 47, 48, 49, 65, 66]),
  new NAMEANDARRAY('imperative', [8, 9, 10, 27, 28, 29, 50, 51, 52, 70]),
  new NAMEANDARRAY('infinitive', [11, 12, 13, 30, 31, 32, 53, 54, 55, 67, 68, 69]),
  new NAMEANDARRAY('participle', [14, 15, 16, 21, 33, 34, 35, 39, 40, 56, 57, 58, 71, 72, 73])
];

var tenseIndexArray = [
  new NAMEANDARRAY('present', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
  new NAMEANDARRAY('imperfect', [17, 18, 19, 20, 21]),
  new NAMEANDARRAY('perfect', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]),
  new NAMEANDARRAY('pluperfect', [36, 37, 38, 39, 40]),
  new NAMEANDARRAY('aorist', [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58]),
  new NAMEANDARRAY('future', [59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73])
];

var activeIndexArray = [0, 3, 6, 8, 11, 14, 17, 20, 21, 22, 25, 26, 27, 30, 33, 36, 41, 44, 47, 50, 53, 56, 59, 62, 65, 67, 70, 71];
var middleIndexArray = [1, 4, 7, 9, 12, 15, 18, 23, 28, 31, 34, 37, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 68, 72];
var passiveIndexArray = [2, 5, 10, 13, 16, 19, 24, 29, 32, 35, 38, 40, 43, 46, 49, 52, 55, 58, 61, 64, 69, 73];
var copyOfpassiveIndexArray = passiveIndexArray.slice(0);
var copyOfmiddleIndexArray = middleIndexArray.slice(0);
var animationIndexArray = [];
var handleOfRequestedAnimation = -1;
var timestampOfLastAnimation = 0;
var animationInterval = 800; // Milliseconds per frame for animation.  Lower number will use more CPU
var numOfAnimationsAlreadyPerformedOnSamePage = 0; // If the number of animation on the same page is high, the user might not be around
var maxAnimationOnSamePageWithoutMovement = 900000 / animationInterval; // there are 900,000 is milliseconds in 15 minutes. Stop wasting CPU if the user did not display a new passage, used quick lexicon and use the sidebar
var colorCodeGrammarAvailableAndSelected = false;
var displayQuickTryoutAccordion1 = true; // display the first section of the quick link by default
var displayQuickTryoutAccordion2 = false;
var displayQuickTryoutAccordion3 = false;
var axisUserSelectedToSort = '';
var userProvidedSortOrder = [];
var updatedGenderNumberCSS = false;
var userTurnGenderNumberFromOffToOn = false;
var otMorph = null;
/*
var colorConfigHTML1 = '<div id="theGrammarColorModal" class="modal selectModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +	
  '<div class="modal-dialog">' +
  '<div class="modal-content">'+ 
  '<link href="css/color_code_grammar.css" rel="stylesheet"/>' +
  '<link rel="stylesheet" href="css/spectrum.css"/>' +
  '<script src="js/color_code_config';
var colorConfigHTML2 = '.js"></script>' +
  '<script src="libs/spectrum.js"></script>' +
  '<div class="modal-header">' +
      '<button type="button" class="close" data-dismiss="modal" onclick=closeColorConfig()>X</button>' +
  '</div>' +
  '<div class="modal-body">' +
  '<div id="colortabs">' +
    '<ul class="nav nav-tabs">' +
      '<li class="active"><a href="#nounColors" data-toggle="tab">Number & Gender</a></li>' +
      '<li><a href="#verbColors" data-toggle="tab">Greek Verbs</a></li>' +
      '<li><a href="#hVerbColors" data-toggle="tab">OT Verbs</a></li>' +
    '</ul>' +
  '<div class="tab-content">' +
  '<div class="tab-pane fade in active" id="nounColors"></div>' +
  '<div class="tab-pane fade" id="verbColors"></div>' +
  '<div class="tab-pane fade" id="hVerbColors"></div>' +
  '<div class="footer">' +
  '<button id="openButton" class="btn btn-default btn-xs" onclick=openColorConfig()><label>Open</label></button>' +
  '<button id="saveButton" class="btn btn-default btn-xs" onclick=saveColorConfig()><label>Save</label></button>' +
  '<button id="cancelButton" class="btn btn-default btn-xs" onclick=cancelColorChanges()><label>Cancel</label></button>' +
  '<button id="resetButton" class="btn btn-default btn-xs" onclick=resetColorConfig()><label>Reset</label></button>' +
  '<button class="btn btn-default btn-xs" data-dismiss="modal" onclick=closeColorConfig()><label>Exit</label></button>' +
  '</div></div></div></div>' +
  '<script>' +
    '$( document ).ready(function() {' +
      'initializeColorCodeHtmlModalPage();' +
    '});' +
  '</script>'; */

const robinsonCodeOfTense = {
  p: 'present',
  i: 'imperfect',
  r: 'perfect',
  l: 'pluperfect',
  a: 'aorist',
  f: 'future'
};

const robinsonNameOfTense = {
  present: 'p',
  imperfect: 'i',
  perfect: 'r',
  pluperfect: 'l',
  aorist: 'a',
  future: 'f'
};

const defaultOrderOfTense = ['r', 'l', 'i', 'a', 'p', 'f'];
const defaultTenseToCombineWithPrevious = [false, false, false, false, false, false];

const robinsonCodeOfMood = {
  i: 'indicative',
  s: 'subjunctive',
  o: 'optative',
  m: 'imperative',
  n: 'infinitive',
  p: 'participle'
};

const robinsonNameOfMood = {
  indicative: 'i',
  subjunctive: 's',
  optative: 'o',
  imperative: 'm',
  infinitive: 'n',
  participle: 'p'
};

const defaultOrderOfMood = ['i', 's', 'o', 'm', 'n', 'p'];
const defaultMoodToCombineWithPrevious = [false, false, false, false, false, false];

var defaultCodeOfForm = {
  p: ['perfect', 'Perfect', true],
  w: ['va_imperfect', 'va+Imperfect', true],
  f: ['infinitive', 'Infinitive', true],
  r: ['participle', 'Participle', true],
  s: ['participle_passive', 'Participle-Passive', false],
  v: ['imperative', 'Imperative', true],
  n: ['imperfect_not_jussive', 'Imperfect-not-jussive', false],
  q: ['ve_perfect', 've+Perfect', true],
  i: ['imperfect', 'Imperfect', true],
  u: ['ve_imperfect', 've+Imperfect', false],
  j: ['jussive', 'Jussive', true],
  c: ['cohortative', 'Cohortative', true]
};

const otNameOfVerbForm = {
  perfect: 'p',
  va_imperfect: 'w',
  infinitive: 'f',
  participle: 'r',
  participle_passive: 's',
  imperative: 'v',
  imperfect_not_jussive: 'n',
  ve_perfect: 'q',
  imperfect: 'i',
  ve_imperfect: 'u',
  jussive: 'j',
  cohortative: 'c'
};
const defaultOrderOfOTVerbForm = [              'p',   'w',  'f',   'r',   's',  'v',   'i',   'q',  'n',  'u',  'j',   'c'];
const defaultOTVerbFormToCombineWithPrevious = [false, true, false, false, true, false, false, true, true, true, false, true];

var defaultHebrewCodeOfStem = {
  // Action: Simple
  q: ['qal', 'a', true],      // Voice: Active
  N: ['niphal', 'p', true],   // Voice: Passive
  t: ['hithpael', 'm', true], // Voice: Middle
  // Action: Intensive / Resultative
  p: ['piel', 'a', true],    // Voice: Active
  P: ['pual', 'p', true], u: ['hothpaal', 'p', false], D: ['nithpael', 'p', false], O: ['polal', 'p', false], // Voice: Passive
  // Action: Causative / Declarative
  h: ['hiphil', 'a', true], c: ['tiphil', 'a', false], // Voice: Active
  H: ['hophal', 'p', true],              // Voice: Passive
  v: ['hishtaphel', 'm', true]           // Voice: Middle
};

var hebrewNameOfStem = {
  // Action: Simple
  qal: 'q',      // Voice: Active
  niphal: 'N',   // Voice: Passive
  hithpael: 't', // Voice: Middle
  // Action: Intensive / Resultative
  piel: 'p',    // Voice: Active
  pual: 'P', hothpaal: 'u', nithpael: 'D', polal: 'O', // Voice: Passive
  // Action: Causative / Declarative
  hiphil: 'h', tiphil: 'c', // Voice: Active
  hophal: 'H',              // Voice: Passive
  hishtaphel: 'v'           // Voice: Middle
};

var defaultOrderOfHebrewStem = ['q', 'N', 't', 'p', 'P', 'u', 'D', 'O', 'h', 'c', 'H', 'v'];
var defaultHebriewStemToCombineWithPrevious = [false, true, true, 
  false, true, true, true, true, 
  false, true, true, true];
  
var defaultAramaicCodeOfStem = {
  // Action: Simple
  q: ['peal', 'a', false],   // Voice: Active
  Q: ['peil', 'p', false],   // Voice: Passive
  i: ['itpeel', 'm', false], t: ['hishtaphel', 'm', false], // Voice: Middle
  // Action: Intensive / Resultative
  p: ['pael', 'a', false],     // Voice: Active
  u: ['hithpeel', 'p', false], // Voice: Passive
  P: ['ithpaal', 'm', false], M: ['hithpaal', 'm', true], // Voice: Middle
  // Action: Causative / Declarative
  a: ['aphel', 'a', false], h: ['haphel', 'a', false], e: ['shaphel', 'a', false], // Voice: Active
  H: ['hophal', 'p', false],              // Voice: Passive
  v: ['ishtaphel', 'm', false]           // Voice: Middle
};
  
var aramaicNameOfStem = {
  // Action: Simple
  peal: 'q',   // Voice: Active
  peil: 'Q',   // Voice: Passive
  itpeel: 'i', hishtaphel: 't', // Voice: Middle
  // Action: Intensive / Resultative
  pael: 'p',     // Voice: Active
  hithpeel: 'u', // Voice: Passive
  ithpaal: 'P', hithpaal: 'M', // Voice: Middle
  // Action: Causative / Declarative
  aphel: 'a', haphel: 'h', shaphel: 'e', // Voice: Active
  hophal: 'H',             // Voice: Passive
  ishtaphel: 'v'           // Voice: Middle
};

var defaultOrderOfAramaicStem = ['q', 'Q', 'i', 't', 'p', 'u', 'P', 'M', 'a', 'h', 'e', 'H', 'v'];
var defaultAramaicStemToCombineWithPrevious = [false, true, true, true, 
  false, true, true, true, 
  false, true, true, true, true];
var oTFormIndex2CSS = {};
var hebrewStemIndex2CSS = {};
var aramaicStemIndex2CSS = {};

var underlineCanvasName = {
  Arrow: 'ulArrow',
  'Short Arrow': 'ulShortArrow',
  'Reverse Arrow': 'ulReverseArrow',
  'Short Reverse Arrow': 'ulShortReverseArrow',
  Dash: 'ulDash',
  '2 lines': 'ulDoubleSolid',
  Underline: 'ulSolid',
  Dots: 'ulDot',
  Wave: 'ulWave',
  'Dash Dot': 'ulDashDot',
  'Dash Dot Dot': 'ulDashDotDot',
  'None': 'ulNone'
};

var canvasUnderlineName = {
  ulArrow: 'Arrow',
  ulShortArrow: 'Short Arrow',
  ulReverseArrow: 'Reverse Arrow',
  ulShortReverseArrow: 'Short Reverse Arrow',
  ulDash: 'Dash',
  ulDoubleSolid: '2 lines',
  ulSolid: 'Underline',
  ulDot: 'Dots',
  ulWave: 'Wave',
  ulDashDot: 'Dash Dot',
  ulDashDotDot: 'Dash Dot Dot',
  ulNone: 'None'
};

var defaultC4VerbMoodTense = {
  enableGreekVerbColor: true,
  enableOTVerbColor: true,
  enableGenderNumberColor: true,
  inputPassiveBackgroundColor: '#ffd6b8',
  inputPassiveUlColor1: '#000000',
  inputPassiveUlColor2: '#ffffff',
  inputCheckboxPassiveBackgroundColor: true,
  inputCheckboxPassiveBackgroundColorCheckValue: false,
  inputCheckboxPassiveUlColor1: true,
  inputCheckboxPassiveUlColor1CheckValue: false,
  inputCheckboxPassiveUlColor2: false,
  inputCheckboxPassiveUlColor2CheckValue: false,
  inputMiddleBackgroundColor: '#a3fefe',
  inputMiddleUlColor1: '#000000',
  inputMiddleUlColor2: '#ffffff',
  inputCheckboxMiddleBackgroundColor: true,
  inputCheckboxMiddleBackgroundColorCheckValue: false,
  inputCheckboxMiddleUlColor1: true,
  inputCheckboxMiddleUlColor1CheckValue: false,
  inputCheckboxMiddleUlColor2: false,
  inputCheckboxMiddleUlColor2CheckValue: false,
  inputOTPassiveBackgroundColor: '#ffd6b8',
  inputOTPassiveUlColor1: '#000000',
  inputOTPassiveUlColor2: '#ffffff',
  inputCheckboxOTPassiveBackgroundColor: true,
  inputCheckboxOTPassiveBackgroundColorCheckValue: true,
  inputCheckboxOTPassiveUlColor1: true,
  inputCheckboxOTPassiveUlColor1CheckValue: false,
  inputCheckboxOTPassiveUlColor2: false,
  inputCheckboxOTPassiveUlColor2CheckValue: false,
  inputOTMiddleBackgroundColor: '#a3fefe',
  inputOTMiddleUlColor1: '#000000',
  inputOTMiddleUlColor2: '#ffffff',
  inputCheckboxOTMiddleBackgroundColor: true,
  inputCheckboxOTMiddleBackgroundColorCheckValue: true,
  inputCheckboxOTMiddleUlColor1: true,
  inputCheckboxOTMiddleUlColor1CheckValue: false,
  inputCheckboxOTMiddleUlColor2: false,
  inputCheckboxOTMiddleUlColor2CheckValue: false,
  inputColorVerbItem0: '#31ff00',
  inputColorVerbItem1: '#ffa500',
  inputColorVerbItem2: '#925011',
  inputColorVerbItem3: '#f92d02',
  inputColorVerbItem4: '#fff700',
  inputColorVerbItem5: '#091bfd',
  selectedHighlightVerbItem0: 'Short Reverse Arrow',
  selectedHighlightVerbItem1: 'Short Reverse Arrow',
  selectedHighlightVerbItem2: 'Reverse Arrow',
  selectedHighlightVerbItem3: 'Dots',
  selectedHighlightVerbItem4: 'Dash',
  selectedHighlightVerbItem5: 'Arrow',
  inputAnimate0: false,
  inputAnimate1: false,
  inputAnimate2: false,
  inputAnimate3: false,
  inputAnimate4: false,
  inputAnimate5: false,
  inputColorMasculine: '#000099',
  inputColorFeminine: '#C90000',
  inputColorNeuter: '#000000',
  selectedHighlightSingular: 'normal',
  selectedHighlightPlural: 'bold',
  orderOfTense: defaultOrderOfTense,
  orderOfMood: defaultOrderOfMood,
  tenseToCombineWithPrevious: defaultTenseToCombineWithPrevious,
  moodToCombineWithPrevious: defaultMoodToCombineWithPrevious,
  granularControlOfMoods: false,
  granularControlOfTenses: false,
  granularControlOfOTXAxis: false,
  granularControlOfOTYAxis: false,
  moodsOnOff: [false, false, false, false, false, false],
  tensesOnOff: [false, false, false, false, false, false],
  otXAxisOnOff: [false, false, false, false, false, false, false, false, false, false, false, false],
  otYAxisOnOff: [false, false, false, false, false, false, false, false, false, false, false, false],
  xAxisForMood: true,
  enableAdvancedTools: true,
  enableOTAdvancedTools: true,
  selectedHighlightOTVerbItem0: 'Reverse Arrow',
  selectedHighlightOTVerbItem1: 'Dots',
  selectedHighlightOTVerbItem2: 'Dash',
  selectedHighlightOTVerbItem3: 'Dash Dot',
  selectedHighlightOTVerbItem4: 'Arrow',
  selectedHighlightOTVerbItem5: 'Short Arrow',
  selectedHighlightOTVerbItem6: 'Underline',
  selectedHighlightOTVerbItem7: 'Underline',
  selectedHighlightOTVerbItem8: 'Underline',
  selectedHighlightOTVerbItem9: 'Underline',
  selectedHighlightOTVerbItem10: 'Underline',
  selectedHighlightOTVerbItem11: 'Underline',
  inputColorOTVerbItem0: '#000000',
  inputColorOTVerbItem1: '#ff0000',
  inputColorOTVerbItem2: '#0000ff',
  inputColorOTVerbItem3: '#000000',
  inputColorOTVerbItem4: '#000000',
  inputColorOTVerbItem5: '#000000',
  inputColorOTVerbItem6: '#000000',
  inputColorOTVerbItem7: '#000000',
  inputColorOTVerbItem8: '#000000',
  inputColorOTVerbItem9: '#000000',
  inputColorOTVerbItem10: '#000000',
  inputColorOTVerbItem11: '#000000',
  otVerbTableXHeader: { desc: ['Simple','Intensive / Resultative', 'Causative / Declarative'], repeat: [0, 0, 0]},
  otVerbTableYHeader: { desc: ['Past or poss.<br>Present','Any time<br>or Present', 'Present or<br>Future'], repeat: [0, 2, 1] },
  ntVerbTableXHeader: null,
  ntVerbTableYHeader: { desc: ['Past', 'Past /<br>Present', 'Present', 'Future'], repeat: [2, 0, 0, 0] },
  ntVerbTableHTML: null,
  orderOfOTForm: defaultOrderOfOTVerbForm,
  oTVerbFormToCombineWithPrevious: defaultOTVerbFormToCombineWithPrevious,
  orderOfHebrewStem: defaultOrderOfHebrewStem,
  hebrewStemToCombineWithPrevious: defaultHebriewStemToCombineWithPrevious,
  orderOfAramaicStem: defaultOrderOfAramaicStem,
  aramaicStemToCombineWithPrevious: defaultAramaicStemToCombineWithPrevious,
  hebrewCodeOfStem: defaultHebrewCodeOfStem,
  aramaicCodeOfStem: defaultAramaicCodeOfStem,
  oTCodeOfForm: defaultCodeOfForm,
  xAxisForStem: true
};

var defaultC4VerbMoodTense2 = {
  enableGenderNumberColor: true,
  enableGreekVerbColor: true,
  inputColorVerbItem0: '#000000',
  inputColorVerbItem1: '#ff0000',
  inputColorVerbItem2: '#ff8800',
  inputColorVerbItem3: '#0000ff',
  inputColorVerbItem4: '#ff00ff',
  selectedHighlightVerbItem0: 'Arrow',
  selectedHighlightVerbItem1: 'Dash',
  selectedHighlightVerbItem2: '2 lines',
  selectedHighlightVerbItem3: 'Underline',
  selectedHighlightVerbItem4: 'Dots',
  orderOfTense: ['p', 'i', 'r', 'l', 'a', 'f'],
  tenseToCombineWithPrevious: [false, false, false, true, false, false],
  orderOfMood: ['i', 'm', 's', 'o', 'n', 'p'],
  moodToCombineWithPrevious: [false, false, false, true, false, false],
  inputCheckboxPassiveBackgroundColorCheckValue: true,
  inputCheckboxMiddleBackgroundColorCheckValue: true,
  otVerbTableXHeader: null,
  otVerbTableYHeader: null,
  ntVerbTableYHeader: null,
  ntVerbTableHTML: null
};

var defaultC4 = JSON.parse(JSON.stringify(defaultC4VerbMoodTense)); // Quick way to make a copy of the object

var defaultC4VerbWithMiddlePassive = {
  inputCheckboxPassiveBackgroundColor: true,
  inputCheckboxPassiveBackgroundColorCheckValue: true,
  inputCheckboxPassiveUlColor1CheckValue: true,
  inputCheckboxPassiveUlColor2: true,
  inputCheckboxMiddleBackgroundColor: true,
  inputCheckboxMiddleBackgroundColorCheckValue: true,
  inputCheckboxMiddleUlColor1CheckValue: true,
  inputCheckboxMiddleUlColor2: true,
  inputCheckboxMiddleUlColor2CheckValue: true,
  otVerbTableXHeader: null,
  otVerbTableYHeader: null,
  ntVerbTableYHeader: null,
  ntVerbTableHTML: null
};

var defaultC4VerbTenseMood = {
  enableGenderNumberColor: false,
  xAxisForMood: false,
  otVerbTableXHeader: null,
  otVerbTableYHeader: null,
  ntVerbTableYHeader: null,
  ntVerbTableHTML: null
};

var defaultC4MainVsSupporingVerbs = {
  enableGenderNumberColor: false,
  inputColorVerbItem0: '#008000',
  inputColorVerbItem1: '#ed12ed',
  inputColorVerbItem2: '#ed12ed',
  inputColorVerbItem3: '#008000',
  inputColorVerbItem4: '#ed12ed',
  inputColorVerbItem5: '#ed12ed',
  selectedHighlightVerbItem0: 'Underline',
  selectedHighlightVerbItem1: 'Underline',
  selectedHighlightVerbItem2: 'Underline',
  selectedHighlightVerbItem3: 'Underline',
  selectedHighlightVerbItem4: 'Underline',
  selectedHighlightVerbItem5: 'Underline',
  otVerbTableXHeader: null,
  otVerbTableYHeader: null,
  ntVerbTableYHeader: null,
  ntVerbTableHTML: null
}

var defaultC4NounOnly = {
  enableGreekVerbColor: false,
  enableOTVerbColor: false,
  enableGenderNumberColor: true,
  otVerbTableXHeader: null,
  otVerbTableYHeader: null,
  ntVerbTableYHeader: null,
  ntVerbTableHTML: null
};

var defaultC4ImperativesOnly = {
  enableGenderNumberColor: false,
  granularControlOfMoods: true,
  moodsOnOff: [false, false, false, true, false, false],
  selectedHighlightVerbItem0: 'Underline',
  selectedHighlightVerbItem1: 'Underline',
  selectedHighlightVerbItem2: 'Underline',
  selectedHighlightVerbItem3: 'Underline',
  selectedHighlightVerbItem4: 'Underline',
  selectedHighlightVerbItem5: 'Underline',
  otVerbTableXHeader: null,
  otVerbTableYHeader: null,
  ntVerbTableYHeader: null,
  ntVerbTableHTML: null
};
var c4;  //c4 is currentColorCodeConfig.  It is changed to c4 to save space

function initCanvasAndCssForColorCodeGrammar() {
  var a = performance.now();
  if (c4 === undefined) getColorCodeGrammarSettings();  //c4 is currentColorCodeConfig.  It is changed to c4 to save space
  addVerbTable(false, '#colorCodeTableDiv');
  createUlArrow();
  createUlShortArrow();
  createUlReverseArrow();
  createUlShortReverseArrow();
  createUlDash();
  createUlSolid();
  createUlNone();
  createUlDoubleSolid();
  createUlDot();
  createUlWave();
  createUlDashDot();
  createUlDashDotDot();
  createUlForAllItemsInYAndX();
  createUlForOT();
//  refreshForAllInstancesOfTense();
  goAnimate();
  var b = performance.now();
  console.log('init took ' + (b - a) + ' ms.');
}

function calculateAnimationPixelIncrement(width) {
  var increment = Math.round(width / 5);
  // increment has to be an odd number so that the underline to highligh passive 
  // and middle voice can change to alternate between two colors in goAnimate()
  if (increment % 2 === 0) {
    if (increment > 3) increment -= 1;
    else increment += 1;
  }
  return increment;
}

function createCanvas(canvasId, width, height) {
  var canvas = document.getElementById(canvasId);
  if (canvas == undefined) {
    canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.width = width;
    canvas.height = height;
    canvas.hidden = true;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);
  }
  return canvas;
}

function createUlArrow() {
  var ulArrow = uLBASEIMGS[0];
  ulArrow.canvas = createCanvas(ulArrow.name, 18, 10);
  ulArrow.context = ulArrow.canvas.getContext('2d');
  ulArrow.context.beginPath();
  ulArrow.context.lineJoin = 'round';
  ulArrow.context.lineWidth = 1;
  ulArrow.context.moveTo(9, 2);
  ulArrow.context.lineTo(18, 5);
  ulArrow.context.lineTo(9, 8);
  ulArrow.context.fill();
  ulArrow.context.closePath();
  ulArrow.context.beginPath();
  ulArrow.context.lineWidth = 2;
  ulArrow.context.moveTo(9, 5);
  ulArrow.context.lineTo(3, 5);
  ulArrow.context.stroke();
  ulArrow.context.closePath();
  ulArrow.img.src = ulArrow.canvas.toDataURL('image/png');
  ulArrow.animIncrement = calculateAnimationPixelIncrement(ulArrow.canvas.width);
}

function createUlShortArrow() {
  var ulArrow = uLBASEIMGS[8];
  ulArrow.canvas = createCanvas(ulArrow.name, 10, 10);
  ulArrow.context = ulArrow.canvas.getContext('2d');
  ulArrow.context.beginPath();
  ulArrow.context.lineJoin = 'round';
  ulArrow.context.lineWidth = 2;
  ulArrow.context.moveTo(3, 2);
  ulArrow.context.lineTo(10, 5);
  ulArrow.context.lineTo(3, 8);
  ulArrow.context.stroke();
  ulArrow.context.closePath();
  ulArrow.img.src = ulArrow.canvas.toDataURL('image/png');
  ulArrow.animIncrement = calculateAnimationPixelIncrement(ulArrow.canvas.width);
}

function createUlReverseArrow() {
  var ulArrow = uLBASEIMGS[9];
  ulArrow.canvas = createCanvas(ulArrow.name, 18, 10);
  ulArrow.context = ulArrow.canvas.getContext('2d');
  ulArrow.context.beginPath();
  ulArrow.context.lineJoin = 'round';
  ulArrow.context.lineWidth = 1;
  ulArrow.context.moveTo(9, 2);
  ulArrow.context.lineTo(0, 5);
  ulArrow.context.lineTo(9, 8);
  ulArrow.context.fill();
  ulArrow.context.closePath();
  ulArrow.context.beginPath();
  ulArrow.context.lineWidth = 2;
  ulArrow.context.moveTo(9, 5);
  ulArrow.context.lineTo(15, 5);
  ulArrow.context.stroke();
  ulArrow.context.closePath();
  ulArrow.img.src = ulArrow.canvas.toDataURL('image/png');
  ulArrow.animIncrement = calculateAnimationPixelIncrement(ulArrow.canvas.width);
}

function createUlShortReverseArrow() {
  var ulArrow = uLBASEIMGS[10];
  ulArrow.canvas = createCanvas(ulArrow.name, 10, 10);
  ulArrow.context = ulArrow.canvas.getContext('2d');
  ulArrow.context.beginPath();
  ulArrow.context.lineJoin = 'round';
  ulArrow.context.lineWidth = 2;
  ulArrow.context.moveTo(8, 2);
  ulArrow.context.lineTo(1, 5);
  ulArrow.context.lineTo(8, 8);
  ulArrow.context.stroke();
  ulArrow.context.closePath();
  ulArrow.img.src = ulArrow.canvas.toDataURL('image/png');
  ulArrow.animIncrement = calculateAnimationPixelIncrement(ulArrow.canvas.width);
}

function createUlDash() {
  var ulDash = uLBASEIMGS[1];
  ulDash.canvas = createCanvas(ulDash.name, 13, 10);
  ulDash.context = ulDash.canvas.getContext('2d');
  ulDash.context.beginPath();
  ulDash.context.lineWidth = 4;
  ulDash.context.moveTo(4, 4);
  ulDash.context.lineTo(13, 4);
  ulDash.context.stroke();
  ulDash.context.closePath();
  ulDash.img.src = ulDash.canvas.toDataURL('image/png');
  ulDash.animIncrement = calculateAnimationPixelIncrement(ulDash.canvas.width);
}

function createUlDashDot() {
  var ulDashDot = uLBASEIMGS[6];
  ulDashDot.canvas = createCanvas(ulDashDot.name, 19, 10);
  ulDashDot.context = ulDashDot.canvas.getContext('2d');
  ulDashDot.context.beginPath();
  ulDashDot.context.arc(5, 4, 2, 0, 2 * Math.PI);
  ulDashDot.context.fill();
  ulDashDot.context.stroke();
  ulDashDot.context.closePath();
  ulDashDot.context.beginPath();
  ulDashDot.context.lineWidth = 4;
  ulDashDot.context.moveTo(10, 4);
  ulDashDot.context.lineTo(19, 4);
  ulDashDot.context.stroke();
  ulDashDot.context.closePath();
  ulDashDot.img.src = ulDashDot.canvas.toDataURL('image/png');
  ulDashDot.animIncrement = calculateAnimationPixelIncrement(ulDashDot.canvas.width);
}

function createUlDashDotDot() {
  var ulDashDotDot = uLBASEIMGS[7];
  ulDashDotDot.canvas = createCanvas(ulDashDotDot.name, 26, 10);
  ulDashDotDot.context = ulDashDotDot.canvas.getContext('2d');
  ulDashDotDot.context.beginPath();
  ulDashDotDot.context.arc(5, 4, 2, 0, 2 * Math.PI);
  ulDashDotDot.context.fill();
  ulDashDotDot.context.stroke();
  ulDashDotDot.context.closePath();
  ulDashDotDot.context.beginPath();
  ulDashDotDot.context.arc(12, 4, 2, 0, 2 * Math.PI);
  ulDashDotDot.context.fill();
  ulDashDotDot.context.stroke();
  ulDashDotDot.context.closePath();
  ulDashDotDot.context.beginPath();
  ulDashDotDot.context.lineWidth = 4;
  ulDashDotDot.context.moveTo(17, 4);
  ulDashDotDot.context.lineTo(26, 4);
  ulDashDotDot.context.stroke();
  ulDashDotDot.context.closePath();
  ulDashDotDot.img.src = ulDashDotDot.canvas.toDataURL('image/png');
  ulDashDotDot.animIncrement = calculateAnimationPixelIncrement(ulDashDotDot.canvas.width);
}

function createUlSolid() {
  var ulSolid = uLBASEIMGS[2];
  ulSolid.canvas = createCanvas(ulSolid.name, 1, 10);
  ulSolid.context = ulSolid.canvas.getContext('2d');
  ulSolid.context.beginPath();
  ulSolid.context.lineWidth = 3;
  ulSolid.context.moveTo(0, 4);
  ulSolid.context.lineTo(1, 4);
  ulSolid.context.stroke();
  ulSolid.context.closePath();
  ulSolid.img.src = ulSolid.canvas.toDataURL('image/png');
}

function createUlNone() {
  var ulNone = uLBASEIMGS[11];
  ulNone.canvas = createCanvas(ulNone.name, 1, 10);
  ulNone.context = ulNone.canvas.getContext('2d');
  ulNone.img.src = ulNone.canvas.toDataURL('image/png');
}

function createUlDoubleSolid() {
  var ulDoubleSolid = uLBASEIMGS[3];
  ulDoubleSolid.canvas = createCanvas(ulDoubleSolid.name, 1, 10);
  ulDoubleSolid.context = ulDoubleSolid.canvas.getContext('2d');
  ulDoubleSolid.context.beginPath();
  ulDoubleSolid.context.lineWidth = 2;
  ulDoubleSolid.context.moveTo(0, 2);
  ulDoubleSolid.context.lineTo(1, 2);
  ulDoubleSolid.context.stroke();
  ulDoubleSolid.context.moveTo(0, 7);
  ulDoubleSolid.context.lineTo(1, 7);
  ulDoubleSolid.context.stroke();
  ulDoubleSolid.context.closePath();
  ulDoubleSolid.img.src = ulDoubleSolid.canvas.toDataURL('image/png');
}

function createUlDot() {
  var ulDot = uLBASEIMGS[4];
  ulDot.canvas = createCanvas(ulDot.name, 10, 10);
  ulDot.context = ulDot.canvas.getContext('2d');
  ulDot.context.beginPath();
  ulDot.context.arc(5, 4, 2, 0, 2 * Math.PI);
  ulDot.context.fill();
  ulDot.context.stroke();
  ulDot.context.closePath();
  ulDot.img.src = ulDot.canvas.toDataURL('image/png');
  ulDot.animIncrement = calculateAnimationPixelIncrement(ulDot.canvas.width);
}

function createUlWave() {
  var ulWave = uLBASEIMGS[5];
  ulWave.canvas = createCanvas(ulWave.name, 22, 10);
  ulWave.context = ulWave.canvas.getContext('2d');
  // draw sin ulWave
  ulWave.context.beginPath();
  ulWave.context.strokeStyle = 'black';
  ulWave.context.lineWidth = 2;
  var heightOfWave = 7;
  for (var x = 0; x <= ulWave.canvas.width; x += 1) {
    var y = Math.round(( (heightOfWave / 2) + heightOfWave / 2 * 
        Math.sin(((x + -heightOfWave / 2) / (ulWave.canvas.width / 2)) * Math.PI)) + 1);
    if (x === 0) ulWave.context.moveTo(x, y);
    else ulWave.context.lineTo(x, y);
  }
  ulWave.context.stroke();
  ulWave.context.closePath();
  ulWave.img.src = ulWave.canvas.toDataURL('image/png');
  ulWave.animIncrement = calculateAnimationPixelIncrement(ulWave.canvas.width);
}

function creatUlForOTYAxis(rowNum, numOfRows, numOfColumns) {
  var currentUL;
  if ((numOfRows != null) && (rowNum == numOfRows)) currentUL = 'ulNone';
  else currentUL = underlineCanvasName[c4['selectedHighlightOTVerbItem' + rowNum]];
  var srcImgObj = _.find(uLBASEIMGS, function(obj) { return obj.name == currentUL; });
  if (numOfColumns == null) numOfColumns = getVariablesForOTVerbTable('H').orderOfXAxisItems.length;
  ulOTVbCSS[rowNum] = new Array(numOfColumns * 3);
  for (var counter2 = 0; counter2 < numOfColumns; counter2++) {
    var currentColor = c4['inputColorOTVerbItem' + counter2];
    for (var counter3 = 0; counter3 < 3; counter3 ++) {
      var columnIndex = (counter2 * 3) + counter3;
      ulOTVbCSS[rowNum][columnIndex] = new ULOBJ('R' + rowNum + 'C' + columnIndex);
      createUlForOneInstanceOfTense(ulOTVbCSS[rowNum][columnIndex], srcImgObj, currentColor, -1);
    }
  }
}

function createUlForOT() {
  numOfRows = getVariablesForOTVerbTable('H').orderOfYAxisItems.length;
  numOfColumns = getVariablesForOTVerbTable('H').orderOfXAxisItems.length;
  ulOTVbCSS = new Array(numOfRows+1);
  for (var counter1 = 0; counter1 <= numOfRows; counter1++) { // last row is for the title of color configuration screen
    creatUlForOTYAxis(counter1, numOfRows, numOfColumns);
  }
  var rowNum = -1;
  oTFormIndex2CSS = {};
  for (var counter = 0; counter < c4.orderOfOTForm.length; counter += 1) {
    if (!c4.oTVerbFormToCombineWithPrevious[counter]) rowNum += 1;
    oTFormIndex2CSS[ c4.orderOfOTForm[counter] ] = rowNum;
  }
  var colGroup = -1;
  for (var counter = 0; counter < c4.orderOfHebrewStem.length; counter += 1) {
    if (!c4.hebrewStemToCombineWithPrevious[counter]) colGroup += 1;
    var colIndex = colGroup * 3;
    if (c4.orderOfHebrewStem[counter] != undefined) {
      if (c4.hebrewCodeOfStem[c4.orderOfHebrewStem[counter]][1] == 'p') 
        colIndex += 1;
      else if (c4.hebrewCodeOfStem[c4.orderOfHebrewStem[counter]][1] == 'm')
        colIndex += 2;
      hebrewStemIndex2CSS [ c4.orderOfHebrewStem[counter] ] = colIndex;
    }
  }
  colGroup = -1;
  for (var counter = 0; counter < c4.orderOfAramaicStem.length; counter += 1) {
    if (!c4.aramaicStemToCombineWithPrevious[counter]) colGroup += 1;
    var colIndex = colGroup * 3;
    if (c4.orderOfAramaicStem[counter] != undefined) {
      if (c4.aramaicCodeOfStem[c4.orderOfAramaicStem[counter]][1] == 'p') 
        colIndex += 1;
      else if (c4.aramaicCodeOfStem[c4.orderOfAramaicStem[counter]][1] == 'm')
        colIndex += 2;
      aramaicStemIndex2CSS [ c4.orderOfAramaicStem[counter] ] = colIndex;
    }
  }
}

function createUlForAllItemsInYAndX() {
  var moodOrTenseOnYAxis;
  if (c4.xAxisForMood) {
    moodOrTenseOnYAxis = 'tense';
    moodOrTenseOnXAxis = 'mood';
  }
  else {
    moodOrTenseOnYAxis = 'mood';
    moodOrTenseOnXAxis = 'tense';
  }
  var r = getVariablesForVerbTable();
  for (var counter1 = 0; counter1 < r.nameOfAllYAxisItems.length; counter1 += 1) {
    var currentULForYAxis = underlineCanvasName[c4['selectedHighlightVerbItem' + getAxisOrderOfItem(moodOrTenseOnYAxis, counter1)]];
    var srcImgObj = _.find(uLBASEIMGS, function(obj) { return obj.name == currentULForYAxis; });
    for (var counter2 = 0; counter2 < r.nameOfAllXAxisItems.length; counter2 += 1) {
      colorForXAxis = c4['inputColorVerbItem' + getAxisOrderOfItem(moodOrTenseOnXAxis, counter2)];
      if (c4.xAxisForMood) {
        moodCounter = counter2;
        tenseCounter = counter1;
        currentMoodDescription = r.nameOfAllXAxisItems[counter2];
        currentTenseDescription = r.nameOfAllYAxisItems[counter1];
      }
      else {
        moodCounter = counter1;
        tenseCounter = counter2;
        currentMoodDescription = r.nameOfAllYAxisItems[counter1];
        currentTenseDescription = r.nameOfAllXAxisItems[counter2];
      }
      var arrayIndexOfCurrentTense = _.find(tenseIndexArray, function(obj) { return obj.name == currentTenseDescription; }).array;
      var moodIndex = _.find(moodIndexArray, function(obj) { return obj.name == currentMoodDescription; }).array;
      for (var counter3 = 0; counter3 < arrayIndexOfCurrentTense.length; counter3 += 1) {
        var indexToUlVerbCSS = arrayIndexOfCurrentTense[counter3];
        if (moodIndex.indexOf(indexToUlVerbCSS) > -1) {
          createUlForOneInstanceOfTense(ulVerbCSS[indexToUlVerbCSS], srcImgObj, colorForXAxis, indexToUlVerbCSS);
          ulVerbCSS[indexToUlVerbCSS].displayStatusSelectedByTense = (!(c4.granularControlOfTenses && !c4.tensesOnOff[tenseCounter]));
          ulVerbCSS[indexToUlVerbCSS].displayStatusSelectedByMood = (!(c4.granularControlOfMoods && !c4.moodsOnOff[moodCounter]));
        }
      }
    }
  }
}

function createUlForOneInstanceOfTense(destImgObj, srcImgObj, color, ulVerbCSSIndex) {
  destImgObj.canvas = createCanvas(destImgObj.name, srcImgObj.canvas.width, srcImgObj.canvas.height);
  updateUlForSpecificYAxis(destImgObj, srcImgObj, color, ulVerbCSSIndex);
}

function displayUlVerbCSSOrNot(indexToUlVerbCSS) {
  if ( ( ( (!c4.granularControlOfMoods && !c4.granularControlOfTenses) || 
         ((indexToUlVerbCSS != null) && ulVerbCSS[indexToUlVerbCSS].displayStatusSelectedByMood && c4.granularControlOfMoods) || 
         ((indexToUlVerbCSS != null) && ulVerbCSS[indexToUlVerbCSS].displayStatusSelectedByTense && c4.granularControlOfTenses) ) &&
         c4.enableGreekVerbColor) || (indexToUlVerbCSS == -1) ) return true; // indexToUlVerbCSS is -1 when it is OT verb.  Temp solution.
  else return false;
}

function refreshForAllInstancesOfTense(ntCSSOnThisPage, otCSSOnThisPage) {
  if (c4.enableGenderNumberColor) {
    if (userTurnGenderNumberFromOffToOn) {
      userTurnGenderNumberFromOffToOn = false;
      $('.old_mas').removeClass('old_mas').addClass('mas');
      $('.old_fem').removeClass('old_fem').addClass('fem');
      $('.old_neut').removeClass('old_neut').addClass('neut');
      $('.old_sing').removeClass('old_sing').addClass('sing');
      $('.old_plur').removeClass('old_plur').addClass('plur');
    }
    $('.mas').css('color', c4.inputColorMasculine);
    $('.fem').css('color', c4.inputColorFeminine);
    $('.neut').css('color', c4.inputColorNeuter);
    updateCssForNumber('singular', c4.selectedHighlightSingular);
    updateCssForNumber('plural', c4.selectedHighlightPlural);
  } else {
    if (updatedGenderNumberCSS) {
      $('.mas').css('color', '');
      $('.fem').css('color', '');
      $('.neut').css('color', '');
      $('.sing').css('font-weight', '');
      $('.plur').css('font-weight', '');
      $('.sing').css('font-style', '');
      $('.plur').css('font-style', '');
      updatedGenderNumberCSS = false;
    }
    $('.mas').removeClass('mas').addClass('old_mas');
    $('.fem').removeClass('fem').addClass('old_fem');
    $('.neut').removeClass('neut').addClass('old_neut');
    $('.sing').removeClass('sing').addClass('old_sing');
    $('.plur').removeClass('plur').addClass('old_plur');
  }
  var a = performance.now();

  if ((ntCSSOnThisPage == undefined) || (ntCSSOnThisPage.length > 0)) {
    for (var j = 0; j < ulVerbCSS.length; j += 1) {
      if (displayUlVerbCSSOrNot(j)) {
        if ((ntCSSOnThisPage == undefined) || (ntCSSOnThisPage.indexOf(' v' + ulVerbCSS[j].name + ' ') > -1)) {
          $('.v' + ulVerbCSS[j].name).css('background', 'url(' + ulVerbCSS[j].img.src + ') repeat-x 100% 100%');
        }
      }
      else if ((!c4.enableGreekVerbColor) || ((c4.granularControlOfMoods) || (c4.granularControlOfTenses))) $('.v' + ulVerbCSS[j].name).css('background', 'none');
    }
  }

  if (otCSSOnThisPage == undefined) {
    for (var j = 0; j < ulOTVbCSS.length; j += 1) {
      for (var k = 0; k < ulOTVbCSS[j].length; k += 1) {
        var display = false;
        if (c4.enableOTVerbColor) {
          if (j == (ulOTVbCSS.length -1)) display = true;
          else if ( ((!c4.granularControlOfOTYAxis) || (c4.otYAxisOnOff[j])) &&
              ((!c4.granularControlOfOTXAxis) || (c4.otXAxisOnOff[Math.floor(k/3)])) )
            display = true;
          else if (c4.granularControlOfOTYAxis && c4.granularControlOfOTXAxis)
            display = (c4.otYAxisOnOff[j]) || (c4.otXAxisOnOff[Math.floor(k/3)]);
        }
        if (display) $('.vot_' + ulOTVbCSS[j][k].name).css('background', 'url(' + ulOTVbCSS[j][k].img.src + ') repeat-x 100% 100%');
        else if ((!c4.enableOTVerbColor) || ((c4.granularControlOfOTXAxis) || (c4.granularControlOfOTYAxis))) $('.vot_' + ulOTVbCSS[j][k].name).css('background', 'none');
      }
    }
  }
  else if ((otCSSOnThisPage.length > 4) && (c4.enableOTVerbColor)) {
    cssCodes = otCSSOnThisPage.split(' ');
    for (var j = 0; j < cssCodes.length; j += 1) {
      var r = getRowColNum(cssCodes[j]);
      var row = r[0];
      var column = r[1];
      var display = false;
      if ((row != null) && (column != null)) {
        if ( ((!c4.granularControlOfOTYAxis) || (c4.otYAxisOnOff[row])) &&
            ((!c4.granularControlOfOTXAxis) || (c4.otXAxisOnOff[column])) )
          display = true;
        else if (c4.granularControlOfOTYAxis && c4.granularControlOfOTXAxis)
          display = (c4.otYAxisOnOff[row]) || (c4.otXAxisOnOff[column]);
        if (display) $('.vot_' + ulOTVbCSS[row][column].name).css('background', 'url(' + ulOTVbCSS[row][column].img.src + ') repeat-x 100% 100%');
        else if ((c4.granularControlOfOTXAxis) || (c4.granularControlOfOTYAxis)) $('.vot_' + ulOTVbCSS[row][column].name).css('background', 'none');
      }
    }
  }
  var b = performance.now();
  console.log('refresh took ' + (b - a) + ' ms.');
  $('.primaryLightBg').css('text-shadow', 'none'); // Need to set it in the program, if not the browser will prioritize the CSS updated in this Javascript.  
}

function getRowColNum(input) {
  var row = null, column = null;
  var lng = input.length;
  if ((lng >= 4) && (lng <= 6) && (input.substr(0,1) == 'R')) {
    if (input.substr(2,1) == 'C') {
      row = parseInt(input.substr(1, 1));
      column = parseInt(input.substr(3));
    }
    else if (input.substr(3,1) == 'C') {
      row = parseInt(input.substr(1, 2));
      column = parseInt(input.substr(4));
    }
  }
  return [row, column];
}

function updateUlForSpecificYAxis(destImgObj, srcImgObj, color, ulVerbCSSIndex) {
  if (color !== undefined) {
    var backgroundColor;
    destImgObj.canvas.heigth = srcImgObj.canvas.height;
    destImgObj.canvas.width = srcImgObj.canvas.width;
    destImgObj.context = destImgObj.canvas.getContext('2d');
    destImgObj.context.drawImage(srcImgObj.canvas, 0, 0);
    var passiveVoice = false;
    var middleVoice = false;
    var passiveStrokeStyle = ''
    var middleStrokeStyle = '';
    var otItem = false;
    if (destImgObj.name.length === 3) {
      var pos2 = destImgObj.name.substr(1, 1);
      var passiveVoice = ( (destImgObj.name.length === 3) && (pos2 === 'p') );
      var middleVoice = ( (destImgObj.name.length === 3) && (pos2 === 'm') );
      if (passiveVoice) {
        if (c4.inputCheckboxPassiveBackgroundColorCheckValue)
          backgroundColor = c4.inputPassiveBackgroundColor;
        if (c4.inputCheckboxPassiveUlColor1CheckValue)
          passiveStrokeStyle = c4.inputPassiveUlColor1;
      }
      else if (middleVoice) {
        if (c4.inputCheckboxMiddleBackgroundColorCheckValue)
          backgroundColor = c4.inputMiddleBackgroundColor;
        if (c4.inputCheckboxMiddleUlColor1CheckValue)
          middleStrokeStyle = c4.inputMiddleUlColor1;
      }
    }
    else if (destImgObj.name.length > 3) {
      var r = getRowColNum(destImgObj.name);
      var column = r[1];
      if (column != null) {
        otItem = true;
        var numOfColumns = getVariablesForOTVerbTable('H').orderOfXAxisItems.length;
        if (column <= (numOfColumns * 3)) {
          if ((column % 3) == 1) {
            passiveVoice = true;
            if (c4.inputCheckboxOTPassiveBackgroundColorCheckValue)
              backgroundColor = c4.inputOTPassiveBackgroundColor;
            if (c4.inputCheckboxOTPassiveUlColor1CheckValue)
              passiveStrokeStyle = c4.inputOTPassiveUlColor1;
          }
          else if ((column % 3) == 2) {
            middleVoice = true;
            if (c4.inputCheckboxOTMiddleBackgroundColorCheckValue)
              backgroundColor = c4.inputOTMiddleBackgroundColor;
            if (c4.inputCheckboxOTMiddleUlColor1CheckValue)
              middleStrokeStyle = c4.inputOTMiddleUlColor1;
          }
        }
      }
    }
    changeImageColor(destImgObj, color, backgroundColor);
    if ((passiveVoice) && (passiveStrokeStyle != '')) {
      destImgObj.context.beginPath();
      destImgObj.context.strokeStyle = passiveStrokeStyle;
      destImgObj.context.lineWidth = 2;
      destImgObj.context.moveTo(0, destImgObj.canvas.heigth - 1);
      destImgObj.context.lineTo(destImgObj.canvas.width, destImgObj.canvas.heigth - 1);
      destImgObj.context.stroke();
      destImgObj.context.closePath();
    } else if ((middleVoice) && (middleStrokeStyle != '')) {
      destImgObj.context.beginPath();
      destImgObj.context.strokeStyle = middleStrokeStyle;
      destImgObj.context.lineWidth = 2;
      destImgObj.context.moveTo(0, destImgObj.canvas.heigth - 1);
      destImgObj.context.lineTo(destImgObj.canvas.width, destImgObj.canvas.heigth - 1);
      destImgObj.context.stroke();
      destImgObj.context.closePath();
    }
    destImgObj.img.src = destImgObj.canvas.toDataURL('image/png');
    destImgObj.animIncrement = calculateAnimationPixelIncrement(destImgObj.canvas.width);
    if ((destImgObj.name.length == 3) && (displayUlVerbCSSOrNot(ulVerbCSSIndex))) { 
      $('.v' + destImgObj.name).css('background', 'url(' + destImgObj.img.src + ') repeat-x 100% 100%');
    }
    else if (otItem) {
      $('.vot_' + destImgObj.name).css('background', 'url(' + destImgObj.img.src + ') repeat-x 100% 100%');
    }
  }
}

function goAnimate(givenTime) {
  var animateUlForPassive = c4.inputCheckboxPassiveUlColor1CheckValue &&
    c4.inputCheckboxPassiveUlColor2CheckValue;
  var animateUlForMiddle = c4.inputCheckboxMiddleUlColor1CheckValue &&
    c4.inputCheckboxMiddleUlColor2CheckValue;
  if ((animateUlForPassive || animateUlForMiddle || (animationIndexArray.length > 0)) &&
       colorCodeGrammarAvailableAndSelected && c4.enableGreekVerbColor) {
    if (((givenTime - timestampOfLastAnimation) > animationInterval) || (givenTime === undefined)) {
      if (numOfAnimationsAlreadyPerformedOnSamePage < maxAnimationOnSamePageWithoutMovement * 2) {
        if (numOfAnimationsAlreadyPerformedOnSamePage < maxAnimationOnSamePageWithoutMovement) {
          if (animateUlForMiddle) {
            for (var counter2 = 0; counter2 < copyOfmiddleIndexArray.length; counter2 += 1) {
              if (displayUlVerbCSSOrNot(copyOfmiddleIndexArray[counter2]))
                animateCanvasBottomLine(ulVerbCSS[copyOfmiddleIndexArray[counter2]], 'middle');
            }
          }
          if (animateUlForPassive) {
            for (var counter1 = 0; counter1 < copyOfpassiveIndexArray.length; counter1 += 1) {
              if (displayUlVerbCSSOrNot(copyOfpassiveIndexArray[counter1]))
                animateCanvasBottomLine(ulVerbCSS[copyOfpassiveIndexArray[counter1]], 'passive');
            }
          }
          for (var counter = 0; counter < animationIndexArray.length; counter += 1) {
            if (displayUlVerbCSSOrNot(animationIndexArray[counter]))
            animateCanvas(ulVerbCSS[animationIndexArray[counter]], animateUlForPassive, animateUlForMiddle);
          }
        }
        timestampOfLastAnimation = window.performance.now();
        handleOfRequestedAnimation = requestAnimationFrame(goAnimate);
      }
      else handleOfRequestedAnimation = -1;
      numOfAnimationsAlreadyPerformedOnSamePage += 1;
    }
    else handleOfRequestedAnimation = requestAnimationFrame(goAnimate); // Not time yet
  } 
  else handleOfRequestedAnimation = -1; // No animation required so don't requestAnimationFrame() and set it to -1 so that other function will know when to requestAnimationFrame()
}

function animateCanvas(cc, animateUlForPassive, animateUlForMiddle) { // cc is the current image object
  if (cc.canvas.width > 1) {
    cc.context.clearRect(0, 0, cc.canvas.width, cc.canvas.height); // clear the canvas
    if (cc.animCount > cc.canvas.width) // reset, start from beginning
      cc.animCount = cc.animCount - cc.canvas.width;
    if (cc.animCount > 0) // draw image1
      cc.context.drawImage(cc.img, cc.animCount - cc.canvas.width, 0, cc.canvas.width, cc.canvas.height);
    cc.context.drawImage(cc.img, cc.animCount, 0, cc.canvas.width, cc.canvas.height); // draw image2
  }
  cc.animCount = cc.animCount + cc.animIncrement;
  if ((cc.name.substr(1, 1) === 'p') && (animateUlForPassive))
    updateBottomLineOnly(cc, 'passive');
  if ((cc.name.substr(1, 1) === 'm') && (animateUlForMiddle))
    updateBottomLineOnly(cc, 'middle');
  var dataURL = cc.canvas.toDataURL('image/png');
  $('.v' + cc.name).css('background', 'url(' + dataURL + ') repeat-x 100% 100%');
}

function animateCanvasBottomLine(cc, voice) {
  updateBottomLineOnly(cc, voice);
  cc.animCount = cc.animCount + cc.animIncrement;
  var dataURL = cc.canvas.toDataURL('image/png');
  $('.v' + cc.name).css('background', 'url(' + dataURL + ') repeat-x 100% 100%');
}

function updateBottomLineOnly(cc, voice) {
  var color1, color2;
  if (voice === 'middle') {
    color1 = c4.inputMiddleUlColor1;
    color2 = c4.inputMiddleUlColor2;
  } else {
    color1 = c4.inputPassiveUlColor1;
    color2 = c4.inputPassiveUlColor2;
  }
  cc.context.beginPath();
  cc.context.lineWidth = 2;
  if (cc.animCount % 2 === 0) cc.context.strokeStyle = color1;
  else cc.context.strokeStyle = color2;
  cc.context.moveTo(0, cc.canvas.height - 1);
  cc.context.lineTo(cc.canvas.width, cc.canvas.height - 1);
  cc.context.stroke();
  cc.context.closePath();
}

function changeImageColor(cc, newColor, backgroundColor) {
  var rgb = hexToRgb(newColor);
  var backgroundRGB = null;
  var imageData = cc.context.getImageData(0, 0, cc.canvas.width, cc.canvas.height);
  var data = imageData.data;

  if (backgroundColor !== undefined) {
    backgroundRGB = hexToRgb(backgroundColor);
  }
  for (var i = 0; i < (data.length - (cc.canvas.width * 2)); i += 4) { // skip the last 2 rows which is used for underline of passive or middle voice
    if ((rgb !== null) && (data[i] === 0) && (data[i + 1] === 0) && (data[i + 2] === 0) && (data[i + 3] > 20)) {
      data[i] = rgb.r;
      data[i + 1] = rgb.g;
      data[i + 2] = rgb.b;
    } else if ((backgroundRGB !== null) && (data[i] === 0) && (data[i + 1] === 0) && (data[i + 2] === 0) && (data[i + 3] < 5)) {
      data[i] = backgroundRGB.r;
      data[i + 1] = backgroundRGB.g;
      data[i + 2] = backgroundRGB.b;
      data[i + 3] = 255;
    }
  }
  cc.context.putImageData(imageData, 0, 0);
}

function hexToRgb(hex) {
  var result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getColorCodeGrammarSettings() {
  if (typeof(Storage) !== 'undefined') {
    var tmp = localStorage.getItem('colorCode-CurrentSettings');
    if (tmp) c4 = createCopyOfColorSetting(JSON.parse(tmp));
    else c4 = JSON.parse(JSON.stringify(defaultC4));
  }
}

function updateLocalStorage(name, value) {
  c4[name] = value;
  localStorage.setItem('colorCode-CurrentSettings', JSON.stringify(c4));
}

function getVariablesForVerbTable() {
  var nameOfXAxisItems = [], nameOfYAxisItems = [], descOfXAxisItems = [], descOfYAxisItems = [];
  var orderOfXAxisItems, orderOfYAxisItems, xAxisTitle, yAxisTitle, nameOfAllXAxisItems, nameOfAllYAxisItems;
  var orderOfMood = [], orderOfTense = [], nameOfMood = [], nameOfTense = [], descOfMood = [], descOfTense = [];
  var nameOfAllMood = [], nameOfAllTense = [];
  var previousActiveMood = -1;
  for (var i = 0; i < c4.orderOfMood.length; i ++) {
    if (!c4.moodToCombineWithPrevious[i]) {
      orderOfMood.push(c4.orderOfMood[i]);
      nameOfMood.push(robinsonCodeOfMood[c4.orderOfMood[i]]);
      descOfMood.push(upCaseFirst(robinsonCodeOfMood[c4.orderOfMood[i]]));
      previousActiveMood ++;
    }
    else descOfMood[previousActiveMood] += '<br>' + upCaseFirst(robinsonCodeOfMood[c4.orderOfMood[i]]);
    nameOfAllMood.push(robinsonCodeOfMood[c4.orderOfMood[i]]);
  }
  var previousActiveTense = -1;
  for (var i = 0; i < c4.orderOfTense.length; i ++) {
    if (!c4.tenseToCombineWithPrevious[i]) {
      orderOfTense.push(c4.orderOfTense[i]);
      nameOfTense.push(robinsonCodeOfTense[c4.orderOfTense[i]]);
      descOfTense.push(upCaseFirst(robinsonCodeOfTense[c4.orderOfTense[i]]));
      previousActiveTense ++;
    }
    else descOfTense[previousActiveTense] += '<br>' + upCaseFirst(robinsonCodeOfTense[c4.orderOfTense[i]]);
    nameOfAllTense.push(robinsonCodeOfTense[c4.orderOfTense[i]]);
  }
  if (c4.xAxisForMood) {
    xAxisTitle = 'moods';
    yAxisTitle = 'tenses';
    orderOfXAxisItems = orderOfMood;
    orderOfYAxisItems = orderOfTense;
    nameOfXAxisItems = nameOfMood;
    nameOfYAxisItems = nameOfTense;
    descOfXAxisItems = descOfMood;
    descOfYAxisItems = descOfTense;
    nameOfAllXAxisItems = nameOfAllMood;
    nameOfAllYAxisItems = nameOfAllTense;
  }
  else {
    xAxisTitle = 'tenses';
    yAxisTitle = 'moods';
    orderOfXAxisItems = orderOfTense;
    orderOfYAxisItems = orderOfMood;
    nameOfXAxisItems = nameOfTense;
    nameOfYAxisItems = nameOfMood;
    descOfXAxisItems = descOfTense;
    descOfYAxisItems = descOfMood;
    nameOfAllXAxisItems = nameOfAllTense;
    nameOfAllYAxisItems = nameOfAllMood;
  }
  return {
    nameOfXAxisItems: nameOfXAxisItems,
    nameOfYAxisItems: nameOfYAxisItems,
    descOfXAxisItems: descOfXAxisItems,
    descOfYAxisItems: descOfYAxisItems,
    orderOfXAxisItems: orderOfXAxisItems,
    orderOfYAxisItems: orderOfYAxisItems,
    xAxisTitle: xAxisTitle,
    yAxisTitle: yAxisTitle,
    nameOfAllXAxisItems: nameOfAllXAxisItems,
    nameOfAllYAxisItems: nameOfAllYAxisItems
  }
}

function getVariablesForOTVerbTable(language) {
  var nameOfXAxisItems = [], nameOfYAxisItems = [], descOfXAxisItems = [], descOfYAxisItems = [];
  var orderOfXAxisItems, orderOfYAxisItems, xAxisTitle, yAxisTitle, nameOfAllXAxisItems, nameOfAllYAxisItems;
  var orderOfStem = [], orderOfForm = [], nameOfStem = [], nameOfForm = [], descOfStem = [], descOfForm = [];
  var nameOfAllStem = [], nameOfAllForm = []; var stemToCombineWithPrevious; var lengthOfOrderOfStem = 0;
  var previousActiveStem = -1;
  if (language == 'H') {
    stemToCombineWithPrevious = c4.hebrewStemToCombineWithPrevious;
    lengthOfOrderOfStem = c4.orderOfHebrewStem.length;
  }
  else {
    stemToCombineWithPrevious = c4.aramaicStemToCombineWithPrevious;
    lengthOfOrderOfStem = c4.orderOfAramaicStem.length;
  }
  for (var i = 0; i < lengthOfOrderOfStem; i ++) {
    var currentStem = ''; var currentName = ''; var currentTitleDisplayStatus = false;
    if ((language == 'H') && (c4.orderOfHebrewStem[i] != null)) {
      currentStem = c4.orderOfHebrewStem[i];
      currentName = c4.hebrewCodeOfStem[currentStem][0];
      currentTitleDisplayStatus = c4.hebrewCodeOfStem[currentStem][2];
    }
    else if ((language == 'A') && (c4.orderOfAramaicStem[i] != null)) {
        currentStem = c4.orderOfAramaicStem[i];
        currentName = c4.aramaicCodeOfStem[currentStem][0];
        currentTitleDisplayStatus = c4.aramaicCodeOfStem[currentStem][2];
    }
    if (!stemToCombineWithPrevious[i]) {
      orderOfStem.push(currentStem);
      nameOfStem.push(currentName);
      if (currentTitleDisplayStatus) descOfStem.push(upCaseFirst(currentName));
      else descOfStem.push('');
      previousActiveStem ++;
    }
    else if (currentTitleDisplayStatus) {
      if (descOfStem[previousActiveStem].length > 0) descOfStem[previousActiveStem] += '<br>';
      descOfStem[previousActiveStem] += upCaseFirst(currentName);
    }
    nameOfAllStem.push(currentName);
  }
  var previousActiveForm = -1;
  for (var i = 0; i < c4.orderOfOTForm.length; i ++) {
    if (!c4.oTVerbFormToCombineWithPrevious[i]) {
      orderOfForm.push(c4.orderOfOTForm[i]);
      nameOfForm.push(c4.oTCodeOfForm[c4.orderOfOTForm[i]][0]);
      if (c4.oTCodeOfForm[c4.orderOfOTForm[i]][2])
        descOfForm.push(c4.oTCodeOfForm[c4.orderOfOTForm[i]][1]);
      else descOfForm.push('');
      previousActiveForm ++;
    }
    else if (c4.oTCodeOfForm[c4.orderOfOTForm[i]][2]) {
      if (descOfForm[previousActiveForm].length > 0) descOfForm[previousActiveForm] += '<br>';
      descOfForm[previousActiveForm] += c4.oTCodeOfForm[c4.orderOfOTForm[i]][1];
    }
    nameOfAllForm.push(c4.oTCodeOfForm[c4.orderOfOTForm[i]][0]);
  }
  if (c4.xAxisForStem) {
    xAxisTitle = 'stems';
    yAxisTitle = 'forms';
    orderOfXAxisItems = orderOfStem;
    orderOfYAxisItems = orderOfForm;
    nameOfXAxisItems = nameOfStem;
    nameOfYAxisItems = nameOfForm;
    descOfXAxisItems = descOfStem;
    descOfYAxisItems = descOfForm;
    nameOfAllXAxisItems = nameOfAllStem;
    nameOfAllYAxisItems = nameOfAllForm;
  }
  else {
    xAxisTitle = 'forms';
    yAxisTitle = 'stems';
    orderOfXAxisItems = orderOfForm;
    orderOfYAxisItems = orderOfStem;
    nameOfXAxisItems = nameOfForm;
    nameOfYAxisItems = nameOfStem;
    descOfXAxisItems = descOfForm;
    descOfYAxisItems = descOfStem;
    nameOfAllXAxisItems = nameOfAllForm;
    nameOfAllYAxisItems = nameOfAllStem;
  }
  return {
    nameOfXAxisItems: nameOfXAxisItems,
    nameOfYAxisItems: nameOfYAxisItems,
    descOfXAxisItems: descOfXAxisItems,
    descOfYAxisItems: descOfYAxisItems,
    orderOfXAxisItems: orderOfXAxisItems,
    orderOfYAxisItems: orderOfYAxisItems,
    xAxisTitle: xAxisTitle,
    yAxisTitle: yAxisTitle,
    nameOfAllXAxisItems: nameOfAllXAxisItems,
    nameOfAllYAxisItems: nameOfAllYAxisItems
  }
}

function upCaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function setupNextPageAndGotoUrl(url, configName, infoMsg) {
  if (configName.indexOf("function:") == 0){
    var functionName = configName.substr(9);
    if (functionName == "openStats") {
      localStorage.setItem('colorCode-openStatus', JSON.stringify(true));
    }
  }
  else openUserSelectedConfig(configName);
  localStorage.setItem('colorCode-InfoMsg', JSON.stringify(infoMsg));
  window.location.assign(url); 
}

function getSpecificMorphologyInfo(morphCode, morphName, result) {
  var index;
  var ot_var = otMorph[morphName];
  for (var count = morphCode.length; ((count > 0) && (index == undefined)); count --) {
    index = ot_var[morphCode.substr(0, count)];
  }
  if (index == undefined) {
    console.log("cannot find code " + morphCode + " name: " + morphName);
    return;
  }
  else {
    var resultStr = otMorph.txtArray[index];
    if (resultStr == undefined) {
      console.log("Cannot find code: " + morphCode + " name: " + morphName);
      return;  
    }
    result[morphName] = resultStr;
  }
}

function getTOSMorphologyInfo(morphCode) {
  var result = {};
  if ((morphCode.startsWith('TOS:')) && (otMorph != null)) {
    var code = morphCode.substr(4);
    var languageCode = code.substr(0, 1);
    getSpecificMorphologyInfo(languageCode, "language", result);
    var descriptionCode = code.substr(1) + code.substr(0, 1);
    getSpecificMorphologyInfo(descriptionCode, "description", result);
    var functionCd = code.substr(1, 1);
    getSpecificMorphologyInfo(functionCd, "ot_function", result);
    if (result["ot_function"] != undefined) {
      if (code.length > 2) {
        var formPos = 2; var stemExpandedCd = '';
        if (result["ot_function"].toLowerCase().startsWith('verb')) {
          formPos = 3; 
          stemExpandedCd = code.substr(2, 1) + languageCode;
          getSpecificMorphologyInfo(stemExpandedCd, "stem", result);
          if ( (code.length == 5) && ((code.substr(3, 2) == 'aa') || (code.substr(3, 2) == 'cc')) ) {
              getSpecificMorphologyInfo(code.substr(4, 1), "state", result);
              getSpecificMorphologyInfo(code.substr(4, 1), "stateExplained", result);
              getSpecificMorphologyInfo(code.substr(4, 1), "stateDesc", result);
              code = code.substr(0, 3) + 'f' + code.substr(4, 1); // Have to change the code for infinitive code because it does not have one.  
          }
        }
        var formCd = code.substr(formPos, 1);
        var formExpandedCd = formCd + functionCd;
        getSpecificMorphologyInfo(formExpandedCd, "form", result);
        if (code.length == (formPos + 4)) {
          var pos1 = code.substr(formPos + 1, 1);
          var pos2 = code.substr(formPos + 2, 1);
          var pos3 = code.substr(formPos + 3, 1);
          var genderCd, numberCd, personCd;
          if ((pos1 == '1') || (pos1 == '2') || (pos1 == '3') ) {
            personCd = pos1;
            getSpecificMorphologyInfo(personCd, "person", result);
            getSpecificMorphologyInfo(pos1 + pos3, "personExplained", result);
            getSpecificMorphologyInfo(pos1 + pos3, "personDesc", result);
            genderCd = pos2;
            numberCd = pos3;
          }
          else {
            genderCd = pos1;
            numberCd = pos2;
            getSpecificMorphologyInfo(pos3, "state", result);
            getSpecificMorphologyInfo(pos3, "stateExplained", result);
            getSpecificMorphologyInfo(pos3, "stateDesc", result);
          }
          getSpecificMorphologyInfo(genderCd, "gender", result);
          getSpecificMorphologyInfo(numberCd, "number", result);
          getSpecificMorphologyInfo(genderCd, "genderExplained", result);
          var genderExpandedCd = genderCd + numberCd;
          getSpecificMorphologyInfo(genderExpandedCd, "genderDesc", result);
          getSpecificMorphologyInfo(numberCd, "numberExplained", result);
          getSpecificMorphologyInfo(numberCd, "numberDesc", result);
        }
        else if (code.length == 4) {
          getSpecificMorphologyInfo(code.substr(3, 1), "gender", result);
          getSpecificMorphologyInfo(code.substr(3, 1), "genderExplained", result);
          getSpecificMorphologyInfo(code.substr(3, 1), "genderDesc", result);
        }
        if (functionCd == 'V') {
          getSpecificMorphologyInfo(stemExpandedCd, "ot_action", result);
          var voiceCd = stemExpandedCd;
          if ((formExpandedCd == 'sV') && (stemExpandedCd == 'qH')) voiceCd = stemExpandedCd + formCd;
          getSpecificMorphologyInfo(voiceCd, "ot_voice", result);
          getSpecificMorphologyInfo(formExpandedCd, "ot_tense", result);
          var moodCd = formExpandedCd;
          if (formExpandedCd == 'iV') moodCd = formExpandedCd + personCd;
          getSpecificMorphologyInfo(moodCd, "ot_mood", result);
          getSpecificMorphologyInfo(moodCd, "ot_moodExplained", result);
          getSpecificMorphologyInfo(moodCd, "ot_moodDesc", result);
          getSpecificMorphologyInfo(stemExpandedCd, "stemExplained", result);
          getSpecificMorphologyInfo(stemExpandedCd, "stemDesc", result);
          getSpecificMorphologyInfo(stemExpandedCd, "ot_actionExplained", result);
          getSpecificMorphologyInfo(stemExpandedCd, "ot_actionDesc", result);
          getSpecificMorphologyInfo(voiceCd + numberCd, "ot_voiceExplained", result);
          getSpecificMorphologyInfo(voiceCd + numberCd, "ot_voiceDesc", result);
          getSpecificMorphologyInfo(formExpandedCd, "ot_tenseExplained", result);
          getSpecificMorphologyInfo(formExpandedCd, "ot_tenseDesc", result);
        }
        var functionExpandedCd = functionCd + formCd + numberCd;
        getSpecificMorphologyInfo(functionExpandedCd, "functionExplained", result);   
        getSpecificMorphologyInfo(functionExpandedCd, "functionDesc", result); 
        getSpecificMorphologyInfo(formExpandedCd, "formExplained", result);
        getSpecificMorphologyInfo(formExpandedCd, "formDesc", result);
      }
    }
  }
  getExplanationOfMorph(code, result);
  var resultArray = [];
  resultArray.push(result);
  //console.log(result);
  return resultArray;
}

function getExplanationOfMorph(code, result) {
  var resultString = '';
  if (code.search(/^[HA]V[a-zA-Z](fc|fa)$/) > -1)
    resultString = assembleDescriptionsOfMorph(result, ['ot_actionDesc', 'functionDesc', 'ot_moodDesc', 'formDesc', 'ot_voiceDesc', 'stateDesc']);
  else if (code.search(/^[HA]V[a-zA-Z][rs]/) > -1)
    resultString = assembleDescriptionsOfMorph(result, ['ot_actionDesc', 'functionDesc', 'formDesc', 'ot_voiceDesc', 'genderDesc', 'numberDesc', 'stateDesc']);
  else if (code.search(/^[HA]V/) > -1)
    resultString = assembleDescriptionsOfMorph(result, ['ot_actionDesc', 'functionDesc', 'ot_moodDesc', 'formDesc', 'ot_tenseDesc', 'ot_voiceDesc', 'genderDesc', 'numberDesc', 'personDesc']);
  else if (code.search(/^[HA]Ng\w\wd$/) > -1)
    resultString = assembleDescriptionsOfMorph(result, ['functionDesc', 'stateDesc', 'genderDesc', 'numberDesc', 'formDesc']);
  else if ((code.search(/^[HA]Ng\w\w[ac]$/) > -1) || (code.search(/^[HA]Aabsa$/) > -1))
    resultString = assembleDescriptionsOfMorph(result, ['functionDesc', 'genderDesc', 'numberDesc', 'formDesc', 'stateDesc']);
  else if (code.search(/^[HA][PS]p\w\w\w$/) > -1)
    resultString = assembleDescriptionsOfMorph(result, ['functionDesc', 'formDesc',  'genderDesc', 'numberDesc', 'personDesc']);
  else if (code.search(/^[HA]Ng$/) > -1)
    resultString = assembleDescriptionsOfMorph(result, ['functionDesc', 'formDesc',  'genderDesc', 'numberDesc', 'personDesc']);
  else if (code.search(/^[HA]A[co]\w\wd$/) > -1)
    resultString = assembleDescriptionsOfMorph(result, ['functionDesc', 'formDesc',  'stateDesc', 'genderDesc', 'numberDesc']); // 15B9A
  else if (code.search(/^[HA][NA]\w\w\wd$/) > -1)
    resultString = assembleDescriptionsOfMorph(result, ['functionDesc', 'stateDesc', 'formDesc',  'genderDesc', 'numberDesc']); // 1B59A
  else resultString = assembleDescriptionsOfMorph(result, ['functionDesc', 'ot_actionDesc', 'ot_voiceDesc', 'fromDesc', 'ot_tenseDesc', 'ot_moodDesc', 'personDesc', 'genderDesc', 'numberDesc', 'stateDesc']);
  if (resultString != '') {
    result['explanation'] = resultString;
  }
}

function assembleDescriptionsOfMorph(morphObj, keys) {
  result = '';
  for (var c = 0; c < keys.length; c++) {
    if ((morphObj[keys[c]] != undefined) || (morphObj[keys[c]] != null) && (morphObj[keys[c]].length > 0))
      result += morphObj[keys[c]] + ' ';
//    else console.log('assembleDescriptionsOfMorph cannot find key: ' + keys[c]);
  }
  return result.replace(/\s\s+/, ' ').replace(/^\s/, '').replace(/\s$/, '');
}

function addClassForTHOT(passageHTML) {
  var result = '';
  var pLength = passageHTML.length;
  var currentPos = 0; var lastCopyPos = 0;
  var otCSSOnThisPage = '';

  while (currentPos < pLength) {
    var morphPos = passageHTML.indexOf("morph=", currentPos);
    if (morphPos > -1) {
      var charAfterMorph = passageHTML.substr(morphPos + 6, 1);
      if (((charAfterMorph == '"') || (charAfterMorph == "'")) && (passageHTML.substr(morphPos + 7, 4) == 'TOS:')) {
        currentPos = morphPos + 11;
        var endingQuotePos = passageHTML.indexOf(charAfterMorph, currentPos);
        if ((endingQuotePos > -1) && (endingQuotePos - currentPos < 10)) {
          var morphCode = passageHTML.substring(currentPos, endingQuotePos);
          currentPos = endingQuotePos + 1;
          var cssCode = morph2CSS(morphCode).trim();
          if (cssCode.length > 0) {
            var foundPos3 = passageHTML.indexOf(">", currentPos);
            if (foundPos3 > -1) {
              var shorterStringToSearch = passageHTML.substring(currentPos, foundPos3);
              var classPos = shorterStringToSearch.indexOf("class=");
              if (classPos > 0) {
                var foundPos5 = currentPos + classPos + 7;
                result = result.concat(passageHTML.substring(lastCopyPos, foundPos5));
                lastCopyPos = foundPos5;
                result = result.concat(cssCode);
                var cssCodes = cssCode.split(" ");
                for (var cc = 0; cc < cssCodes.length; cc ++) {
                  if (cssCodes[cc].substr(0, 4) == 'vot_')
                    if (otCSSOnThisPage.indexOf(cssCodes[cc].substr(4, 4)) == -1) otCSSOnThisPage = otCSSOnThisPage + ' ' + cssCodes[cc].substr(4, 4);
                }
              }
              else alert("warning: addClassForTHOT cannot find class");
            }
            else alert("warning: addClassForTHOT cannot find >");
          }
        }
        else alert("warning: addClassForTHOT cannot find ending quote at " + endingQuotePos);
      }
      else currentPos = morphPos + 6;
    }
    else break;
  }
  return [result.concat(passageHTML.substring(lastCopyPos, pLength)), otCSSOnThisPage + ' '];
}

function getClassesForNT(passageHTML) {
  var pLength = passageHTML.length;
  var currentPos = 0;
  var ntCSSOnThisPage = '';
  while (currentPos < pLength) {
    var classPos = passageHTML.indexOf("class=", currentPos);
    if (classPos > -1) {
      var charAfterClass = passageHTML.substr(classPos + 6, 1);
      if ((charAfterClass == '"') || (charAfterClass == "'")) {
        currentPos = classPos + 7;
        var endingQuotePos = passageHTML.indexOf(charAfterClass, currentPos);
        if ((endingQuotePos > -1) && (endingQuotePos - currentPos < 100)) {
          if (endingQuotePos > 0) {
            var morphCodes = passageHTML.substring(currentPos, endingQuotePos);
            var cssCodes = morphCodes.split(" ");
            for (var cc = 0; cc < cssCodes.length; cc ++) {
              if ((cssCodes[cc].substr(0, 1) == 'v') && (cssCodes[cc].substr(1, 1) != 'e'))
                if (ntCSSOnThisPage.indexOf(cssCodes[cc]) == -1) ntCSSOnThisPage = ntCSSOnThisPage + ' ' + cssCodes[cc];
            }
          }
          currentPos = endingQuotePos + 1;
        }
        else alert("warning: addClassForNT cannot find ending quote at " + endingQuotePos);
      }
      else currentPos = classPos + 6;
    }
    else break;
  }
  return ntCSSOnThisPage + ' ';
}

function createCopyOfColorSetting(obj) {
  var result = JSON.parse(JSON.stringify(defaultC4)); // Make a copy of the default
  for (var key in obj) { // Add keys and values which are in the user selected color config
    if (key in result) result[key] = obj[key]; // If the key does not exist in the default settings, it is probably an old key that is no longer used
  }
  return result;
}

function tableAxisSpan(axis, createUserInputFields, ot) {
  var otPrefix = 'nt';
  if ((ot != undefined) && (ot == 'OT')) otPrefix = 'ot';
  var curXTitle = c4[otPrefix + 'VerbTable' + axis + 'Header'];
  var modalWidth = $('body').width();
  if ((modalWidth != undefined) && (modalWidth != null) && (!isNaN(modalWidth)) && (modalWidth < 605) && (axis == 'Y')) return 2;
  if ((curXTitle != null) && (createUserInputFields)) return 3; // The header information is not showed if there are no user input fields which is at the help quicklinks panel
  else return 2;
}

function addTitleToYAxis(rowNum, descOfYAxisItems, createUserInputFields, xAxisRowSpan, ot) {
  var htmlTable = ''; var prefix = 'nt';
  if ((ot != undefined) && (ot == 'OT')) prefix = 'ot';
  var curYTitle = c4[prefix + 'VerbTableYHeader'];
  if ((curYTitle != null) && (createUserInputFields) && (xAxisRowSpan == 3)) { // screen size might not be wide enough for help quicklink
    var title_range_low = 0;
    for (var i = 0; i < curYTitle.desc.length; i ++) {
      rowsCovered = curYTitle.repeat[i] + 1;
      if (rowNum == title_range_low) {
        htmlTable += '<td class="tg-yw4l" rowspan="' + rowsCovered + '">' + curYTitle.desc[i] + '</td>';
        break;
      }
      title_range_low += rowsCovered;
    }
  }
  htmlTable += '<td>' + descOfYAxisItems;
  return htmlTable;
}

function morph2CSS(morphCode) {
  var result = '';
  if (morphCode != undefined) {
    var number = ''; var gender = '';
    var morphCodeLength = morphCode.length;
    if ((morphCodeLength == 6) || (morphCodeLength == 7)) {
        var charMinus2 = morphCode.substr(morphCodeLength - 3, 1);
        if ((charMinus2 == "1") || (charMinus2 == "2") || (charMinus2 == "3")) {
            gender = morphCode.substr(morphCodeLength - 2, 1);
            number = morphCode.substr(morphCodeLength - 1, 1);
        }
        else if ((charMinus2 == "b") || (charMinus2 == "c") || (charMinus2 == "f") || (charMinus2 == "l") || (charMinus2 == "m") || (charMinus2 == "t")) {
            gender = charMinus2;
            number = morphCode.substr(morphCodeLength - 2, 1);
        }
    }
    else if (morphCodeLength == 4) {
        gender = morphCode.substr(3, 1);
    }
    if (number != "") {
        if ((number == "p") || (number == "d")) result += 'plur ';
        else if (number == "s") result += 'sing ';
    }
    if (gender != "") {
        if (gender == "m") result += 'mas ';
        else if (gender == "f") result += 'fem ';
        else if ((gender == "b") || (gender == "c") || (gender == "l") || (gender == "t")) result += 'neut ';
    }
    if (morphCode.substr(1, 1) == 'V') {
        if (morphCode.length == 5)
            morphCode = morphCode.substr(0, 3) + 'f' + morphCode.substr(4, 1);
        var formIndex = oTFormIndex2CSS[morphCode.substr(3, 1)];
        var stemIndex;
        if (morphCode.substr(0, 1) == 'H')
            stemIndex = hebrewStemIndex2CSS[morphCode.substr(2, 1)];
        else if (morphCode.substr(0, 1) == 'A')
            stemIndex = aramaicStemIndex2CSS[morphCode.substr(2, 1)];
        if ((formIndex != undefined) && (stemIndex != undefined)) {
          result += 'vot_R' + formIndex + 'C' + stemIndex;
        }
        else console.log("unknown verb "+ morphCode);                              
    }
  }
  return result;
}

function addVerbTable(createUserInputFields, htmlElement) {
  var r = getVariablesForVerbTable();
  var xAxisItems, yAxisItems, descOfXAxisItems, descOfYAxisItems;
  xAxisItems = r.orderOfXAxisItems;
  yAxisItems = r.orderOfYAxisItems;
  descOfXAxisItems = r.descOfXAxisItems;
  descOfYAxisItems = r.descOfYAxisItems;
  var htmlTable = '';
  if (!createUserInputFields) htmlTable = '<link href="css/color_code_grammar.css" rel="stylesheet" media="screen"/>';
  if ((createUserInputFields) && (c4.ntVerbTableHTML != undefined) && (c4.ntVerbTableHTML != null))
    htmlTable += c4.ntVerbTableHTML;
  else {
    var yAxisSpan = tableAxisSpan('Y', createUserInputFields);
    htmlTable += '<table class="tg2"><tr><th valign="middle" align="center" colspan="' +
      yAxisSpan + '" rowspan="' + tableAxisSpan('X', createUserInputFields) + '">';
    if (createUserInputFields) htmlTable += htmlToAdd1();
    htmlTable += '</th><th class="tg-amwm2" colspan="' + xAxisItems.length + '">' + upCaseFirst(r.xAxisTitle);
    if (createUserInputFields) htmlTable += htmlToAdd2(r.xAxisTitle);
    htmlTable += '</th></tr>';
    htmlTable += addTitleToXAxis(descOfXAxisItems, createUserInputFields);
    htmlTable += '<tr>' +
      '<td class="tg-e3zv2" rowspan="' + yAxisItems.length + '">' + upCaseFirst(r.yAxisTitle);
    if (createUserInputFields) htmlTable += htmlToAdd4(r.yAxisTitle);
    htmlTable += '</td>';
    for (i = 0; i < yAxisItems.length; i += 1) {
      if (i > 0) htmlTable += '<tr>';
      htmlTable += addTitleToYAxis(i, descOfYAxisItems[i], createUserInputFields, yAxisSpan);
      if (createUserInputFields) htmlTable += htmlToAdd5(i);
      htmlTable += '</td>';
      for (var counter = 0; counter < xAxisItems.length; counter += 1) {
        htmlTable += '<td>';
        if (createUserInputFields) {// add code to provide for all items in the group
          var allTM = getAllTenseMoodForThisGroup(r, counter, i);
          htmlTable += voicesInTenseAndMood(allTM.x, allTM.y, createUserInputFields);
        }
        else {
          var xAxisCode, yAxisCode;
          if (c4.xAxisForMood) {
            xAxisCode = robinsonNameOfMood[r.nameOfAllXAxisItems[counter]];
            yAxisCode = robinsonNameOfTense[r.nameOfAllYAxisItems[i]];
          }
          else {
            yAxisCode = robinsonNameOfMood[r.nameOfAllXAxisItems[counter]];
            xAxisCode = robinsonNameOfTense[r.nameOfAllYAxisItems[i]];
          }
          htmlTable += voicesInTenseAndMood([xAxisCode], [yAxisCode], true);
        }
        htmlTable += '</td>';
      }
      htmlTable += '</tr>';
    }
    htmlTable += '</table><br>';
    if (createUserInputFields) htmlTable += htmlToAdd6();
  }
  htmlTable = $(htmlTable);
  htmlTable.appendTo(htmlElement);
}

function htmlToAdd1(otVerb) {
  var otPrefix = '';
  if (otVerb !== undefined) otPrefix = 'OT';
  return '<div class="onoffswitch">' +
  '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="' + otPrefix + 'verbonoffswitch" onchange=\'userToggleColorGrammar("' + otPrefix + 'verb")\'/>' +
  '<label class="onoffswitch-label" for="' + otPrefix + 'verbonoffswitch">' +
      '<span class="onoffswitch-inner"></span>' +
      '<span class="onoffswitch-switch"></span>' +
  '</label></div>';
}

function htmlToAdd2(xAxisTitle, otVerb) {
  var otPrefix = '';
  if (otVerb !== undefined) otPrefix = 'OT';
  return '&nbsp;<button id="' + otPrefix + 'configXAxisBtn" class="' + otPrefix + 'vrbInpt1 btn btn-default btn-xs" type="button" title="Select ' + 
    xAxisTitle + '" onclick=\'userToggleXOrYAxisConfig("' + otPrefix + '", "X")\'>' +
    '<span id="' + otPrefix + 'configXAxisIcon" class="' + otPrefix + 'vrbInpt1 glyphicon glyphicon-cog"></span></button>' + 
    '&nbsp;<button id="' + otPrefix + 'configSortXAxisBtn" class="btn btn-default btn-xs ' + otPrefix + 'advancedtools ' + otPrefix + 'vrbInpt1" type="button" title="Sort ' +  xAxisTitle + '" onclick="userSort' + otPrefix + 'Axis(\'X\')">' +
    '<span id="configSortXAxisIcon" class="glyphicon glyphicon-sort"></span></button>';
}

function htmlToAdd3(i, otVerb) {
  var otPrefix = ''; var result = '';
  if (otVerb !== undefined) otPrefix = 'OT';
  result = '<input id="' + otPrefix + 'axisXOnOffCheckbox' + i + '" class="' + otPrefix + 'vrbInptX" ' +
    'type="checkbox" onchange=\'userToggleXOrYAxisConfig("' + otPrefix + '", "X", "' + i + '")\'>';
  result += '<br><input id="inputColor' + otPrefix + 'VerbItem' + i + '" class="' + otPrefix + 'vrbInptC" type="color" ' +
    'value="' + c4['inputColor' + otPrefix + 'VerbItem' + i ] + '" ';
  return result;
}

function htmlToAdd4(yAxisTitle, otVerb) {
  var otPrefix = ''; var result = '';
  if (otVerb !== undefined) otPrefix = 'OT';
  return '<button id="' + otPrefix + 'configYAxisBtn" class="' + otPrefix + 'vrbInpt1 btn btn-default btn-xs" type="button" title="Select ' + yAxisTitle + '" onclick=\'userToggleXOrYAxisConfig("' + otPrefix + '", "Y")\'>' +
    '<span id="' + otPrefix + 'configYAxisIcon" class="' + otPrefix + 'vrbInpt1 glyphicon glyphicon-cog"></span></button>' +
    '<br><br><button id="' + otPrefix + 'configSortYAxisBtn" class="btn btn-default btn-xs ' + otPrefix + 'advancedtools ' + otPrefix + 'vrbInpt1" type="button" title="Sort ' +  yAxisTitle + '" onclick="userSort' + otPrefix + 'Axis(\'Y\')">' +
    '<span id="configSortYAxisIcon" class="glyphicon glyphicon-sort ' + otPrefix + 'advancedtools"></span></button>';
}

function htmlToAdd5(i, otVerb) {
  var otPrefix = ''; var result = '';
  if (otVerb != undefined) otPrefix = 'OT';
  result = '<input id="' + otPrefix + 'axisYOnOffCheckbox' + i + '" class="' + otPrefix + 'vrbInptY" ' +
    'type="checkbox" onchange=\'userToggleXOrYAxisConfig("' + otPrefix + '", "Y", "' + i + '")\'><br>';
  result += '<select id="selectedHighlight' + otPrefix + 'VerbItem' + i + '" class="' + otPrefix + 'vrbInpt1" ' +
    'onchange=\'userUpdate' + otPrefix +'YAxisItem("' + i + '", value)\'';
  if (otPrefix != 'OT') result += ' style="width: 52px"';
  result += '>' +
    '<option value="ulSolid">Underline</option>' +
    '<option value="ulDoubleSolid">2 lines</option>' +
    '<option value="ulDash">Dash</option>' +
    '<option value="ulDashDot">Dash Dot</option>' +
    '<option value="ulDashDotDot">Dash Dot Dot</option>' +
    '<option value="ulDot">Dots</option>' +
    '<option value="ulWave">Wave</option>' +
    '<option value="ulArrow">Arrow</option>' +
    '<option value="ulShortArrow">Short Arrow</option>' +
    '<option value="ulReverseArrow">Reverse Arrow</option>' +
    '<option value="ulShortReverseArrow">Short Reverse Arrow</option>' +
    '</select>';
  if (otVerb == undefined) result += '<br><span id="inputAnimate' + i + '" class="advancedtools">' +
    'Animate:<input id="inputAnimateCheckbox' + i + '" class="advancedtools" ' +
    'type="checkbox" onchange=\'userUpdateAnimation("' + i + '")\'></span>';
  return result;
}

function htmlToAdd6(otVerb) {
  var otPrefix = '';
  if (otVerb != undefined) otPrefix = 'OT';
  var result = '<span>Passive voice: background - </span><input id="inputCheckbox' + otPrefix + 'PassiveBackgroundColor" type="checkbox" onchange=\'userUpdatePassiveMiddleVoiceBackground("passive", "' + otPrefix + '")\'>' +
    '<input id="input' + otPrefix + 'PassiveBackgroundColor" type="color" ' +
    'value="' + c4['input' + otPrefix + 'PassiveBackgroundColor'] + '"/>' +
    '<span>underline - </span><input id="inputCheckbox' + otPrefix + 'PassiveUlColor1" type="checkbox" onchange=\'userEnablePassiveMiddleVerbsUnderline1("passive", "' + otPrefix + '")\'>' +
    '<input id="input' + otPrefix + 'PassiveUlColor1" type="color" ' +
    'value="' + c4['input' + otPrefix + 'PassiveUlColor1'] + '"/>';
  if (otVerb == undefined) result += '<span>animated underline - </span>' +
    '<input id="inputCheckbox' + otPrefix + 'PassiveUlColor2" type="checkbox" onchange=\'userEnablePassiveMiddleVerbsUnderline2("passive", "' + otPrefix + '")\'>' +
    '<input id="input' + otPrefix + 'PassiveUlColor2" type="color" ' +
    'value="' + c4['input' + otPrefix + 'PassiveUlColor2'] + '"/>';
  result += '<br><br>' +
    '<span>Middle voice: background - </span><input id="inputCheckbox' + otPrefix + 'MiddleBackgroundColor" type="checkbox" onchange=\'userUpdatePassiveMiddleVoiceBackground("middle", "' + otPrefix + '")\'>' +
    '<input id="input' + otPrefix + 'MiddleBackgroundColor" type="color" ' +
    'value="' + c4['input' + otPrefix + 'MiddleBackgroundColor'] + '"/>' +
    '<span>underline - </span><input id="inputCheckbox' + otPrefix + 'MiddleUlColor1" type="checkbox" onchange=\'userEnablePassiveMiddleVerbsUnderline1("middle", "' + otPrefix + '")\'>' +
    '<input id="input' + otPrefix + 'MiddleUlColor1" type="color" ' +
    'value="' + c4['input' + otPrefix + 'MiddleUlColor1'] + '"/>';
  if (otVerb == undefined) result += '<span>animated underline - </span>' +
    '<input id="inputCheckbox' + otPrefix + 'MiddleUlColor2" type="checkbox" onchange=\'userEnablePassiveMiddleVerbsUnderline2("middle", "' + otPrefix + '")\'>' +
    '<input id="input' + otPrefix + 'MiddleUlColor2" type="color" ' +
    'value="' + c4['input' + otPrefix + 'MiddleUlColor2'] + '"/>';
//  result += '&nbsp;<button id="' + otPrefix + 'advancedToolsBtn" class="btn btn-default btn-xs" type="button" title="Advanced tools" onclick="userToggleAdvancedTools(\'' + otPrefix + '\')">' +
//    '<span id="' + otPrefix + 'advancedToolsIcon" class="glyphicon glyphicon-wrench"></span></button>';
  return result;
}

function addTitleToXAxis(descOfXAxisItems, createUserInputFields) {
  var htmlTable = '';
  var curXTitle = c4['ntVerbTableXHeader'];
  if ((curXTitle != null) && (createUserInputFields)) {
    htmlTable += '<tr>';
    for (var i = 0; i < curXTitle.desc.length; i ++) {
      htmlTable += '<td class="tg-yw4l" align="center" colspan="' + (curXTitle.repeat[i] + 1) + '">' + curXTitle.desc[i] + '</td>';
    }
    htmlTable += '</tr>';
  }
  htmlTable += '<tr>';
  for (var i = 0; i < descOfXAxisItems.length; i += 1) {
    htmlTable += '<td class="tg-yw4l"';
    if (descOfXAxisItems[i].length < 10) htmlTable += ' width=72';
    htmlTable += '>' + descOfXAxisItems[i];
    if (createUserInputFields) htmlTable += htmlToAdd3(i);
    htmlTable += '</td>';
  }
  htmlTable += '</tr>';
  return htmlTable;
}

function voicesInTenseAndMood(xAxisItem, yAxisItem, createUserInputFields) {
  var currentMoodCode, currentTenseCode;
  var highlightMiddle = c4['inputCheckboxMiddleBackgroundColorCheckValue'] ||
    c4['inputCheckboxMiddleUlColor1CheckValue'];
  var highlightPassive = c4['inputCheckboxPassiveBackgroundColorCheckValue'] ||
    c4['inputCheckboxPassiveUlColor1CheckValue'];
  var htmlTable = '';
  if (c4.xAxisForMood) {
    currentMoodCode = xAxisItem;
    currentTenseCode = yAxisItem;
  }
  else {
    currentMoodCode = yAxisItem;
    currentTenseCode = xAxisItem;   
  }
  var cssClassForActive = '';
  var cssClassForPassive = '';
  var cssClassForMiddle = '';
  for (var j = 0; j < currentTenseCode.length; j ++) {
    var arrayIndexOfCurrentTense = _.find(tenseIndexArray, function(obj) { return obj.name == robinsonCodeOfTense[currentTenseCode[j]]; }).array;
    for (var i = 0; i < arrayIndexOfCurrentTense.length; i += 1) {
      var cssName = ulVerbCSS[arrayIndexOfCurrentTense[i]].name;
      if (currentMoodCode.indexOf(cssName.substr(2, 1)) > -1) {
        if (cssName.substr(1, 1) === 'a') cssClassForActive = cssName;
        else if ((cssName.substr(1, 1) === 'm') &&
          (highlightMiddle || createUserInputFields)) cssClassForMiddle = cssName;
        else if ((cssName.substr(1, 1) === 'p') &&
          (highlightPassive || createUserInputFields)) cssClassForPassive = cssName;
      }
    }
  }
  if (cssClassForActive != '') htmlTable += '<span class="v' + cssClassForActive + '">active</span>';
  htmlTable += '<br>';
  if (cssClassForPassive != '') htmlTable += '<span class="v' + cssClassForPassive + '">passive</span>';
  htmlTable += '<br>';
  if (cssClassForMiddle != '') htmlTable += '<span class="v' + cssClassForMiddle + '">middle</span>';
  return htmlTable;
}

function getAllTenseMoodForThisGroup(r, x, y) {
  var currentMoodCodes, currentTenseCodes, moodIndex, tenseIndex, allMoods, allTenses;
  var allMoodsCdInThisGroup = [], allTensesCdInThisGroup = [];
  if (c4.xAxisForMood) {
    currentMoodCodes = r.orderOfXAxisItems;
    moodIndex = x;
    allMoods = r.nameOfAllXAxisItems;
    currentTenseCodes = r.orderOfYAxisItems;
    tenseIndex = y;
    allTenses = r.nameOfAllYAxisItems;
  }
  else {
    currentMoodCodes = r.orderOfYAxisItems;
    moodIndex = y;
    allMoods = r.nameOfAllYAxisItems;
    currentTenseCodes = r.orderOfXAxisItems;
    tenseIndex = x;
    allTenses = r.nameOfAllXAxisItems;
  }
  var currentMoodName = robinsonCodeOfMood[ currentMoodCodes[moodIndex] ];
  var indexOfCurrentMood = allMoods.indexOf(currentMoodName);
  var currentTenseName = robinsonCodeOfTense[currentTenseCodes[tenseIndex]];
  var indexOfCurrentTense = allTenses.indexOf(currentTenseName);
  if (currentMoodCodes.length > (moodIndex + 1)) {
    var nextMoodName = robinsonCodeOfMood[ currentMoodCodes[moodIndex+1]];
    var indexToEndOfCurrentMoodGroup = allMoods.indexOf(nextMoodName) - 1;
  }
  else indexToEndOfCurrentMoodGroup = allMoods.length - 1;
  if (currentTenseCodes.length > (tenseIndex + 1)) {
    var nextTenseName = robinsonCodeOfTense[ currentTenseCodes[tenseIndex+1]];
    var indexToEndOfCurrentTenseGroup = allTenses.indexOf(nextTenseName) - 1;
  }
  else indexToEndOfCurrentTenseGroup = allTenses.length - 1;
  for (var j = indexOfCurrentMood; j <= indexToEndOfCurrentMoodGroup; j ++) {
    allMoodsCdInThisGroup.push( robinsonNameOfMood[allMoods[j]] );
  }
  for (var j = indexOfCurrentTense; j <= indexToEndOfCurrentTenseGroup; j ++) {
    allTensesCdInThisGroup.push( robinsonNameOfTense[allTenses[j]] );
  }
  if (c4.xAxisForMood) {
    var allInXAxis = allMoodsCdInThisGroup;
    var allInYAxis = allTensesCdInThisGroup;
  }
  else {
    var allInXAxis = allTensesCdInThisGroup;
    var allInYAxis = allMoodsCdInThisGroup;
  }
  return {
    x: allInXAxis,
    y: allInYAxis
  }
}

function updateCssForNumber(type, fontHighlight) {
  var cssName = '';
  if (type === 'singular') cssName = '.sing';
  else if (type === 'plural') cssName = '.plur';
  else return; // unknown type. something is wrong!
  if (fontHighlight === 'bold') {
    $(cssName).css('font-style', 'normal');
    $(cssName).css('font-weight', 'bold');
  } else if (fontHighlight === 'normal') {
    $(cssName).css('font-style', 'normal'); // 
    $(cssName).css('font-weight', 'normal');
  } else if (fontHighlight === 'bold_italic') {
    $(cssName).css('font-style', 'italic');
    $(cssName).css('font-weight', 'bold');
  } else if (fontHighlight === 'normal_italic') {
    $(cssName).css('font-style', 'italic');
    $(cssName).css('font-weight', 'normal');
  }
  updatedGenderNumberCSS = true;
}

function getAxisOrderOfItem(moodOrTense, itemNumber) {
  var orderInAxis = itemNumber;
  for (i = 1; i <= itemNumber; i++) {
    if (c4[moodOrTense + 'ToCombineWithPrevious'][i]) orderInAxis --;
  }
  return orderInAxis;
}

function openUserSelectedConfig(name) {
  var selectedConfig;
  if (name != null) selectedConfig = name;
  else selectedConfig = document.getElementById('openColorConfigDropdown').value.toLowerCase();
  var previousEnableGenderNumberColor = true;
  if (c4 != undefined) previousEnableGenderNumberColor = c4.enableGenderNumberColor;
  if (selectedConfig === 'verb, gender and number') c4 = createCopyOfColorSetting(defaultC4VerbMoodTense);
  else if (selectedConfig === 'verb only (tense-mood)') c4 = createCopyOfColorSetting(defaultC4VerbTenseMood);
  else if (selectedConfig === 'gender and number') c4 = createCopyOfColorSetting(defaultC4NounOnly);
  else if (selectedConfig === 'verb with middle and passive voices') c4 = createCopyOfColorSetting(defaultC4VerbWithMiddlePassive);
  else if (selectedConfig === 'verb, imperative mood') c4 = createCopyOfColorSetting(defaultC4ImperativesOnly);
  else if (selectedConfig === 'verb, main vs supporting verbs') c4 = createCopyOfColorSetting(defaultC4MainVsSupporingVerbs);
  else if (selectedConfig === 'verb, gender and number, 2nd version') c4 = createCopyOfColorSetting(defaultC4VerbMoodTense2);
  else {
    var found = false;
    var tmp = localStorage.getItem('colorCode-UserColorConfigNames');
    if (tmp) {
      var UserColorConfigNames = JSON.parse(tmp);
      for (var i = 0; i < UserColorConfigNames.length; i += 1) {
        if (UserColorConfigNames[i].toLowerCase() === selectedConfig) {
          var tmp2 = localStorage.getItem('colorCode-UserColorConfigName-' + UserColorConfigNames[i]);
          if (tmp2) {
            found = true;
            c4 = createCopyOfColorSetting(JSON.parse(tmp2));
          } else UserColorConfigNames.splice(i, 1);
        }
      }
    }
    if (!found) {
      alert('Cannot find a configuation that match your selection');
      return;
    }
  }
  localStorage.setItem('colorCode-CurrentSettings', JSON.stringify(c4));
  if ((!previousEnableGenderNumberColor) && (c4.enableGenderNumberColor)) userTurnGenderNumberFromOffToOn = true;
  if (name == null) { 
    $('#openColorModal .close').click();
    var element = document.getElementById('openColorModal');
    element.parentNode.removeChild(element);
    updateAllSettingsAndInputFields();
  }
}
