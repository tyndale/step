function initializeClrCodeHtmlModalPage() {
  addVerbTable(true, '#verbClrs');
  addOTVerbTable(true, '#hVerbClrs');
  addNounTable();
  updateHtmlForYAxis();
  updateHtmlForXAxis();
  updateHtmlForGender();
  updateHtmlForNumber();
  updateHtmlForPassiveBkgrdClr();
  updateHtmlForMiddleBkgrdClr();
  enableOrDisableAxisConfigButtons('X');
  enableOrDisableAxisConfigButtons('Y');
  enableOrDisableAxisConfigButtons('X', 'OT');
  enableOrDisableAxisConfigButtons('Y', 'OT');
  enableOrDisableAdvancedToolsButtons();
  enableOrDisableAdvancedToolsButtons('OT');
  enableOrDisableVerbAndNounButtons();
  refreshClrGrammarCSS();
  if ((((c4[C_Greek][C_chkbxPassiveUlColr1Value]) && (c4[C_Greek][C_chkbxPassiveUlColr2Value])) ||
      ((c4[C_Greek][C_chkbxMiddleUlColr1Value]) && (c4[C_Greek][C_chkbxMiddleUlColr2Value]))) &&
    (cgv[C_handleOfRequestedAnimation] === -1)) goAnimate(0);  //c4 is currentClrCodeConfig.  It is changed to c4 to save space
  window.localStorage.setItem('colorCode-PreviousSettings', JSON.stringify(c4));
}
  
function openClrConfig() {
  if (typeof(Storage) !== 'undefined') {
    var openConfigPage = $('<div id="openClrModal" class="modal selectModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
      '<div class="modal-dialog"><div class="modal-content">');
    var temp = document.getElementById('openClrModal');
    if (!temp) openConfigPage.appendTo('body');
    $('#openClrModal').modal('show').find('.modal-content').load('/open_color_code_grammar.html');
  }
}

function initOpenClrCodeModal() {
  var s = $('<select id="openClrConfigDropdown"/>');
  s.append($('<option/>').html('Verb, Gender and Number'));
  s.append($('<option/>').html('Verb, Gender and Number, 2nd version'));
  s.append($('<option/>').html('Verb only (tense-mood)'));
  s.append($('<option/>').html('Verb with Middle and Passive Voices'));
  s.append($('<option/>').html('Verb, imperative mood'));
  s.append($('<option/>').html('Verb, main vs supporting verbs'));
  s.append($('<option/>').html('Gender and Number'));
  var tmp = window.localStorage.getItem('colorCode-UserClrConfigNames');
  if (tmp) {
    var UserClrConfigNames = JSON.parse(tmp);
    for (var i in UserClrConfigNames) {
      s.append($('<option/>').html(UserClrConfigNames[i]));
    }
  }
  $('#openClrModalSelectArea').append(s);
}

function initSortVerbItem() {
  var r = getVariablesForVerbTable();
  var sortType = r[cgv[C_axisUserSelectedToSort].toLowerCase() + 'AxisTitle'];
  var moodOrTense = sortType.substr(0,sortType.length - 1);
  var nameOfAllItems = r['nameOfAll' + cgv[C_axisUserSelectedToSort] + 'AxisItems'];
  var itemsToCombineWithPrevious = (sortType.substr(0, sortType.length -1) == 'mood') ? c4[C_Greek][C_moodToCombineWithPrevious] : c4[C_Greek][C_tenseToCombineWithPrevious];
  var axisName, otherAxisName;
  if (cgv[C_axisUserSelectedToSort] == 'X') {
    axisName = 'horizontal';
    otherAxisName = 'vertical';
  }
  else {
    axisName = 'vertical';
    otherAxisName = 'horizontal';
  }
  var s = '<p class="col-12">The ' + sortType + ' are currently in the ' + axisName + ' axis.</p>' +
    '<button id="swapAxisBtn" class="btn btn-default btn-sm icon-not-highlighted" type="button" title="Swap" onclick="userSwapAxis()">' +
    '<p class="col-10">Swap the ' + sortType + ' from the ' + axisName + ' to the ' + otherAxisName + ' axis.</p>' +
    '</button><br><br>';
  s += '<p class="col-12">The ' + sortType + ' are listed in the currently selected order.<br>' +
    'Click and drag a ' + moodOrTense + ' to can change the order of the ' + sortType + '.<br>' +
    'Drag a ' + moodOrTense + ' on top on another to group them to the same color configuration.<br>' +
    'When you are finished, click on "Save" at the bottom.<br>' +
    '<div id="nestedVerbItem" class="list-group col nested-sortable">';
  var skipDiv = false;
  for (var i = 0; i < nameOfAllItems.length; i++) {
    s += '<div class="list-group-item nested-1">' + upCaseFirst(nameOfAllItems[i]) +
    '<div class="list-group nested-sortable">';
    if ((i >= nameOfAllItems.length - 1) || (!itemsToCombineWithPrevious[i + 1])) {
      s += '</div></div>';
      if (skipDiv) {
        s += '</div></div>';
        skipDiv = false;
      }
    }
    else {
      if (skipDiv) {
        s += '</div></div>';
      }
      skipDiv = true;
    }
  }
  s += '</div>';
  $('#sortVerbItemArea').append($(s));

  var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));

  for (var j = 0; j < nestedSortables.length; j++) {
    new Sortable(nestedSortables[j], {
      group: 'nested',
      animation: 150,
      onEnd: function(/**Event*/evt) {
        cgv[C_userProvidedSortOrder] = [];
        for (var j = 0; j < $('#nestedVerbItem')[0].children.length; j ++) {
          cgv[C_userProvidedSortOrder].push($('#nestedVerbItem')[0].children[j].innerText);
        }
      }
    });
  }
}

function initAddHeaderInfo() {
  var arrayDesc = [];
  var testament = $('#uahi_testament')[0].innerHTML;
  var axis = $('#uahi_axis')[0].innerHTML;
  if (testament == 'ot') {
    var r = getVariablesForOTVerbTable('H');
    if (axis == 'X') {
      var r2 = getVariablesForOTVerbTable('A');
      for (var i = 0; i < r.descOfXAxisItems.length; i ++) {
        var aramaicStems = (r2.descOfXAxisItems[i].length > 0) ? r2.descOfXAxisItems[i].replace(/^/, "(").replace(/$/, ")") : '';
        arrayDesc.push(r.descOfXAxisItems[i] + '<br>' + aramaicStems.replace(/<br>/g, ")<br>("));
      }
    }
    else arrayDesc = getVariablesForOTVerbTable('H').descOfYAxisItems;
  }
  else {
    arrayDesc = getVariablesForVerbTable()['descOf' + axis + 'AxisItems'];
  }
  var c4Ref = (testament == 'nt') ? c4[C_Greek]: c4[C_OT];
  var temp2 = (axis == 'X') ? c4Ref[C_verbTableXHeader] : c4Ref[C_verbTableYHeader];
  var previousHeader = JSON.parse(JSON.stringify(temp2)); // Quick way to make a copy of the object
  (axis == 'X') ? c4Ref.verbTableXHeader = null : c4Ref.verbTableYHeader = null;
  updtLocalStorage(); // If user does not save, the previous header should not be re-use so clear it.
  var prevHdrArray = [];
  if (previousHeader != null) {
    for (var j = 0; j < previousHeader.desc.length; j ++) {
      for (var k = 0; k <= previousHeader.repeat[j]; k++) {
        prevHdrArray.push(previousHeader.desc[j]);
      }
    }
  }
  for (var l = 0; l < 25; l ++) { // add some extra blank items so that the input fields will not show "undefined"
    prevHdrArray.push('');
  }
  var s = '<p class="col-12">Enter the additional header information for the ' + axis + ' axis.</p><br>' +
    '<span id="uahi_num_of_input" style="visibility:hidden">' + arrayDesc.length + '</span>' +
    '<form>';
  for (var cc = 0; cc < arrayDesc.length; cc ++) {
    var text = arrayDesc[cc].replace(/<br>/g, ", ");
    s += text + '<br><input id="uahi_input' + cc + '" type="text" value="' + prevHdrArray[cc] + '"><br>';
  }
  s += '</form>';
  $('#addHeaderInfoArea').append($(s));
}

function saveHeaderInfo() {
  var testament = $('#uahi_testament')[0].innerHTML;
  var axis = $('#uahi_axis')[0].innerHTML;
  var numOfInput = $('#uahi_num_of_input')[0].innerHTML;
  var newHeader = {desc: [], repeat: []};
  var hdrNum = 0;
  for (var j = 0; j < numOfInput; j ++) {
    var text = $('#uahi_input' + j)[0].value;
    if ((hdrNum > 0) && (newHeader.desc[(hdrNum-1)] == text))
    newHeader.repeat[(hdrNum-1)] ++;
    else {
      newHeader.desc.push(text);
      newHeader.repeat.push(0);
      hdrNum ++;
    }
  }
  if (testament == 'ot') {
    (axis == 'X') ? c4[C_OT][C_verbTableXHeader] = newHeader : c4[C_OT][C_verbTableYHeader] = newHeader;
  }
  else {
    (axis == 'X') ? c4[C_Greek][C_verbTableXHeader] = newHeader : c4[C_Greek][C_verbTableYHeader] = newHeader;
  }
  updtLocalStorage();
  $('#addHeaderInfoModal .close').click();
  var element = document.getElementById('addHeaderInfoModal');
  element.parentNode.removeChild(element);
  $('#sortAxisModal .close').click();
  updateAllSettingsAndInputFields();
}

function initSortOTVerbItem() {
  var r1 = getVariablesForOTVerbTable('H');
  var r2 = getVariablesForOTVerbTable('A');
  var sortType = r1[cgv[C_axisUserSelectedToSort].toLowerCase() + 'AxisTitle'];
  var stemOrForm = sortType.substr(0,sortType.length - 1);

  var itemsToCombineWithPrevious = []; var nameOfAllItems = [];
  if (cgv[C_axisUserSelectedToSort] == 'X') {
    var nameOfAllHebrewItems = r1['nameOfAll' + cgv[C_axisUserSelectedToSort] + 'AxisItems'];
    var nameOfAllAramaicItems = r2['nameOfAll' + cgv[C_axisUserSelectedToSort] + 'AxisItems'];
    var aramaicStemIndex = 0;
    for (var i = 0; i < nameOfAllHebrewItems.length; i ++) {
      var noStemForThisGroupYet = true;
      if (nameOfAllHebrewItems[i] != '') {
        nameOfAllItems.push(nameOfAllHebrewItems[i]);
        itemsToCombineWithPrevious.push(c4[C_OT][C_hebrewStemToCombineWithPrevious][i]);
        noStemForThisGroupYet = false;
      }
      if ((i == (nameOfAllHebrewItems.length - 1)) || (!c4[C_OT][C_hebrewStemToCombineWithPrevious][i+1])) {
        do {
          if (nameOfAllAramaicItems[aramaicStemIndex] != '') {
            nameOfAllItems.push('(' + nameOfAllAramaicItems[aramaicStemIndex] + ')');
            itemsToCombineWithPrevious.push(!noStemForThisGroupYet);
            noStemForThisGroupYet = false;
          }
          aramaicStemIndex ++;
        } while ((aramaicStemIndex < nameOfAllAramaicItems.length) && (c4[C_OT][C_aramaicStemToCombineWithPrevious][aramaicStemIndex]));
      }
    }
  }
  else {
    nameOfAllItems = r1['nameOfAll' + cgv[C_axisUserSelectedToSort] + 'AxisItems'];
    itemsToCombineWithPrevious = c4[C_OT][C_verbFormToCombineWithPrevious];
  }
  var s = '<p class="col-12">Click and drag a ' + stemOrForm + ' to can change the order of the ' + sortType + '.<br>' +
    'Drag a ' + stemOrForm + ' on top on another to group them to the same color configuration.<br>';
  if (stemOrForm == 'stem') s += 'Aramaic stems are in parentheses (round brackets).<br>';
  s += 'When you are finished, click on "Save" at the bottom.<br>' +
    '<div id="nestedVerbItem" class="list-group col nested-sortable">';
  var skipDiv = false, voice;
  for (var cc = 0; cc < nameOfAllItems.length; cc++) {
    var displayInTitle = '', activeSelected = '', passiveSelected = '', middleSelected = '', languageCode = '';
    var nameOfCurrentItem =  nameOfAllItems[cc];
    var upperCaseName = upCaseFirst(nameOfCurrentItem);
    if (cgv[C_axisUserSelectedToSort] == 'X') {
      if (nameOfAllItems[cc].charAt(0) == '(') {
        languageCode = 'A';
        nameOfCurrentItem = nameOfAllItems[cc].substr(1, (nameOfAllItems[cc].length - 2));
        upperCaseName = '(' + upperCaseName.charAt(1).toUpperCase() + upperCaseName.slice(2);
        voice = c4[C_OT][C_aramaicCodeOfStem][cgc[C_aramaicNameOfStem][nameOfCurrentItem]][1];
        displayInTitle = (c4[C_OT][C_aramaicCodeOfStem][cgc[C_aramaicNameOfStem][nameOfCurrentItem]][2] === true) ? ' checked' : '';
      }
      else {
        languageCode = 'H';
        nameOfCurrentItem = nameOfAllItems[cc];
        voice = c4[C_OT][C_hebrewCodeOfStem][cgc[C_hebrewNameOfStem][nameOfCurrentItem]][1];
        displayInTitle = (c4[C_OT][C_hebrewCodeOfStem][cgc[C_hebrewNameOfStem][nameOfCurrentItem]][2] === true) ? ' checked' : '';
      }
      if (voice == 'a') activeSelected = ' selected';
      else if (voice == 'p') passiveSelected = ' selected';
      else if (voice == 'm') middleSelected = ' selected';
    }
    else {
      upperCaseName = c4[C_OT][C_codeOfForm][cgc[C_otNameOfVerbForm][nameOfCurrentItem]][1];
      displayInTitle = (c4[C_OT][C_codeOfForm][cgc[C_otNameOfVerbForm][nameOfCurrentItem]][2] === true) ? ' checked' : '';
    }
    s += '<div class="list-group-item nested-1">' + upperCaseName + ' - ' +
      '<span>Show at title of colour config screen: </span>' +
      '<input id="sortCheckbox'  + languageCode + nameOfCurrentItem + '"type="checkbox"' + displayInTitle + '></input>';
    if (cgv[C_axisUserSelectedToSort] == 'X')
      s += '<span>&nbsp;Voice:&nbsp;</span><select id="sortSelect' + languageCode + nameOfCurrentItem + '"><option value="a"' + activeSelected + '>Active</option><option value="p"' + passiveSelected + '>Passive</option><option value="m"' + middleSelected + '>Middle</option></select>';
    s += '<div class="list-group nested-sortable">';
    if ((cc >= nameOfAllItems.length - 1) || (!itemsToCombineWithPrevious[cc + 1])) {
      s += '</div></div>';
      if (skipDiv) {
        s += '</div></div>';
        skipDiv = false;
      }
    }
    else {
      if (skipDiv) {
        s += '</div></div>';
      }
      skipDiv = true;
    }
  }
  s += '</div>';
  $('#sortVerbItemArea').append($(s));

  var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));

  for (var cc2 = 0; cc2 < nestedSortables.length; cc2++) {
    new Sortable(nestedSortables[cc2], {
      group: 'nested',
      animation: 150,
      onEnd: function(/**Event*/evt) {
        cgv[C_userProvidedSortOrder] = [];
        for (var cc3 = 0; cc3 < $('#nestedVerbItem')[0].children.length; cc3 ++) {
          cgv[C_userProvidedSortOrder].push($('#nestedVerbItem')[0].children[cc3].innerText);
        }
      }
    });
  }
}

function resetSortOrder() {
  $('#sortAxisModal .close').click();
  var element = document.getElementById('sortAxisModal');
  element.parentNode.removeChild(element);
  userSortAxis(cgv[C_axisUserSelectedToSort]);
}

function resetSortOTOrder() {
  $('#sortAxisModal .close').click();
  var element = document.getElementById('sortAxisModal');
  element.parentNode.removeChild(element);
  userSortOTAxis(cgv[C_axisUserSelectedToSort]);
}

function saveSortOrder() {
  var currentItem, sortType, orderOfUserProvidedItems = [], itemsToCombineWithPrevious = [false, false, false, false, false, false];
  var j = 0;
  if (cgv[C_axisUserSelectedToSort] == 'X') sortType = getVariablesForVerbTable().xAxisTitle;
  else sortType = getVariablesForVerbTable().yAxisTitle;
  if (cgv[C_userProvidedSortOrder].length > 0) {
    for (var i = 0; i < cgv[C_userProvidedSortOrder].length; i ++) {
      var verbItem = cgv[C_userProvidedSortOrder][i].toLowerCase().replace(/\r\n/g, "\n").replace(/\n\n/g, "\n"); // IE would have \r\n\r\n instead of \n.  The two replace will handle either 1 or 2 \r\n
      while (verbItem.length > 0) {
        var indexOfLineBreak = verbItem.indexOf('\n');
        if (indexOfLineBreak == -1) {
          currentItem = verbItem;
          verbItem = '';
        }
        else {
          currentItem = verbItem.substr(0, indexOfLineBreak).toLowerCase();
          verbItem = verbItem.substr(indexOfLineBreak + 1);
          if (verbItem.length > 0) itemsToCombineWithPrevious[j+1] = true; // Edge can add an extra \n to the end.
        }
        if (sortType == 'moods') orderOfUserProvidedItems[j] = cgc[C_robinsonNameOfMood][currentItem];
        else orderOfUserProvidedItems[j] = cgc[C_robinsonNameOfTense][currentItem];
        j++;
      }
    }
    if (sortType == 'moods') {
      c4[C_Greek][C_orderOfMood] = orderOfUserProvidedItems;
      c4[C_Greek][C_moodToCombineWithPrevious] = itemsToCombineWithPrevious;
    }
    else {
      c4[C_Greek][C_orderOfTense] = orderOfUserProvidedItems;
      c4[C_Greek][C_tenseToCombineWithPrevious] = itemsToCombineWithPrevious;
    }
    updtLocalStorage();
    if (confirm('Do you want to edit the optional header information for the verb ' + sortType + '?'))
      userAddHeaderInfo(cgv[C_axisUserSelectedToSort]);
    else {
      if (cgv[C_axisUserSelectedToSort] == 'X') c4[C_Greek][C_verbTableXHeader] = null;
      else c4[C_Greek][C_verbTableYHeader] = null;
      updtLocalStorage();
    }
  }
  $('#sortAxisModal .close').click();
  var element = document.getElementById('sortAxisModal');
  element.parentNode.removeChild(element);
  updateAllSettingsAndInputFields();
}

function saveSortOTOrder() {
  var sortType, previousString, currentStemCode, currentStem, verbItem;
  if (cgv[C_axisUserSelectedToSort] == 'X')
    sortType = getVariablesForOTVerbTable('H').xAxisTitle;
  else
    sortType = getVariablesForOTVerbTable('H').yAxisTitle;
  if (sortType == 'stems') {
    if (cgv[C_userProvidedSortOrder].length > 0) {
      c4[C_OT][C_orderOfHebrewStem] = [];
      c4[C_OT][C_hebrewStemToCombineWithPrevious] = [];
      c4[C_OT][C_orderOfAramaicStem] = [];
      c4[C_OT][C_aramaicStemToCombineWithPrevious] = [];
      for (var i = 0; i < cgv[C_userProvidedSortOrder].length; i ++) {
        verbItem = cgv[C_userProvidedSortOrder][i].toLowerCase().replace(/\r\n/g, "\n").replace(/\n\n/g, "\n"); // IE would have \r\n\r\n instead of \n.  The two replace will handle either 1 or 2 \r\n
        verbItem = '\n' + verbItem.replace(/(active|passive|middle)\n?/g, "").replace(/\s-\sshow\sat\stitle\sof\scolour\sconfig\sscreen:\s+voice:/g, "").replace(/\s+/g, "\n");
        var updatedString = verbItem;
        do {
          previousString = updatedString;
          updatedString = updatedString.replace(/\n\([a-z]+\)\n/g, "\n"); // loop is requried because the global replace will not include the newly replaced "\n"
        } while (previousString != updatedString);
        var hebrewStemsInThisGroup = updatedString.replace(/^\n/, "").replace(/\n$/, "").replace(/\s+/g, " ").split(' ');
        updatedString = verbItem;
        do {
          previousString = updatedString;
          updatedString = updatedString.replace(/\n[a-z]+\n/g, "\n"); // loop is requried because the global replace will not include the newly replaced "\n"
        } while (previousString != updatedString);
        var aramaicStemsInThisGroup = updatedString.replace(/^\n/, "").replace(/\n$/, "").replace(/\s+/g, " ").replace(/[()]/g, "").split(' ');
        for (var j = 0; j < hebrewStemsInThisGroup.length; j++) {
          c4[C_OT][C_orderOfHebrewStem].push( cgc[C_hebrewNameOfStem][hebrewStemsInThisGroup[j]] );
          c4[C_OT][C_hebrewStemToCombineWithPrevious].push( (j > 0) );
        }
        for (var k = 0; k < aramaicStemsInThisGroup.length; k++) {
          c4[C_OT][C_orderOfAramaicStem].push( cgc[C_aramaicNameOfStem][aramaicStemsInThisGroup[k]] );
          c4[C_OT][C_aramaicStemToCombineWithPrevious].push( (k > 0) );
        }
      }
    }
    for (var cc2 = 0; cc2 < c4[C_OT][C_orderOfHebrewStem].length; cc2++) {
      currentStemCode = c4[C_OT][C_orderOfHebrewStem][cc2];
      if (currentStemCode != undefined) {
        currentStem = c4[C_OT][C_hebrewCodeOfStem][currentStemCode][0];
        if (currentStem != '') {
          c4[C_OT][C_hebrewCodeOfStem][currentStemCode][1] = $('#sortSelectH' + currentStem + ' option:selected')[0].value;
          c4[C_OT][C_hebrewCodeOfStem][currentStemCode][2] = $('#sortCheckboxH' + currentStem)[0].checked;
        }
      }
    }
    for (var cc = 0; cc < c4[C_OT][C_orderOfAramaicStem].length; cc++) {
      currentStemCode = c4[C_OT][C_orderOfAramaicStem][cc];
      if (currentStemCode != undefined) {
        currentStem = c4[C_OT][C_aramaicCodeOfStem][currentStemCode][0];
        if (currentStem != '') {
          c4[C_OT][C_aramaicCodeOfStem][currentStemCode][1] = $('#sortSelectA' + currentStem + ' option:selected')[0].value;
          c4[C_OT][C_aramaicCodeOfStem][currentStemCode][2] = $('#sortCheckboxA' + currentStem)[0].checked;
        }
      }
    }
  }
  else {
    if (cgv[C_userProvidedSortOrder].length > 0) {
      c4[C_OT][C_orderOfForm] = [];
      c4[C_OT][C_verbFormToCombineWithPrevious] = [];
      for (var cc6 = 0; cc6 < cgv[C_userProvidedSortOrder].length; cc6 ++) {
        verbItem = cgv[C_userProvidedSortOrder][cc6].replace(/\r\n/g, "\n").replace(/\n\n/g, "\n"); // IE would have \r\n\r\n instead of \n.  The two replace will handle either 1 or 2 \r\n
        verbItem = '\n' + verbItem.replace(/\s-\sShow\sat\stitle\sof\scolour\sconfig\sscreen:\s/g, "").replace(/\s+/g, "\n");
        var formsInThisGroup = verbItem.replace(/^\n/, "").replace(/\n$/, "").replace(/\s+/g, " ").replace(/[()]/g, "").split(' ');
        for (var cc5 = 0; cc5 < formsInThisGroup.length; cc5++) {
          var result = _.find(c4[C_OT][C_codeOfForm], function(obj) { return obj[1] == formsInThisGroup[cc5]; });
          c4[C_OT][C_orderOfForm].push( cgc[C_otNameOfVerbForm][result[0]] );
          c4[C_OT][C_verbFormToCombineWithPrevious].push( (cc5 > 0) );
        }
      }
    }
    for (var cc3 = 0; cc3 < c4[C_OT][C_orderOfForm].length; cc3++) {
      var currentFormCode = c4[C_OT][C_orderOfForm][cc3];
      if (currentFormCode != undefined) {
        var currentForm = c4[C_OT][C_codeOfForm][currentFormCode][0];
        if (currentForm != '')
          c4[C_OT][C_codeOfForm][currentFormCode][2] = $('#sortCheckbox' + currentForm)[0].checked;
      }
    }
  }
  updtLocalStorage();
  if (confirm('Do you want to edit the optional header information for the verb ' + sortType + '?'))
    userAddHeaderInfo(cgv[C_axisUserSelectedToSort], 'OT');
  else {
    if (cgv[C_axisUserSelectedToSort] == 'X') c4[C_OT][C_verbTableXHeader] = null;
    else c4[C_OT][C_verbTableYHeader] = null;
    updtLocalStorage();
  }
  $('#sortAxisModal .close').click();
  var element = document.getElementById('sortAxisModal');
  element.parentNode.removeChild(element);
  updateAllSettingsAndInputFields();
}

function saveClrConfig() {
  if (typeof(Storage) !== 'undefined') {
    var saveConfigPage = $('<div id="saveClrModal" class="modal selectModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
      '<div class="modal-dialog"><div class="modal-content">');
    var temp = document.getElementById('saveClrModal');
    if (!temp) {
      saveConfigPage.appendTo('body');
    }
    $('#saveClrModal').modal('show').find('.modal-content').load('/save_color_code_grammar.html');
  }
}

function initSaveClrCodeModal() {
  var tmp = window.localStorage.getItem('colorCode-UserClrConfigNames');
  if (tmp) {
    $('#saveClrModalPromptForDropdownList').show();
    var s = $('<select id="saveClrConfigDropdown"/>');
    var UserClrConfigNames = JSON.parse(tmp);
    s.append($('<option/>').html(''));
    for (var i in UserClrConfigNames) {
      s.append($('<option/>').html(UserClrConfigNames[i]));
    }
    $('#saveClrModalSelectArea').append(s);
  } else $('#saveClrModalPromptForDropdownList').hide();
}

function saveUserClrConfig() {
  var UserClrConfigNames = [];
  var inTxt = document.getElementById('saveClrModalInputArea').value.trim();
  var selectedConfig = document.getElementById('saveClrConfigDropdown');
  if (selectedConfig) selectedConfig = selectedConfig.value.trim();
  var tmp = window.localStorage.getItem('colorCode-UserClrConfigNames');
  if (inTxt === '') {
    if (!tmp) {
      alert('Please enter a name for your color configuration before using the "Save" button.');
      return;
    } else if (selectedConfig === '') {
      alert('Please enter or select a name for your color configuration before using the "Save" button.');
      return;
    } else inTxt = selectedConfig;
  } else {
    if (tmp) {
      UserClrConfigNames = JSON.parse(tmp);
      for (var i = 0; i < UserClrConfigNames.length; i += 1) {
        if (UserClrConfigNames[i] === inTxt) {
          alert('The name you entered is already used.  If you want to save the configuration to the same name, select the name from the dropdown list instead of using the text in field.');
          return;
        }
      }
    }
    UserClrConfigNames.push(inTxt);
    window.localStorage.setItem('colorCode-UserClrConfigNames', JSON.stringify(UserClrConfigNames));
  }
  window.localStorage.setItem('colorCode-UserClrConfigName-' + inTxt, JSON.stringify(c4));
  $('#saveClrModal .close').click();
  var element = document.getElementById('saveClrModal');
  element.parentNode.removeChild(element);
}

function addNounTable() {
  var htmlTable = '<table class="tg2">' +
    '<tr>' +
        '<th valign="middle" align="center" colspan="2" rowspan="2">' +
        '<div class="onoffswitch">' +
        '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="gennumonoffswitch" onchange=\'userToggleClrGrammar("gennum")\'/>' +
        '<label class="onoffswitch-label" for="gennumonoffswitch">' +
        '<span class="onoffswitch-inner"></span>' +
        '<span class="onoffswitch-switch"></span>' +
        '</label>' +
        '</div>' +
        '</th>' +
        '<th class="tg-amwm2" colspan="4">Gender</th>' +
    '</tr><tr>' +
        '<td class="tg-yw4l">Masculine:<br>' +
        '<input id="inClrMasculine" type="color" class="nInptC" value="' + c4[C_inClrMasculine] + '"/>' +
        '</td>' +
        '<td class="tg-yw4l">Feminine:<br>' +
        '<input id="inClrFeminine" type="color" class="nInptC" value="' + c4[C_inClrFeminine] + '"/>' +
        '</td>' +
        '<td class="tg-yw4l">Neuter:<br>' +
        '<input id="inClrNeuter" type="color" class="nInptC" value="' + c4[C_inClrNeuter] + '"/>' +
        '</td>' +
    '</tr><tr>' +
        '<td class="tg-e3zv2" rowspan="4">Number</td>' +
        '<td><span>Singular:</span><br><br>' +
            '<select id="slctUlSingular" class="nInptN" onchange=\'userUpdateNumber("singular", value)\'>' +
                '<option value="normal">Normal</option>' +
                '<option value="normal_italic">Normal and Italic</option>' +
                '<option value="bold">Bold</option>' +
                '<option value="bold_italic">Bold and Italic</option>' +
            '</select><br>' +
        '</td>' +
        '<td><span class="sing mas">Masculine singular</span><br>' +
        '</td>' +
        '<td><span class="sing fem">Feminine singular</span><br>' +
        '</td>' +
        '<td><span class="sing neut">Neuter singular</span><br>' +
        '</td>' +
    '</tr><tr>' +
        '<td><span>Plural:</span><br><br>' +
            '<select id="slctUlPlural" class="nInptN" onchange=\'userUpdateNumber("plural", value)\'>' +
                '<option value="normal">Normal</option>' +
                '<option value="normal_italic">Normal and Italic</option>' +
                '<option value="bold">Bold</option>' +
                '<option value="bold_italic">Bold and Italic</option>' +
            '</select><br>' +
        '</td>' +
        '<td><span class="plur mas">Masculine Plural</span><br>' +
        '</td>' +
        '<td><span class="plur fem">Feminine Plural</span><br>' +
        '</td>' +
        '<td><span class="plur neut">Neuter Plural</span><br>' +
        '</td>' +
    '</tr>' +
    '</table>';
  htmlTable = $(htmlTable);
  htmlTable.appendTo('#nounClrs');
}

function addOtTitleToXAxis(descOfHebrewXAxisItems, descOfAramaicwXAxisItems, numOfRows, createUserInputs) {
  var htmlTable = '';
  var curXTitle = c4[C_OT][C_verbTableXHeader];
  if (curXTitle != null) {
      htmlTable += '<tr>';
      for (var i = 0; i < curXTitle.desc.length; i ++) {
        htmlTable += '<td class="tg-yw4l" align="center" colspan="' + (curXTitle.repeat[i] + 1) + '"';
        if (curXTitle.desc[i].length < 10) htmlTable += ' width=70';
        htmlTable += '>' + curXTitle.desc[i] + '</td>';
      }
      htmlTable += '</tr>';
  }
  htmlTable += '<tr>';
  var descOfXAxisItems = addCssToXAxisHeader(descOfHebrewXAxisItems, descOfAramaicwXAxisItems, numOfRows);
  for (var j = 0; j < descOfHebrewXAxisItems.length; j += 1) {
    htmlTable += '<td class="tg-yw4l">' + descOfXAxisItems[j];
    if (createUserInputs) htmlTable += htmlToAdd3(j, 'OT');
    htmlTable += '</td>';
  }
  htmlTable += '</tr>';
  return htmlTable;
}
  
function addCssToXAxisHeader(descOfHebrewXAxisItems, descOfAramaicwXAxisItems, numOfRows) {
  var result = [], voice;
  for (var c = 0; c < descOfHebrewXAxisItems.length; c++) {
    var hebrewStemsInThisGroup = descOfHebrewXAxisItems[c].replace(/<br>/g, " ").replace(/\s+/g, " ").split(' ');
    var aramaicStemsInThisGroup = descOfAramaicwXAxisItems[c].replace(/<br>/g, " ").replace(/\s+/g, " ").split(' ');
    result.push("");
    for (var i = 0; i < hebrewStemsInThisGroup.length; i++) {
      if (hebrewStemsInThisGroup[i] != '') {
        if (result[c].length > 0) result[c] += '<br>';
        voice = c4[C_OT][C_hebrewCodeOfStem][cgc[C_hebrewNameOfStem][hebrewStemsInThisGroup[i].toLowerCase()]][1];
        if (voice == 'p') {
            result[c] += '<span class="vot_R' + numOfRows + 'C' + ((c*3)+1) + '">' + hebrewStemsInThisGroup[i] + '</span>';
        }
        else if (voice == 'm') {
            result[c] += '<span class="vot_R' + numOfRows + 'C' + ((c*3)+2) + '">' + hebrewStemsInThisGroup[i] + '</span>';
        }
        else result[c] += hebrewStemsInThisGroup[i];
      }
    }
    for (var j = 0; j < aramaicStemsInThisGroup.length; j++) {
      if (aramaicStemsInThisGroup[j] != '') {
        if (result[c].length > 0) result[c] += '<br>';
        voice = c4[C_OT][C_aramaicCodeOfStem][cgc[C_aramaicNameOfStem][aramaicStemsInThisGroup[j].toLowerCase()]][1];
        if (voice == 'p') {
            result[c] += '<span class="vot_R' + numOfRows + 'C' + ((c*3)+1) + '">(' + aramaicStemsInThisGroup[j] + ')</span>';
        }
        else if (voice == 'm') {
            result[c] += '<span class="vot_R' + numOfRows + 'C' + ((c*3)+2) + '">(' + aramaicStemsInThisGroup[j] + ')</span>';
        }
        else result[c] += '(' + aramaicStemsInThisGroup[j] + ')';
      }
    }
  }
  return result;
}
  
function addOTVerbTable(createUserInputs, htmlElement) {
  var r = getVariablesForOTVerbTable('H');
  var xAxisItems, yAxisItems, descOfXAxisItems, descOfYAxisItems;
  if (createUserInputs) {
    xAxisItems = r.orderOfXAxisItems;
    yAxisItems = r.orderOfYAxisItems;
    descOfXAxisItems = r.descOfXAxisItems;
    descOfYAxisItems = r.descOfYAxisItems;
  }
  else {
    xAxisItems = r.nameOfAllXAxisItems;
    yAxisItems = r.nameOfAllYAxisItems;
    descOfXAxisItems = r.nameOfAllXAxisItems;
    descOfYAxisItems = r.nameOfAllYAxisItems;
  }
  var htmlTable = '';
  if (!createUserInputs) htmlTable = '<link href="css/color_code_grammar.css" rel="stylesheet" media="screen"/>';
  var yAxisSpan = tableAxisSpan('Y', createUserInputs, 'OT');
  htmlTable += '<table class="tg2"><tr><th valign="middle" align="center" colspan="' +
  yAxisSpan + '" rowspan="' + tableAxisSpan('X', createUserInputs, 'OT') + '">';
  if (createUserInputs) htmlTable += htmlToAdd1('OT');
  htmlTable += '</th><th class="tg-amwm2" colspan="' + xAxisItems.length + '">' + upCaseFirst(r.xAxisTitle);
  if (createUserInputs) htmlTable += htmlToAdd2(r.xAxisTitle, 'OT');
  htmlTable += '</th></tr>';
  htmlTable += addOtTitleToXAxis(descOfXAxisItems, getVariablesForOTVerbTable('A').descOfXAxisItems, yAxisItems.length, createUserInputs);
  htmlTable += '<tr>' +
  '<td class="tg-e3zv2" rowspan="' + yAxisItems.length + '">' + upCaseFirst(r.yAxisTitle);
  if (createUserInputs) htmlTable += htmlToAdd4(r.yAxisTitle, 'OT');
  htmlTable += '</td>';
  for (var i = 0; i < yAxisItems.length; i += 1) {
    if (i > 0) htmlTable += '<tr>';
    htmlTable += addTitleToYAxis(i, descOfYAxisItems[i], createUserInputs, yAxisSpan, 'OT');
    if (createUserInputs) htmlTable += htmlToAdd5(i, 'OT');
    htmlTable += '</td>';
    for (var counter = 0; counter < xAxisItems.length; counter += 1) {
      htmlTable += '<td>' + voicesInFormAndStem(counter, i) + '</td>';
    }
    htmlTable += '</tr>';
  }
  htmlTable += '</table><br>';
  if (createUserInputs) htmlTable += htmlToAdd6('OT');
  htmlTable = $(htmlTable);
  htmlTable.appendTo(htmlElement);
}
  
function voicesInFormAndStem(yAxisNum, xAxisNum) {
  yAxisNum = yAxisNum * 3;
  return '<span class="vot_' + cgv[C_ulOTVbCSS][xAxisNum][yAxisNum].name + '">active</span><br>' +
          '<span class="vot_' + cgv[C_ulOTVbCSS][xAxisNum][yAxisNum+1].name + '">passive</span><br>' +
          '<span class="vot_' + cgv[C_ulOTVbCSS][xAxisNum][yAxisNum+2].name + '">middle</span>';
}
  
function userUpdateYAxisItem(itemNumberOfYAxis, nameOfUnderline) {
  c4[C_Greek][C_slctUlVerbItem][itemNumberOfYAxis] = cgc[C_canvasUnderlineName][nameOfUnderline];
  updtLocalStorage();
  createUlForAllItemsInYAndX();
}
  
function userUpdateOTYAxisItem(itemNumberOfYAxis, nameOfUnderline) {
  c4[C_OT][C_slctUlVerbItem][itemNumberOfYAxis] = cgc[C_canvasUnderlineName][nameOfUnderline];
  updtLocalStorage();
  createUlForOTYAxis(itemNumberOfYAxis);
}

function userSwapAxis() {
  var tmp = c4[C_Greek][C_verbTableXHeader];
  c4[C_Greek][C_verbTableXHeader] = c4[C_Greek][C_verbTableYHeader];
  c4[C_Greek][C_verbTableYHeader] = tmp;
  c4[C_Greek][C_xAxisForMood] = !c4[C_Greek][C_xAxisForMood];
  updtLocalStorage();
  $('#sortAxisModal .close').click();
  var element = document.getElementById('sortAxisModal');
  element.parentNode.removeChild(element);
  updateAllSettingsAndInputFields();
}
  
function userSortAxis(axis) {
  cgv[C_axisUserSelectedToSort] = axis;
  var openConfigPage = $('<div id="sortAxisModal" class="modal selectModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
    '<div class="modal-dialog"><div class="modal-content">');
  var temp = document.getElementById('sortAxisModal');
  if (!temp) openConfigPage.appendTo('body');
  $('#sortAxisModal').modal('show').find('.modal-content').load('/sort_verb_item.html');
}

function userAddHeaderInfo(axis, ot) {
  var otPrefix = 'nt';
  if ((ot != undefined) && (ot == 'OT')) otPrefix = 'ot';
  $('#addHeaderInfoModal').remove();
  var openConfigPage = $('<div id="addHeaderInfoModal" class="modal selectModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
    '<span id="uahi_testament" style="visibility:hidden">' + otPrefix + '</span>' +
    '<span id="uahi_axis" style="visibility:hidden">' + axis + '</span>' +
    '<div class="modal-dialog"><div class="modal-content">');
  var temp = document.getElementById('addHeaderInfoModal');
  if (!temp) openConfigPage.appendTo('body');
  $('#addHeaderInfoModal').modal('show').find('.modal-content').load('/add_header_to_color_config.html');
}

function userSortOTAxis(axis) {
  cgv[C_axisUserSelectedToSort] = axis;
  var openConfigPage = $('<div id="sortAxisModal" class="modal selectModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
    '<div class="modal-dialog"><div class="modal-content">');
  var temp = document.getElementById('sortAxisModal');
  if (!temp) openConfigPage.appendTo('body');
  $('#sortAxisModal').modal('show').find('.modal-content').load('/sort_ot_verb_item.html');
}

function userToggleXOrYAxisConfig(ot, axis, index) {
  var otPrefix = '';
  if ((ot != undefined) && (ot == 'OT')) {
    otPrefix = 'OT';
    if (index == null) {
      if (axis == 'X') c4[C_OT][C_granularControlOfXAxis] = !c4[C_OT][C_granularControlOfXAxis];
      else c4[C_OT][C_granularControlOfYAxis] = !c4[C_OT][C_granularControlOfYAxis];
    }
    else {
      if (axis == 'X') c4[C_OT][C_xAxisOnOff][index] = !c4[C_OT][C_xAxisOnOff][index];
      else c4[C_OT][C_yAxisOnOff][index] = !c4[C_OT][C_yAxisOnOff][index];
    }
  }
  else {
    if ((c4[C_Greek][C_xAxisForMood] && axis == 'X') || (!c4[C_Greek][C_xAxisForMood] && axis == 'Y')) {
      if (index == null) c4[C_Greek][C_granularControlOfMoods] = !c4[C_Greek][C_granularControlOfMoods];
      else c4[C_Greek][C_moodsOnOff][index] = !c4[C_Greek][C_moodsOnOff][index];
    }
    else {
      if (index == null) c4[C_Greek][C_granularControlOfTenses] = !c4[C_Greek][C_granularControlOfTenses];
      else c4[C_Greek][C_tensesOnOff][index] = !c4[C_Greek][C_tensesOnOff][index];
    }
  }
  updtLocalStorage();
  enableOrDisableAxisConfigButtons(axis, otPrefix);
  refreshClrGrammarCSS();
}

function userToggleClrGrammar(grammarFunction) {
    var checkedValue;
    if (document.getElementById(grammarFunction + 'onoffswitch').checked) checkedValue = true;
    else checkedValue = false;
    if (grammarFunction === 'verb') {
      c4[C_Greek][C_enableVerbClr] = checkedValue;
      updtLocalStorage();
      updateVerbInputFields(checkedValue);
    }
    else if (grammarFunction === 'gennum') {
      updateNounInputFields(checkedValue);
      c4[C_enableGenderNumberClr] = checkedValue;
      updtLocalStorage();
      cgv[C_userTurnGenderNumberFromOffToOn] = checkedValue;
    }
    else if (grammarFunction === 'OTverb') {
      c4[C_OT][C_enableVerbClr] = checkedValue;
      updtLocalStorage();
      updateVerbInputFields(checkedValue, 'OT');
    }
    refreshClrGrammarCSS();
    if ((grammarFunction === 'verb') && (checkedValue) && (cgv[C_handleOfRequestedAnimation] === -1)) goAnimate(0);
}

function userUpdateClr(itemNumber, color) {
  c4[C_Greek][C_inClrVerbItem][itemNumber] = color;
  updtLocalStorage();
  createUlForAllItemsInYAndX();
}

function userUpdateOTClr(itemNumber, color) {
  c4[C_OT][C_inClrVerbItem][itemNumber] = color;
  updtLocalStorage();
  createUlForOT();
}

function userUpdateNounClr(gender, color) {
  if (gender == 'masculine') c4[C_inClrMasculine] = color;
  else if (gender == 'feminine') c4[C_inClrFeminine] = color;
  else if (gender == 'neuter') c4[C_inClrNeuter] = color;
  else alert('Error: userUpdateNounClr, cannot identify gender');
  updtLocalStorage();
  var cssName = '';
  if (gender === 'masculine') cssName = '.mas';
  else if (gender === 'feminine') cssName = '.fem';
  else if (gender === 'neuter') cssName = '.neut';
  $(cssName).css({
    'color': color
  });
  cgv[C_updatedGenderNumberCSS] = true;
}

function userUpdateNumber(type, fontHighlight) {
  if (type == 'singular') c4[C_slctUlSingular] = fontHighlight;
  else if (type == 'plural') c4[C_slctUlPlural] = fontHighlight;
  else alert('Error: userUpdateNumber, cannot identify number type');
  updtLocalStorage();
  updateCssForNumber(type, fontHighlight);
}

function userUpdateAnimation(itemNumber) {
    var arrayIndexOfCSSRelatedToItemSelected = [];
    var currentULForItem = c4[C_Greek][C_slctUlVerbItem][itemNumber];
    var tempIndexArray;
    if (c4[C_Greek][C_xAxisForMood]) tempIndexArray = cgc[C_tenseIndexArray];
    else tempIndexArray = cgc[C_moodIndexArray];
    var r = getVerbItemsCombinedWithCurrentItem('Y', itemNumber);
    for (var i = 0; i < r.nameOfItemCombinedWithCurrentItem.length; i ++) {
      arrayIndexOfCSSRelatedToItemSelected = arrayIndexOfCSSRelatedToItemSelected.concat(
        _.find(tempIndexArray, function(obj) { return obj.name == r.nameOfItemCombinedWithCurrentItem[i]; }).array );
    }
    var indexToUlVerbCSS;
    if ((document.getElementById('inAnimateCheckbox' + itemNumber).checked) &&
      (currentULForItem !== '2 lines') && (currentULForItem !== 'Underline')) {
      c4[C_Greek][C_inAnimate][itemNumber] = true;
      updtLocalStorage();
      for (var j = 0; j < arrayIndexOfCSSRelatedToItemSelected.length; j += 1) {
        indexToUlVerbCSS = arrayIndexOfCSSRelatedToItemSelected[j];
        if (cgv[C_animationIndexArray].indexOf(indexToUlVerbCSS) === -1) cgv[C_animationIndexArray].push(indexToUlVerbCSS);
      }
    } else {
      c4[C_Greek][C_inAnimate][itemNumber] = false;
      updtLocalStorage();
      for (var k = 0; k < arrayIndexOfCSSRelatedToItemSelected.length; k += 1) {
        indexToUlVerbCSS = arrayIndexOfCSSRelatedToItemSelected[k];
        var tempIdx = cgv[C_animationIndexArray].indexOf(indexToUlVerbCSS);
        if (indexToUlVerbCSS >= 0) cgv[C_animationIndexArray].splice(tempIdx, 1);
      }
    }
    cgv[C_copyOfPassiveIndexArray] = cgc[C_passiveIndexArray].slice(0);
    cgv[C_copyOfMiddleIndexArray] = cgc[C_middleIndexArray].slice(0);
    for (var counter = 0; counter < cgv[C_animationIndexArray].length; counter += 1) {
      var tempIndex1 = cgv[C_animationIndexArray][counter];
      var tempIndex2 = cgv[C_copyOfPassiveIndexArray].indexOf(tempIndex1);
      if (tempIndex2 >= 0) cgv[C_copyOfPassiveIndexArray].splice(tempIndex2, 1);
      tempIndex2 = cgv[C_copyOfMiddleIndexArray].indexOf(tempIndex1);
      if (tempIndex2 >= 0) cgv[C_copyOfMiddleIndexArray].splice(tempIndex2, 1);
    }
    if ((cgv[C_animationIndexArray].length > 0) && (cgv[C_handleOfRequestedAnimation] === -1))
      goAnimate(0);
}

function userUpdatePassiveMiddleVoiceBkgrd(voice, otVerb) {
  var otPrefix = ''; var c4Ref;
  if ((otVerb != undefined) && (otVerb != '')) {
    otPrefix = otVerb;
    c4Ref = c4[C_OT];
  }
  else c4Ref = c4[C_Greek];
  var ucVoice = upCaseFirst(voice);
  if (document.getElementById('chkbx' + otPrefix + ucVoice + 'BkgrdClr').checked) {
    (voice == 'passive') ? c4Ref[C_chkbxPassiveBkgrdColrValue] = true : c4Ref[C_chkbxMiddleBkgrdColrValue] = true;
    $('#in' + otPrefix + ucVoice + 'BkgrdClr').spectrum('enable');
  } else {
    (voice == 'passive') ? c4Ref[C_chkbxPassiveBkgrdColrValue] = false : c4Ref[C_chkbxMiddleBkgrdColrValue] = false;
    $('#in' + otPrefix + ucVoice + 'BkgrdClr').spectrum('disable');
  }
  updtLocalStorage();
  if (otVerb == 'OT') createUlForOT();
  else updateVerbsBkgrd(voice);
}

function userEnablePassiveMiddleVerbsUnderline1(voice, otVerb) {
  var otPrefix = '', c4Ref, checkedValue;
  if ((otVerb != undefined) && (otVerb != '')) {
    otPrefix = otVerb;
    c4Ref = c4[C_OT];
  }
  else c4Ref = c4[C_Greek];
  var ucVoice = upCaseFirst(voice);
  if (document.getElementById('chkbx' + otPrefix + ucVoice + 'UlClr1').checked) {
    checkedValue = true;
    $('#in' + otPrefix + ucVoice + 'UlClr1').spectrum('enable');
    $('#chkbx' + otPrefix + ucVoice + 'UlClr2').show();
    $('#chkbx' + otPrefix + ucVoice + 'UlClr2').prop('disabled', false);
    userEnablePassiveMiddleVerbsUnderline2(voice, otVerb);
  } else {
    checkedValue = false;
    $('#in' + otPrefix + ucVoice + 'UlClr1').spectrum('disable');
    $('#in' + otPrefix + ucVoice + 'UlClr1').hide();
    $('#chkbx' + otPrefix + ucVoice + 'UlClr2').hide();
    $('#chkbx' + otPrefix + ucVoice + 'UlClr2').prop('disabled', true);
    $('#in' + otPrefix + ucVoice + 'UlClr2').spectrum('disable');
  }
  if (voice == 'passive') {
    c4Ref[C_chkbxPassiveUlColr1Value] = checkedValue;
    if (otPrefix == '') c4Ref[C_chkbxPassiveUlClr2] = checkedValue;
  }
  else if (voice == 'middle') {
    c4Ref[C_chkbxMiddleUlColr1Value] = checkedValue;
    if (otPrefix == '') c4Ref[C_chkbxMiddleUlClr2] = checkedValue;
  }
  updtLocalStorage();
  if (otPrefix == 'OT') createUlForOT();
  else updateVerbsBkgrd(voice);
}

function userEnablePassiveMiddleVerbsUnderline2(voice, otVerb) {
  var otPrefix = '';
  if ((otVerb != undefined) && (otVerb != '')) return;
  var ucVoice = upCaseFirst(voice);
  if (document.getElementById('chkbx' + otPrefix + ucVoice + 'UlClr2').checked) {
    (voice == 'passive') ? c4[C_Greek][C_chkbxPassiveUlColr2Value] = true : c4[C_Greek][C_chkbxMiddleUlColr2Value] = true;
    updtLocalStorage();
    $('#in' + otPrefix + ucVoice + 'UlClr2').spectrum('enable');
    if (cgv[C_handleOfRequestedAnimation] === -1) goAnimate(0);
  } else {
    (voice == 'passive') ? c4[C_Greek][C_chkbxPassiveUlColr2Value] = false : c4[C_Greek][C_chkbxMiddleUlColr2Value] = false;
    updtLocalStorage();
    $('#in' + otPrefix + ucVoice + 'UlClr2').spectrum('disable');
  }
}

/*function userToggleAdvancedTools(ot) {
  var otPrefix = '';
  if ((ot != undefined) && (ot == 'OT')) otPrefix = 'OT';
  c4['enable' + otPrefix + 'AdvancedTools'] = !c4['enable' + otPrefix + 'AdvancedTools'];
  updtLocalStorage('enable' + otPrefix + 'AdvancedTools', c4['enable' + otPrefix + 'AdvancedTools']);
  enableOrDisableAdvancedToolsButtons(otPrefix);
  updateHtmlForYAxis();
}*/

function enableOrDisableVerbAndNounButtons() {
    var checkedValue = c4[C_Greek][C_enableVerbClr];
    $('#verbonoffswitch').prop('checked', checkedValue);
    updateVerbInputFields(checkedValue);
    checkedValue = c4[C_enableGenderNumberClr];
    $('#gennumonoffswitch').prop('checked', checkedValue);
    updateNounInputFields(checkedValue);
    checkedValue = c4[C_OT][C_enableVerbClr];
    updateVerbInputFields(checkedValue, 'OT');
    $('#OTverbonoffswitch').prop('checked', checkedValue);
}

function enableOrDisableAxisConfigButtons(axis, ot) {
  var otPrefix = '', granularControlOfAxis, itemInAxisOnOff, ulVerbCSSArrayOfAxis, itemToCombineWithPrevious;
  if ((ot != undefined) && (ot == 'OT')) otPrefix = 'OT';
  var iconName = '#' + otPrefix + 'config' + axis + 'AxisIcon';
  var onOffClassName = '.' + otPrefix + 'vrbInpt' + axis;
  var onOffCheckBox = otPrefix + 'axis' + axis + 'OnOffCheckbox';
  if (otPrefix == '') {
    var r = getVariablesForVerbTable();
    var moodOrTense = r[axis.toLowerCase() + 'AxisTitle'];
    moodOrTense = moodOrTense.substr(0, moodOrTense.length - 1);
    var ucMoodOrTense = upCaseFirst(moodOrTense);
    var orderOfItemsInAxis = r['orderOf' + axis + 'AxisItems'];
    var nameOfAllItemsInAxis = r['nameOfAll' + axis + 'AxisItems'];
    if (moodOrTense == 'mood') {
      granularControlOfAxis = c4[C_Greek][C_granularControlOfMoods];
      itemInAxisOnOff = c4[C_Greek][C_moodsOnOff];
      ulVerbCSSArrayOfAxis = cgc[C_moodIndexArray];
      itemToCombineWithPrevious = c4[C_Greek][C_moodToCombineWithPrevious];
    }
    else {
      granularControlOfAxis = c4[C_Greek][C_granularControlOfTenses];
      itemInAxisOnOff = c4[C_Greek][C_tensesOnOff];
      ulVerbCSSArrayOfAxis = cgc[C_tenseIndexArray];
      itemToCombineWithPrevious = c4[C_Greek][C_tenseToCombineWithPrevious];
    }
    highlightIcon(iconName, granularControlOfAxis);
    hideIndividualInputField(onOffClassName, granularControlOfAxis);
    for (var i = 0; i < orderOfItemsInAxis.length; i += 1) {
      $('#' + onOffCheckBox + i).prop('checked', granularControlOfAxis && itemInAxisOnOff[i]);
    }
    if (granularControlOfAxis) {
      var k = -1;
      for (var cc = 0; cc < nameOfAllItemsInAxis.length; cc ++) {
        if (!itemToCombineWithPrevious[cc]) k++;
        var currentItemInAxisOnOff = itemInAxisOnOff[k];
        var index2 = _.find(ulVerbCSSArrayOfAxis, function(obj) { return obj.name == nameOfAllItemsInAxis[cc]; }).array;
        for (var j = 0; j < index2.length; j += 1) {
          cgv[C_ulVerbCSS][index2[j]]['displayStatusSelectedBy' + ucMoodOrTense] = currentItemInAxisOnOff;
        }
      }
    }
    else {
      for (var cc2 = 0; cc2 < cgv[C_ulVerbCSS].length; cc2 ++) {
        cgv[C_ulVerbCSS][cc2]['displayStatusSelectedBy' + ucMoodOrTense] = true;
      }
    }
  }
  else if (otPrefix == 'OT') {
    if (axis == 'X') {
      granularControlOfAxis = c4[C_OT][C_granularControlOfXAxis];
    }
    else {
      granularControlOfAxis = c4[C_OT][C_granularControlOfYAxis];
    }
    highlightIcon(iconName, granularControlOfAxis);
    hideIndividualInputField(onOffClassName, granularControlOfAxis);
    if (axis == 'Y')
      for (var cc3 = 0; cc3 < cgv[C_ulOTVbCSS].length; cc3 += 1) {
        $('#' + onOffCheckBox + cc3).prop('checked', granularControlOfAxis && c4[C_OT][C_yAxisOnOff][cc3]);
      }
    else if (axis == 'X') {
      for (var cc4 = 0; cc4 < cgv[C_ulOTVbCSS][0].length; cc4 += 1) {
        if ((cc4 % 3) == 0) $('#' + onOffCheckBox + (cc4/3)).prop('checked', granularControlOfAxis && c4[C_OT][C_xAxisOnOff][cc4/3]);
      }
    }
  }
}

function highlightIcon(idOrClass, highlight) {
  if (highlight) {
    $(idOrClass).removeClass('icon-not-highlighted');
    $(idOrClass).addClass('icon-highlighted');
  }
  else {
    $(idOrClass).removeClass('icon-highlighted');
    $(idOrClass).addClass('icon-not-highlighted');
  }
}

function enableOrDisableAdvancedToolsButtons(ot) {
  hideIndividualInputField('.' + ot + 'advancedtools', c4[C_enableAdvancedTools]);
}

function checkNounClr() {
    var currentClrPicker = $('#inClrMasculine').spectrum('get').toHexString();
    if (c4[C_inClrMasculine] != currentClrPicker)
      userUpdateNounClr('masculine', currentClrPicker);
    currentClrPicker = $('#inClrFeminine').spectrum('get').toHexString();
    if (c4[C_inClrFeminine] != currentClrPicker)
      userUpdateNounClr('feminine', currentClrPicker);
    currentClrPicker = $('#inClrNeuter').spectrum('get').toHexString();
    if (c4[C_inClrNeuter] != currentClrPicker)
      userUpdateNounClr('feminine', currentClrPicker);
}

function checkVerbClrInput() {
  var currentClr, currentClrPicker;
  for (var i = 0; i < getVariablesForVerbTable().orderOfXAxisItems.length; i ++) {
    currentClr = c4[C_Greek][C_inClrVerbItem][i];
    currentClrPicker = $('#inClrVerbItem' + i).spectrum("get").toHexString();
    if (currentClr != currentClrPicker) userUpdateClr(i, currentClrPicker);
  }
  for (var cc = 0; cc < getVariablesForOTVerbTable('H').orderOfXAxisItems.length; cc ++) {
    currentClr = c4[C_OT][C_inClrVerbItem][cc];
    currentClrPicker = $('#inClrOTVerbItem' + cc).spectrum("get").toHexString();
    if (currentClr != currentClrPicker) userUpdateOTClr(cc, currentClrPicker);
  }
  currentClr = c4[C_Greek][C_inMiddleBkgrdClr];
  currentClrPicker = $('#inMiddleBkgrdClr').spectrum("get").toHexString();
  var colorForMiddleWasUpdated = false;
  if (currentClr != currentClrPicker) {
    c4[C_Greek][C_inMiddleBkgrdClr] = currentClrPicker;
    updtLocalStorage();
    colorForMiddleWasUpdated = true;
  }
  currentClr = c4[C_Greek][C_inMiddleUlClr1];
  currentClrPicker = $('#inMiddleUlClr1').spectrum("get").toHexString();
  if (currentClr != currentClrPicker) {
    c4[C_Greek][C_inMiddleUlClr1] = currentClrPicker;
    updtLocalStorage();
    colorForMiddleWasUpdated = true;
  }
  currentClr = c4[C_Greek][C_inMiddleUlClr2];
  currentClrPicker = $('#inMiddleUlClr2').spectrum("get").toHexString();
  if (currentClr != currentClrPicker) {
    c4[C_Greek][C_inMiddleUlClr2] = currentClrPicker;
    updtLocalStorage();
    colorForMiddleWasUpdated = true;
  }
  if (colorForMiddleWasUpdated) updateVerbsBkgrd('middle');
  currentClr = c4[C_Greek][C_inPassiveBkgrdClr];
  currentClrPicker = $('#inPassiveBkgrdClr').spectrum("get").toHexString();
  var colorForPassiveWasUpdated = false;
  if (currentClr != currentClrPicker) {
    c4[C_Greek][C_inPassiveBkgrdClr] = currentClrPicker;
    updtLocalStorage();
    colorForPassiveWasUpdated = true;
  }
  currentClr = c4[C_Greek][C_inPassiveUlClr1];
  currentClrPicker = $('#inPassiveUlClr1').spectrum("get").toHexString();
  if (currentClr != currentClrPicker) {
    c4[C_Greek][C_inPassiveUlClr1] = currentClrPicker;
    updtLocalStorage();
    colorForPassiveWasUpdated = true;
  }
  currentClr = c4[C_Greek][C_inPassiveUlClr2];
  currentClrPicker = $('#inPassiveUlClr2').spectrum("get").toHexString();
  if (currentClr != currentClrPicker) {
    c4[C_Greek][C_inPassiveUlClr2] = currentClrPicker;
    updtLocalStorage();
    colorForPassiveWasUpdated = true;
  }
  if (colorForPassiveWasUpdated) updateVerbsBkgrd('passive');
  if (colorForMiddleWasUpdated) updateVerbsBkgrd('middle');

  currentClr = c4[C_OT][C_inMiddleBkgrdClr];
  currentClrPicker = $('#inOTMiddleBkgrdClr').spectrum("get").toHexString();
  var colorForOTWasUpdated = false;
  if (currentClr != currentClrPicker) {
    c4[C_OT][C_inMiddleBkgrdClr] = currentClrPicker;
    updtLocalStorage();
    colorForOTWasUpdated = true;
  }
  currentClr = c4[C_OT][C_inMiddleUlClr1];
  currentClrPicker = $('#inOTMiddleUlClr1').spectrum("get").toHexString();
  if (currentClr != currentClrPicker) {
    c4[C_OT][C_inMiddleUlClr1] = currentClrPicker;
    updtLocalStorage();
    colorForOTWasUpdated = true;
  }
  currentClr = c4[C_OT][C_inPassiveBkgrdClr];
  currentClrPicker = $('#inOTPassiveBkgrdClr').spectrum("get").toHexString();
  if (currentClr != currentClrPicker) {
    c4[C_OT][C_inPassiveBkgrdClr] = currentClrPicker;
    updtLocalStorage();
    colorForOTWasUpdated = true;
  }
  currentClr = c4[C_OT][C_inPassiveUlClr1];
  currentClrPicker = $('#inOTPassiveUlClr1').spectrum("get").toHexString();
  if (currentClr != currentClrPicker) {
    c4[C_OT][C_inPassiveUlClr1] = currentClrPicker;
    updtLocalStorage();
    colorForOTWasUpdated = true;
  }
  if (colorForOTWasUpdated) createUlForOT();
}

function updateHtmlForYAxis() {
  var currentULForItem;
  var numOfRows = getVariablesForVerbTable().nameOfYAxisItems.length;
  for (var i = 0; i < numOfRows; i += 1) {
    currentULForItem = c4[C_Greek][C_slctUlVerbItem][i];
    $('#slctUlVerbItem' + i + ' option')
      .filter(function() {
        return $.trim($(this).text()) == currentULForItem;
      })
      .prop('selected', true);
    var temp = ((currentULForItem !== '2 lines') && (currentULForItem !== 'Underline') && (c4[C_enableAdvancedTools]) );
    hideIndividualInputField('#inAnimate' + i, temp);
    hideIndividualInputField('#inAnimateCheckbox' + i, temp);
    if ((c4[C_Greek][C_inAnimate][i]) && (c4[C_enableAdvancedTools])) {
      document.getElementById('inAnimateCheckbox' + i).checked = true;
      if ((currentULForItem !== '2 lines') && (currentULForItem !== 'Underline'))
        userUpdateAnimation(i);
    } else document.getElementById('inAnimateCheckbox' + i).checked = false;
  }
  numOfRows = getVariablesForOTVerbTable('H').nameOfYAxisItems.length;
  for (var cc = 0; cc < numOfRows; cc += 1) {
    currentULForItem = c4[C_OT][C_slctUlVerbItem][cc];
    $('#slctUlOTVerbItem' + cc + ' option')
      .filter(function() {
        return $.trim($(this).text()) == currentULForItem;
      })
      .prop('selected', true);
  }
}

function updateHtmlForXAxis() {
  var numOfColumns = getVariablesForVerbTable().orderOfXAxisItems.length;
  if (numOfColumns > -1)
    $('#inClrVerbItem0').spectrum({
      color: c4[C_Greek][C_inClrVerbItem][0],
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateClr(0, color.toHexString());
      },
      show: function(color) {
        checkVerbClrInput();
      }
    });
  if (numOfColumns > 0)
    $('#inClrVerbItem1').spectrum({
      color: c4[C_Greek][C_inClrVerbItem][1],
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateClr(1, color.toHexString());
      },
      show: function(color) {
        checkVerbClrInput();
      }
    });
  if (numOfColumns > 1)
    $('#inClrVerbItem2').spectrum({
      color: c4[C_Greek][C_inClrVerbItem][2],
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateClr(2, color.toHexString());
      },
      show: function(color) {
        checkVerbClrInput();
      }
    });
  if (numOfColumns > 2)
    $('#inClrVerbItem3').spectrum({
      color: c4[C_Greek][C_inClrVerbItem][3],
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateClr(3, color.toHexString());
      },
      show: function(color) {
        checkVerbClrInput();
      }
    });
  if (numOfColumns > 3)
    $('#inClrVerbItem4').spectrum({
      color: c4[C_Greek][C_inClrVerbItem][4],
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateClr(4, color.toHexString());
      },
      show: function(color) {
        checkVerbClrInput();
      }
    });
  if (numOfColumns > 4)
    $('#inClrVerbItem5').spectrum({
      color: c4[C_Greek][C_inClrVerbItem][5],
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateClr(5, color.toHexString());
      },
      show: function(color) {
        checkVerbClrInput();
      }
    });
  numOfColumns = getVariablesForOTVerbTable('H').orderOfXAxisItems.length;
  if (numOfColumns > -1)
    $('#inClrOTVerbItem0').spectrum({
      color: c4[C_OT][C_inClrVerbItem][0],
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateOTClr(0, color.toHexString());
      },
      show: function(color) {
        checkVerbClrInput('OT');
      }
    });
  if (numOfColumns > 0)
    $('#inClrOTVerbItem1').spectrum({
      color: c4[C_OT][C_inClrVerbItem][1],
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateOTClr(1, color.toHexString());
      },
      show: function(color) {
        checkVerbClrInput('OT');
      }
    });
  if (numOfColumns > 1)
    $('#inClrOTVerbItem2').spectrum({
      color: c4[C_OT][C_inClrVerbItem][2],
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateOTClr(2, color.toHexString());
      },
      show: function(color) {
        checkVerbClrInput('OT');
      }
    });
  if (numOfColumns > 2)
    $('#inClrOTVerbItem3').spectrum({
      color: c4[C_OT][C_inClrVerbItem][3],
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateOTClr(3, color.toHexString());
      },
      show: function(color) {
        checkVerbClrInput('OT');
      }
    });
  if (numOfColumns > 3)
    $('#inClrOTVerbItem4').spectrum({
      color: c4[C_OT][C_inClrVerbItem][4],
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateOTClr(4, color.toHexString());
      },
      show: function(color) {
        checkVerbClrInput('OT');
      }
    });
  if (numOfColumns > 4)
    $('#inClrOTVerbItem5').spectrum({
      color: c4[C_OT][C_inClrVerbItem][5],
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateOTClr(5, color.toHexString());
      },
      show: function(color) {
        checkVerbClrInput('OT');
      }
    });
}

function updateHtmlForGender() {
  $('#inClrMasculine').spectrum({
    color: c4[C_inClrMasculine],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      userUpdateNounClr('masculine', color.toHexString());
    },
    show: function(color) {
      checkNounClr();
    }
  });
  $('#inClrFeminine').spectrum({
    color: c4[C_inClrFeminine],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      userUpdateNounClr('feminine', color.toHexString());
    },
    show: function(color) {
      checkNounClr();
    }
  });
  $('#inClrNeuter').spectrum({
    color: c4[C_inClrNeuter],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      userUpdateNounClr('neuter', color.toHexString());
    },
    show: function(color) {
      checkNounClr();
    }
  });
}

function updateHtmlForNumber() {
  $('#slctUlPlural option')
    .filter(function() {
      return $.trim($(this).text()) == upCaseFirst(c4[C_slctUlPlural]);
    })
    .attr('selected', true);
  $('#slctUlSingular option')
    .filter(function() {
      return $.trim($(this).text()) == upCaseFirst(c4[C_slctUlSingular]);
    })
    .attr('selected', true);
}

function updateHtmlForPassiveBkgrdClr() {
  $('#inPassiveBkgrdClr').spectrum({
    color: c4[C_Greek][C_inPassiveBkgrdClr],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      c4[C_Greek][C_inPassiveBkgrdClr] = color.toHexString();
      updtLocalStorage();
      updateVerbsBkgrd('passive');
    },
    show: function(color) {
      checkVerbClrInput();
    }
  });
  $('#inPassiveUlClr1').spectrum({
    color: c4[C_Greek][C_inPassiveUlClr1],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      c4[C_Greek][C_inPassiveUlClr1] = color.toHexString();
      updtLocalStorage();
      updateVerbsBkgrd('passive');
    },
    show: function(color) {
      checkVerbClrInput();
    }
  });
  $('#inPassiveUlClr2').spectrum({
    color: c4[C_Greek][C_inPassiveUlClr2],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      c4[C_Greek][C_inPassiveUlClr2] = color.toHexString();
      updtLocalStorage();
      updateVerbsBkgrd('passive');
    },
    show: function(color) {
      checkVerbClrInput();
    }
  });

  $('#inOTPassiveBkgrdClr').spectrum({
    color: c4[C_OT][C_inPassiveBkgrdClr],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      c4[C_OT][C_inPassiveBkgrdClr] = color.toHexString();
      updtLocalStorage();
      createUlForOT();
    },
    show: function(color) {
      checkVerbClrInput();
    }
  });
  $('#inOTPassiveUlClr1').spectrum({
    color: c4[C_OT][C_inPassiveUlClr1],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      c4[C_OT][C_inPassiveUlClr1] = color.toHexString();
      updtLocalStorage();
      createUlForOT();
    },
    show: function(color) {
      checkVerbClrInput();
    }
  });
}

function updateHtmlForMiddleBkgrdClr() {
  $('#inMiddleBkgrdClr').spectrum({
    color: c4[C_Greek][C_inMiddleBkgrdClr],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      c4[C_Greek][C_inMiddleBkgrdClr] = color.toHexString();
      updtLocalStorage();
      updateVerbsBkgrd('middle');
    },
    show: function(color) {
      checkVerbClrInput();
    }
  });
  $('#inMiddleUlClr1').spectrum({
    color: c4[C_Greek][C_inMiddleUlClr1],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      c4[C_Greek][C_inMiddleUlClr1] = color.toHexString();
      updtLocalStorage();
      updateVerbsBkgrd('middle');
    },
    show: function(color) {
      checkVerbClrInput();
    }
  });
  $('#inMiddleUlClr2').spectrum({
    color: c4[C_Greek][C_inMiddleUlClr2],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      c4[C_Greek][C_inMiddleUlClr2] = color.toHexString();
      updtLocalStorage();
      updateVerbsBkgrd('middle');
    },
    show: function(color) {
      checkVerbClrInput();
    }
  });
  $('#inOTMiddleBkgrdClr').spectrum({
    color: c4[C_OT][C_inMiddleBkgrdClr],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      c4[C_OT][C_inMiddleBkgrdClr] = color.toHexString();
      updtLocalStorage();
      createUlForOT();
    },
    show: function(color) {
      checkVerbClrInput();
    }
  });
  $('#inOTMiddleUlClr1').spectrum({
    color: c4[C_OT][C_inMiddleUlClr1],
    showInput: true,
    preferredFormat: 'hex',
    clickoutFiresChange: false,
    change: function(color) {
      c4[C_OT][C_inMiddleUlClr1] = color.toHexString();
      updtLocalStorage();
      createUlForOT();
    },
    show: function(color) {
      checkVerbClrInput();
    }
  });
}

function hideOrShowHtmlForPassiveBkgrdClr(passiveBkgrdName, otPrefix) {
  var checkedValue, checkBox, c4Ref;
  if ((otPrefix !== null) && (otPrefix == 'OT')) {
    c4Ref = c4[C_OT];
  }
  else {
    c4Ref = c4[C_Greek];
    otPrefix = '';
  }
  if (passiveBkgrdName == 'PassiveBkgrdClr') {
    checkBox = c4Ref[C_chkbxPassiveBkgrdClr];
    checkedValue = c4Ref[C_chkbxPassiveBkgrdColrValue];
  }
  else if (passiveBkgrdName == 'PassiveUlClr1') {
    checkBox = c4Ref[C_chkbxPassiveUlClr1];
    checkedValue = c4Ref[C_chkbxPassiveUlColr1Value];
  }
  else if (passiveBkgrdName == 'PassiveUlClr2') {
    checkBox = c4Ref[C_chkbxPassiveUlClr2];
    checkedValue = c4Ref[C_chkbxPassiveUlColr2Value];
  }
  else if (passiveBkgrdName == 'MiddleBkgrdClr') {
    checkBox = c4Ref[C_chkbxMiddleBkgrdClr];
    checkedValue = c4Ref[C_chkbxMiddleBkgrdColrValue];
  }
  else if (passiveBkgrdName == 'MiddleUlClr1') {
    checkBox = c4Ref[C_chkbxMiddleUlClr1];
    checkedValue = c4Ref[C_chkbxMiddleUlColr1Value];
  }
  else if (passiveBkgrdName == 'MiddleUlClr2') {
    checkBox = c4Ref[C_chkbxMiddleUlClr2];
    checkedValue = c4Ref[C_chkbxMiddleUlColr2Value];
  }
  passiveBkgrdName = otPrefix + passiveBkgrdName;
  $('#chkbx' + passiveBkgrdName).prop('checked', checkedValue);
  if (checkBox) {
    $('#chkbx' + passiveBkgrdName).show();
    $('#chkbx' + passiveBkgrdName).prop('disabled', false);
    if ($('#in' + passiveBkgrdName).length) {
      if (checkedValue) $('#in' + passiveBkgrdName).spectrum('enable');
      else $('#in' + passiveBkgrdName).spectrum('disable');
    }
  } else {
    $('#chkbx' + passiveBkgrdName).hide();
    $('#chkbx' + passiveBkgrdName).prop('disabled', true);
    if ($('#in' + passiveBkgrdName).length)
      $('#in' + passiveBkgrdName).spectrum('disable');
  }
}

function cancelClrChanges() {
    if (typeof(Storage) !== 'undefined') {
      var previousEnableGenderNumberClr = c4[C_enableGenderNumberClr];
      var tmp = window.localStorage.getItem('colorCode-PreviousSettings');
      if (tmp) c4 = JSON.parse(tmp);
      else c4 = createC4();
      updtLocalStorage();
      if ((!previousEnableGenderNumberClr) && (c4[C_enableGenderNumberClr])) cgv[C_userTurnGenderNumberFromOffToOn] = true;
      alert('Your color settings has been reset to your previous setting.');
      updateAllSettingsAndInputFields();
    }
}

function resetClrConfig() {
    if (typeof(Storage) !== 'undefined') {
      var previousEnableGenderNumberClr = c4[C_enableGenderNumberClr];
      c4 = createC4();
      updtLocalStorage();
      if ((!previousEnableGenderNumberClr) && (c4[C_enableGenderNumberClr])) cgv[C_userTurnGenderNumberFromOffToOn] = true;
      alert('Your color settings has been reset to default setting.');
      updateAllSettingsAndInputFields();
    }
}

function closeClrConfig() {
  $('#theGrammarClrModal').modal('hide');
  $('#theGrammarClrModal').modal({
    show: 'false'
  });
  var element = document.getElementById('theGrammarClrModal');
  element.parentNode.removeChild(element);
  $('.sp-container').remove(); // The color selection tool is not totally removed so manually remove it. 08/19/2019
}

function updateAllSettingsAndInputFields() {
  cgv[C_animationIndexArray] = [];
  cgv[C_copyOfPassiveIndexArray] = cgc[C_passiveIndexArray].slice(0);
  cgv[C_copyOfMiddleIndexArray] = cgc[C_middleIndexArray].slice(0);
  updateVerbsBkgrd('active');
  updateVerbsBkgrd('passive');
  updateVerbsBkgrd('middle');
  createUlForAllItemsInYAndX();
  createUlForOT();
  $('#theGrammarClrModal').modal({
    show: 'false'
  });
  if ($.getUrlVars().indexOf("debug") == -1)
    $('#theGrammarClrModal').modal('show').find('.modal-content').load('/color_code_grammar.min.html');
  else
    $('#theGrammarClrModal').modal('show').find('.modal-content').load('/color_code_grammar.html');
}

function updateNounInputFields(inputOnOff) {
    hideIndividualInputField('.nInptN', inputOnOff);
    hideOrDisplayIndividualClrInputField('.nInptC', inputOnOff);
}

function hideIndividualInputField(fieldName, inputOnOff, skipShow) {
    if (inputOnOff) {
      $(fieldName).attr('disabled', false);
      $(fieldName).attr('hidden', false);
      if (skipShow == null)
        $(fieldName).show();
    } else {
      $(fieldName).attr('disabled', true);
      $(fieldName).attr('hidden', true);
      $(fieldName).hide();
    }
}

function hideOrDisplayIndividualClrInputField(fieldName, inputOnOff) {
    if (inputOnOff) $(fieldName).spectrum('enable');
    else $(fieldName).spectrum('disable');
}

function updateVerbInputFields(inputOnOff, ot) {
    var otPrefix = '';
    if ((ot != undefined) && (ot == 'OT')) otPrefix = 'OT';

    hideOrDisplayIndividualClrInputField('.' + otPrefix + 'vrbInptC', inputOnOff);
    hideIndividualInputField('.' + otPrefix + 'vrbInpt1', inputOnOff);
  //  hideIndividualInputField('#advancedToolsBtn', inputOnOff);
    if (otPrefix != 'OT') {
      var showAnimationCheckbox = c4[C_enableAdvancedTools] && inputOnOff;
      hideIndividualInputField('#inAnimate0', showAnimationCheckbox, true);
      hideIndividualInputField('#inAnimate1', showAnimationCheckbox, true);
      hideIndividualInputField('#inAnimate2', showAnimationCheckbox, true);
      hideIndividualInputField('#inAnimate3', showAnimationCheckbox, true);
      hideIndividualInputField('#inAnimate4', showAnimationCheckbox, true);
      hideIndividualInputField('#inAnimate5', showAnimationCheckbox, true);
      hideIndividualInputField('#inAnimateCheckbox0', showAnimationCheckbox, true);
      hideIndividualInputField('#inAnimateCheckbox1', showAnimationCheckbox, true);
      hideIndividualInputField('#inAnimateCheckbox2', showAnimationCheckbox, true);
      hideIndividualInputField('#inAnimateCheckbox3', showAnimationCheckbox, true);
      hideIndividualInputField('#inAnimateCheckbox4', showAnimationCheckbox, true);
      hideIndividualInputField('#inAnimateCheckbox5', showAnimationCheckbox, true);
      if (c4[C_Greek][C_xAxisForMood]) {
        hideIndividualInputField('.vrbInptX', c4[C_Greek][C_granularControlOfMoods] && inputOnOff);
        hideIndividualInputField('.vrbInptY', c4[C_Greek][C_granularControlOfTenses] && inputOnOff);
      }
      else {
        hideIndividualInputField('.vrbInptX', c4[C_Greek][C_granularControlOfTenses] && inputOnOff);
        hideIndividualInputField('.vrbInptY', c4[C_Greek][C_granularControlOfMoods] && inputOnOff);
      }
      hideOrShowHtmlForPassiveBkgrdClr('PassiveUlClr2');
      hideOrShowHtmlForPassiveBkgrdClr('MiddleUlClr2');
    }
    hideOrShowHtmlForPassiveBkgrdClr('PassiveBkgrdClr', otPrefix);
    hideOrShowHtmlForPassiveBkgrdClr('PassiveUlClr1', otPrefix);
    hideOrShowHtmlForPassiveBkgrdClr('MiddleBkgrdClr', otPrefix);
    hideOrShowHtmlForPassiveBkgrdClr('MiddleUlClr1', otPrefix);
    if (!inputOnOff) { // Turning on the passive colors is more complex and is handled by other routines.
      hideOrDisplayIndividualClrInputField('#in' + otPrefix + 'PassiveBkgrdClr', inputOnOff);
      hideOrDisplayIndividualClrInputField('#in' + otPrefix + 'PassiveUlClr1', inputOnOff);
      hideIndividualInputField('#chkbx' + otPrefix + 'PassiveBkgrdClr', inputOnOff);
      hideIndividualInputField('#chkbx' + otPrefix + 'PassiveUlClr1', inputOnOff);
      hideIndividualInputField('#chkbxPassiveUlClr2', inputOnOff);
      hideOrDisplayIndividualClrInputField('#in' + otPrefix + 'MiddleBkgrdClr', inputOnOff);
      hideOrDisplayIndividualClrInputField('#in' + otPrefix + 'MiddleUlClr1', inputOnOff);
      hideIndividualInputField('#chkbx' + otPrefix + 'MiddleBkgrdClr', inputOnOff);
      hideIndividualInputField('#chkbx' + otPrefix + 'MiddleUlClr1', inputOnOff);
      if (otPrefix != 'OT') {
        hideOrDisplayIndividualClrInputField('#inPassiveUlClr2', inputOnOff);
        hideOrDisplayIndividualClrInputField('#inMiddleUlClr2', inputOnOff);
        hideIndividualInputField('#chkbxMiddleUlClr2', inputOnOff);
      }
    }
}

function updateVerbsBkgrd(voice) {
  var selectedUnderline, selectedClr;
  var indexArray = [];
  if (voice === 'passive') indexArray = cgc[C_passiveIndexArray];
  else if (voice === 'middle') indexArray = cgc[C_middleIndexArray];
  else if (voice === 'active') indexArray = cgc[C_activeIndexArray];
  for (var counter = 0; counter < indexArray.length; counter += 1) {
    var indexToUlVerbCSS = indexArray[counter];
    var orderOfXAxis = getAxisOrderOfCSS(cgv[C_ulVerbCSS][indexToUlVerbCSS].name, 'X');
    var orderOfYAxis = getAxisOrderOfCSS(cgv[C_ulVerbCSS][indexToUlVerbCSS].name, 'Y');
    if (c4[C_Greek][C_xAxisForMood]) {
      selectedUnderline = cgc[C_underlineCanvasName][c4[C_Greek][C_slctUlVerbItem][orderOfYAxis]];
      selectedClr = c4[C_Greek][C_inClrVerbItem][orderOfXAxis];
    }
    else {
      selectedUnderline = cgc[C_underlineCanvasName][c4[C_Greek][C_slctUlVerbItem][orderOfXAxis]];
      selectedClr = c4[C_Greek][C_inClrVerbItem][orderOfYAxis];
    }
    var srcImgObj = _.find(cgv[C_uLBASEIMGS], function(obj) { return obj.name == selectedUnderline; });
    updateUlForSpecificYAxis(cgv[C_ulVerbCSS][indexToUlVerbCSS], srcImgObj, selectedClr, indexToUlVerbCSS);
  }
}

function getVerbItemsCombinedWithCurrentItem(axis, itemNumber) {
  var codeOfItemCombinedWithCurrentItem = [], nameOfItemCombinedWithCurrentItem = [];
  var orderOfItem, itemsCombinedWithPreviousItem, robinsonCode;
  if ( ((c4[C_Greek][C_xAxisForMood]) && (axis == 'X')) ||
        ((!c4[C_Greek][C_xAxisForMood]) && (axis == 'Y')) ) {
    orderOfItem = c4[C_Greek][C_orderOfMood];
    itemsCombinedWithPreviousItem = c4[C_Greek][C_moodToCombineWithPrevious];
    robinsonCode = cgc[C_robinsonCodeOfMood];
  }
  else {
    orderOfItem = c4[C_Greek][C_orderOfTense];
    itemsCombinedWithPreviousItem = c4[C_Greek][C_tenseToCombineWithPrevious];
    robinsonCode = cgc[C_robinsonCodeOfTense];
  }
  var codeOfCurrentItem = getVariablesForVerbTable()['orderOf' + axis + 'AxisItems'][itemNumber];
  var idxOfCurrentItem = orderOfItem.indexOf(codeOfCurrentItem);
  for (var i = idxOfCurrentItem; i < itemsCombinedWithPreviousItem.length; i ++) {
    if ((itemsCombinedWithPreviousItem[i]) || (i == idxOfCurrentItem) ) {
      codeOfItemCombinedWithCurrentItem.push(orderOfItem[i]);
      nameOfItemCombinedWithCurrentItem.push(robinsonCode[orderOfItem[i]]);
    }
    if ((!itemsCombinedWithPreviousItem[i]) && (i > idxOfCurrentItem) ) break;
  }
  return {
    codeOfItemCombinedWithCurrentItem: codeOfItemCombinedWithCurrentItem,
    nameOfItemCombinedWithCurrentItem: nameOfItemCombinedWithCurrentItem
  };
}

function getAxisOrderOfCSS(cssName, axis) {
  var positionInOrderOfMoodOrTense, moodOrTense;
  if ( ((!c4[C_Greek][C_xAxisForMood]) && (axis == 'X')) ||
        ((c4[C_Greek][C_xAxisForMood]) && (axis == 'Y')) ) {
    moodOrTense = 'tense';
    positionInOrderOfMoodOrTense = c4[C_Greek][C_orderOfTense].indexOf(cssName.substr(0, 1));
  }
  else {
    moodOrTense = 'mood';
    positionInOrderOfMoodOrTense = c4[C_Greek][C_orderOfMood].indexOf(cssName.substr(2, 1));
  }
  return getAxisOrderOfItem(moodOrTense, positionInOrderOfMoodOrTense);
}