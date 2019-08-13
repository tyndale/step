function initializeColorCodeHtmlModalPage() {
  addVerbTable(true, '#verbColors');
  addOTVerbTable(true, '#hVerbColors');
  addNounTable();
  updateHtmlForYAxis();
  updateHtmlForXAxis();
  updateHtmlForGender();
  updateHtmlForNumber();
  updateHtmlForPassiveBackgroundColor();
  updateHtmlForMiddleBackgroundColor();
  enableOrDisableAxisConfigButtons('X');
  enableOrDisableAxisConfigButtons('Y');
  enableOrDisableAxisConfigButtons('X', 'OT');
  enableOrDisableAxisConfigButtons('Y', 'OT');
  enableOrDisableAdvancedToolsButtons();
  enableOrDisableAdvancedToolsButtons('OT');
  enableOrDisableVerbAndNounButtons();
  refreshForAllInstancesOfTense();
  if ((((c4['inputCheckboxPassiveUlColor1CheckValue']) && (c4['inputCheckboxPassiveUlColor2CheckValue'])) ||
      ((c4['inputCheckboxMiddleUlColor1CheckValue']) && (c4['inputCheckboxMiddleUlColor2CheckValue']))) &&
    (handleOfRequestedAnimation === -1)) goAnimate();  //c4 is currentColorCodeConfig.  It is changed to c4 to save space
  localStorage.setItem('colorCode-PreviousSettings', JSON.stringify(c4));
}

function openColorConfig() {
  if (typeof(Storage) !== 'undefined') {
    var openConfigPage = $('<div id="openColorModal" class="modal selectModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
      '<div class="modal-dialog"><div class="modal-content">');
    var temp = document.getElementById('openColorModal');
    if (!temp) openConfigPage.appendTo('body');
    $('#openColorModal').modal('show').find('.modal-content').load('/open_color_code_grammar.html');
  }
}

function initOpenColorCodeModal() {
  var s = $('<select id="openColorConfigDropdown"/>');
  s.append($('<option/>').html('Verb, Gender and Number'));
  s.append($('<option/>').html('Verb, Gender and Number, 2nd version'));
  s.append($('<option/>').html('Verb only (tense-mood)'));
  s.append($('<option/>').html('Verb with Middle and Passive Voices'));
  s.append($('<option/>').html('Verb, imperative mood'));
  s.append($('<option/>').html('Verb, main vs supporting verbs'));
  s.append($('<option/>').html('Gender and Number'));
  var tmp = localStorage.getItem('colorCode-UserColorConfigNames');
  if (tmp) {
    var UserColorConfigNames = JSON.parse(tmp);
    for (var i in UserColorConfigNames) {
      s.append($('<option/>').html(UserColorConfigNames[i]));
    }
  }
  $('#openColorModalSelectArea').append(s);
}

function initSortVerbItem() {
  var r = getVariablesForVerbTable();
  var sortType = r[axisUserSelectedToSort.toLowerCase() + 'AxisTitle'];
  var moodOrTense = sortType.substr(0,sortType.length - 1);
  var nameOfAllItems = r['nameOfAll' + axisUserSelectedToSort + 'AxisItems'];
  var itemsToCombineWithPrevious = c4[sortType.substr(0, sortType.length -1) + 'ToCombineWithPrevious'];
  var axisName, otherAxisName;
  if (axisUserSelectedToSort == 'X') {
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

  for (var i = 0; i < nestedSortables.length; i++) {
    new Sortable(nestedSortables[i], {
      group: 'nested',
      animation: 150,
      onEnd: function(/**Event*/evt) {
        userProvidedSortOrder = [];
        for (var i = 0; i < $('#nestedVerbItem')[0].children.length; i ++) {
          userProvidedSortOrder.push($('#nestedVerbItem')[0].children[i].innerText);
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
      r2 = getVariablesForOTVerbTable('A');
      for (var i = 0; i < r.descOfXAxisItems.length; i ++) {
        var aramaicStems = (r2.descOfXAxisItems[i].length > 0) ? r2.descOfXAxisItems[i].replace(/^/, "(").replace(/$/, ")") : '';
        arrayDesc.push(r.descOfXAxisItems[i] + '<br>' + aramaicStems.replace(/<br>/g, ")<br>(")); 
      }
    }
    else arrayDesc = getVariablesForOTVerbTable('H')['descOfYAxisItems'];
  }
  else {
    arrayDesc = getVariablesForVerbTable()['descOf' + axis + 'AxisItems'];
  }
  var previousHeader = c4[testament + 'VerbTable' + axis + 'Header'];
  c4[testament + 'VerbTable' + axis + 'Header'] = null;
  localStorage.setItem('colorCode-CurrentSettings', JSON.stringify(c4)); // If user does not save, the previous header should not be re-use so clear it.  
  var prevHdrArray = [];
  if (previousHeader != null) {
    for (var j = 0; j < previousHeader.desc.length; j ++) {
      for (var k = 0; k <= previousHeader.repeat[j]; k++) {
        prevHdrArray.push(previousHeader.desc[j]);
      }
    }
  }
  for (var j = 0; j < 25; j ++) { // add some extra blank items so that the input fields will not show "undefined"
    prevHdrArray.push('');
  }
  var s = '<p class="col-12">Enter the additional header information for the ' + axis + ' axis.</p><br>' +
    '<span id="uahi_num_of_input" style="visibility:hidden">' + arrayDesc.length + '</span>' + 
    '<form>';
  for (var j = 0; j < arrayDesc.length; j ++) {
    var text = arrayDesc[j].replace(/<br>/g, ", ");
    s += text + '<br><input id="uahi_input' + j + '" type="text" value="' + prevHdrArray[j] + '"><br>';
  }
  s += '</form>';
  $('#addHeaderInfoArea').append($(s));
}

function saveHeaderInfo() {
  var testament = $('#uahi_testament')[0].innerHTML;
  var axis = $('#uahi_axis')[0].innerHTML;
  var numOfInput = $('#uahi_num_of_input')[0].innerHTML;
  if (testament == 'ot') {
    r = getVariablesForOTVerbTable('H');
  }
  else {
    r = getVariablesForVerbTable();
  }
  c4[testament + 'VerbTable' + axis + 'Header'] = {desc: [], repeat: []};
  var hdrNum = 0;
  for (var j = 0; j < numOfInput; j ++) {
    var text = $('#uahi_input' + j)[0].value;
    if ((hdrNum > 0) && (c4[testament + 'VerbTable' + axis + 'Header'].desc[(hdrNum-1)] == text))
      c4[testament + 'VerbTable' + axis + 'Header'].repeat[(hdrNum-1)] ++;
    else {
      c4[testament + 'VerbTable' + axis + 'Header'].desc.push(text);
      c4[testament + 'VerbTable' + axis + 'Header'].repeat.push(0);
      hdrNum ++;
    }
  }
  localStorage.setItem('colorCode-CurrentSettings', JSON.stringify(c4));
  $('#addHeaderInfoModal .close').click();
  var element = document.getElementById('addHeaderInfoModal');
  element.parentNode.removeChild(element);
  $('#sortAxisModal .close').click();
  updateAllSettingsAndInputFields();
}

function initSortOTVerbItem() {
  var r1 = getVariablesForOTVerbTable('H');
  var r2 = getVariablesForOTVerbTable('A');
  var sortType = r1[axisUserSelectedToSort.toLowerCase() + 'AxisTitle'];
  var stemOrForm = sortType.substr(0,sortType.length - 1);

  var itemsToCombineWithPrevious = []; var nameOfAllItems = [];
  if (axisUserSelectedToSort == 'X') {
    var nameOfAllHebrewItems = r1['nameOfAll' + axisUserSelectedToSort + 'AxisItems'];
    var nameOfAllAramaicItems = r2['nameOfAll' + axisUserSelectedToSort + 'AxisItems'];
    var aramaicStemIndex = 0;
    for (var i = 0; i < nameOfAllHebrewItems.length; i ++) {
      var noStemForThisGroupYet = true;
      if (nameOfAllHebrewItems[i] != '') {
        nameOfAllItems.push(nameOfAllHebrewItems[i]);
        itemsToCombineWithPrevious.push(c4.hebrewStemToCombineWithPrevious[i]);
        noStemForThisGroupYet = false;
      }
      if ((i == (nameOfAllHebrewItems.length - 1)) || (!c4.hebrewStemToCombineWithPrevious[i+1])) {
        do {
          if (nameOfAllAramaicItems[aramaicStemIndex] != '') {
            nameOfAllItems.push('(' + nameOfAllAramaicItems[aramaicStemIndex] + ')');
            itemsToCombineWithPrevious.push(!noStemForThisGroupYet);
            noStemForThisGroupYet = false;
          }
          aramaicStemIndex ++;
        } while ((aramaicStemIndex < nameOfAllAramaicItems.length) && (c4.aramaicStemToCombineWithPrevious[aramaicStemIndex]))
      }
    }
  }
  else {
    nameOfAllItems = r1['nameOfAll' + axisUserSelectedToSort + 'AxisItems'];
    itemsToCombineWithPrevious = c4.oTVerbFormToCombineWithPrevious;
  }
  var s = '<p class="col-12">Click and drag a ' + stemOrForm + ' to can change the order of the ' + sortType + '.<br>' +
    'Drag a ' + stemOrForm + ' on top on another to group them to the same color configuration.<br>';
  if (stemOrForm == 'stem') s += 'Aramaic stems are in parentheses (round brackets).<br>';
  s += 'When you are finished, click on "Save" at the bottom.<br>' +
    '<div id="nestedVerbItem" class="list-group col nested-sortable">';
  var skipDiv = false; var voice; var displayInTitle;
  for (var i = 0; i < nameOfAllItems.length; i++) {
    var voice; var displayInTitle = ''; var activeSelected = ''; var passiveSelected = ''; var middleSelected = ''; var languageCode = ''; 
    var nameOfCurrentItem =  nameOfAllItems[i];
    var upperCaseName = upCaseFirst(nameOfCurrentItem);
    if (axisUserSelectedToSort == 'X') {
      if (nameOfAllItems[i].charAt(0) == '(') {
        languageCode = 'A';
        nameOfCurrentItem = nameOfAllItems[i].substr(1, (nameOfAllItems[i].length - 2));
        upperCaseName = '(' + upperCaseName.charAt(1).toUpperCase() + upperCaseName.slice(2);
        voice = c4.aramaicCodeOfStem[aramaicNameOfStem[nameOfCurrentItem]][1];
        displayInTitle = (c4.aramaicCodeOfStem[aramaicNameOfStem[nameOfCurrentItem]][2] === true) ? ' checked' : '';
      }
      else {
        languageCode = 'H';
        nameOfCurrentItem = nameOfAllItems[i];
        voice = c4.hebrewCodeOfStem[hebrewNameOfStem[nameOfCurrentItem]][1];
        displayInTitle = (c4.hebrewCodeOfStem[hebrewNameOfStem[nameOfCurrentItem]][2] === true) ? ' checked' : '';
      }
      if (voice == 'a') activeSelected = ' selected';
      else if (voice == 'p') passiveSelected = ' selected';
      else if (voice == 'm') middleSelected = ' selected';
    }
    else {
      upperCaseName = c4.oTCodeOfForm[otNameOfVerbForm[nameOfCurrentItem]][1];
      displayInTitle = (c4.oTCodeOfForm[otNameOfVerbForm[nameOfCurrentItem]][2] === true) ? ' checked' : '';
    }
    s += '<div class="list-group-item nested-1">' + upperCaseName + ' - ' +
      '<span>Show at title of colour config screen: </span>' +
      '<input id="sortCheckbox'  + languageCode + nameOfCurrentItem + '"type="checkbox"' + displayInTitle + '></input>';
    if (axisUserSelectedToSort == 'X') 
      s += '<span>&nbsp;Voice:&nbsp;</span><select id="sortSelect' + languageCode + nameOfCurrentItem + '"><option value="a"' + activeSelected + '>Active</option><option value="p"' + passiveSelected + '>Passive</option><option value="m"' + middleSelected + '>Middle</option></select>';
    s += '<div class="list-group nested-sortable">';
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

  for (var i = 0; i < nestedSortables.length; i++) {
    new Sortable(nestedSortables[i], {
      group: 'nested',
      animation: 150,
      onEnd: function(/**Event*/evt) {
        userProvidedSortOrder = [];
        for (var i = 0; i < $('#nestedVerbItem')[0].children.length; i ++) {
          userProvidedSortOrder.push($('#nestedVerbItem')[0].children[i].innerText);
        }
      }
    });
  }
}

function resetSortOrder() {
  $('#sortAxisModal .close').click();
  var element = document.getElementById('sortAxisModal');
  element.parentNode.removeChild(element);
  userSortAxis(axisUserSelectedToSort);
}

function resetSortOTOrder() {
  $('#sortAxisModal .close').click();
  var element = document.getElementById('sortAxisModal');
  element.parentNode.removeChild(element);
  userSortOTAxis(axisUserSelectedToSort);
}

function saveSortOrder() {
  if (axisUserSelectedToSort == 'X') sortType = getVariablesForVerbTable().xAxisTitle;
  else sortType = getVariablesForVerbTable().yAxisTitle;
  var currentItem;
  var orderOfUserProvidedItems = [], itemsToCombineWithPrevious = [false, false, false, false, false, false];
  var j = 0;
  if (userProvidedSortOrder.length > 0) {
    for (i = 0; i < userProvidedSortOrder.length; i ++) {
      var verbItem = userProvidedSortOrder[i].toLowerCase().replace(/\r\n/g, "\n").replace(/\n\n/g, "\n"); // IE would have \r\n\r\n instead of \n.  The two replace will handle either 1 or 2 \r\n    
      while (verbItem.length > 0) {
        indexOfLineBreak = verbItem.indexOf('\n');
        if (indexOfLineBreak == -1) {
          currentItem = verbItem;
          verbItem = '';
        }
        else {
          currentItem = verbItem.substr(0, indexOfLineBreak).toLowerCase();
          verbItem = verbItem.substr(indexOfLineBreak + 1);
          if (verbItem.length > 0) itemsToCombineWithPrevious[j+1] = true; // Edge can add an extra \n to the end.
        }
        if (sortType == 'moods') orderOfUserProvidedItems[j] = robinsonNameOfMood[currentItem];
        else orderOfUserProvidedItems[j] = robinsonNameOfTense[currentItem];
        j++;
      }
    }
    if (sortType == 'moods') {
      c4.orderOfMood = orderOfUserProvidedItems;
      c4.moodToCombineWithPrevious = itemsToCombineWithPrevious;
    }
    else {
      c4.orderOfTense = orderOfUserProvidedItems;
      c4.tenseToCombineWithPrevious = itemsToCombineWithPrevious;
    }
    localStorage.setItem('colorCode-CurrentSettings', JSON.stringify(c4));
    if (confirm('Do you want to edit the optional header information for the verb ' + sortType + '?'))
      userAddHeaderInfo(axisUserSelectedToSort);
    else {
      if (axisUserSelectedToSort == 'X') c4.ntVerbTableXHeader = null;
      else c4.ntVerbTableYHeader = null;
      localStorage.setItem('colorCode-CurrentSettings', JSON.stringify(c4));
    }
  }
  $('#sortAxisModal .close').click();
  var element = document.getElementById('sortAxisModal');
  element.parentNode.removeChild(element);
  updateAllSettingsAndInputFields();
}

function saveSortOTOrder() {
  var sortType;
  if (axisUserSelectedToSort == 'X') 
    sortType = getVariablesForOTVerbTable('H').xAxisTitle;
  else
    sortType = getVariablesForOTVerbTable('H').yAxisTitle;
  if (sortType == 'stems') {
    if (userProvidedSortOrder.length > 0) {
      c4.orderOfHebrewStem = [];
      c4.hebrewStemToCombineWithPrevious = [];
      c4.orderOfAramaicStem = [];
      c4.aramaicStemToCombineWithPrevious = [];
      for (i = 0; i < userProvidedSortOrder.length; i ++) {
        var verbItem = userProvidedSortOrder[i].toLowerCase().replace(/\r\n/g, "\n").replace(/\n\n/g, "\n"); // IE would have \r\n\r\n instead of \n.  The two replace will handle either 1 or 2 \r\n    
        verbItem = '\n' + verbItem.replace(/(active|passive|middle)\n?/g, "").replace(/\s-\sshow at title of colour config screen:\s+voice:/g, "").replace(/\s+/g, "\n");
        var updatedString = verbItem;
        do {
          var previousString = updatedString;
          updatedString = updatedString.replace(/\n\([a-z]+\)\n/g, "\n"); // loop is requried because the global replace will not include the newly replaced "\n"
        } while (previousString != updatedString);
        var hebrewStemsInThisGroup = updatedString.replace(/^\n/, "").replace(/\n$/, "").replace(/\s+/g, " ").split(' ');
        updatedString = verbItem;
        do {
          var previousString = updatedString;
          updatedString = updatedString.replace(/\n[a-z]+\n/g, "\n"); // loop is requried because the global replace will not include the newly replaced "\n"
        } while (previousString != updatedString);
        var aramaicStemsInThisGroup = updatedString.replace(/^\n/, "").replace(/\n$/, "").replace(/\s+/g, " ").replace(/[\(\)]/g, "").split(' ');
        for (var j = 0; j < hebrewStemsInThisGroup.length; j++) {
          c4.orderOfHebrewStem.push( hebrewNameOfStem[hebrewStemsInThisGroup[j]] );
          c4.hebrewStemToCombineWithPrevious.push( (j > 0) );
        }
        for (var k = 0; k < aramaicStemsInThisGroup.length; k++) {
          c4.orderOfAramaicStem.push( aramaicNameOfStem[aramaicStemsInThisGroup[k]] );
          c4.aramaicStemToCombineWithPrevious.push( (k > 0) );
        }
      }
    }
    for (var j = 0; j < c4.orderOfHebrewStem.length; j++) {
      var currentStemCode = c4.orderOfHebrewStem[j];
      if (currentStemCode != undefined) {
        var currentStem = c4.hebrewCodeOfStem[currentStemCode][0];
        if (currentStem != '') {
          c4.hebrewCodeOfStem[currentStemCode][1] = $('#sortSelectH' + currentStem + ' option:selected')[0].value;
          c4.hebrewCodeOfStem[currentStemCode][2] = $('#sortCheckboxH' + currentStem)[0].checked;
        }
      }
    }
    for (var j = 0; j < c4.orderOfAramaicStem.length; j++) {
      var currentStemCode = c4.orderOfAramaicStem[j];
      if (currentStemCode != undefined) {
        var currentStem = c4.aramaicCodeOfStem[currentStemCode][0];
        if (currentStem != '') {
          c4.aramaicCodeOfStem[currentStemCode][1] = $('#sortSelectA' + currentStem + ' option:selected')[0].value;
          c4.aramaicCodeOfStem[currentStemCode][2] = $('#sortCheckboxA' + currentStem)[0].checked;
        }
      }
    }
  }
  else {
    if (userProvidedSortOrder.length > 0) {
      c4.orderOfOTForm = [];
      c4.oTVerbFormToCombineWithPrevious = [];
      for (i = 0; i < userProvidedSortOrder.length; i ++) {
        var verbItem = userProvidedSortOrder[i].replace(/\r\n/g, "\n").replace(/\n\n/g, "\n"); // IE would have \r\n\r\n instead of \n.  The two replace will handle either 1 or 2 \r\n    
        verbItem = '\n' + verbItem.replace(/\s-\sShow at title of colour config screen: /g, "").replace(/\s+/g, "\n");
        var formsInThisGroup = verbItem.replace(/^\n/, "").replace(/\n$/, "").replace(/\s+/g, " ").replace(/[\(\)]/g, "").split(' ');
        for (var j = 0; j < formsInThisGroup.length; j++) {
          var result = _.find(c4.oTCodeOfForm, function(obj) { return obj[1] == formsInThisGroup[j]; });
          c4.orderOfOTForm.push( otNameOfVerbForm[result[0]] );
          c4.oTVerbFormToCombineWithPrevious.push( (j > 0) );
        }
      }
    }
    for (var j = 0; j < c4.orderOfOTForm.length; j++) {
      var currentFormCode = c4.orderOfOTForm[j];
      if (currentFormCode != undefined) {
        var currentForm = c4.oTCodeOfForm[currentFormCode][0];
        if (currentForm != '')
          c4.oTCodeOfForm[currentFormCode][2] = $('#sortCheckbox' + currentForm)[0].checked;
      }
    }
  }
  localStorage.setItem('colorCode-CurrentSettings', JSON.stringify(c4));
  if (confirm('Do you want to edit the optional header information for the verb ' + sortType + '?'))
    userAddHeaderInfo(axisUserSelectedToSort, 'OT');
  else {
    if (axisUserSelectedToSort == 'X') c4.otVerbTableXHeader = null;
    else c4.otVerbTableYHeader = null;
    localStorage.setItem('colorCode-CurrentSettings', JSON.stringify(c4));
  }
  $('#sortAxisModal .close').click();
  var element = document.getElementById('sortAxisModal');
  element.parentNode.removeChild(element);
  updateAllSettingsAndInputFields();
}

function saveColorConfig() {
  if (typeof(Storage) !== 'undefined') {
    var saveConfigPage = $('<div id="saveColorModal" class="modal selectModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
      '<div class="modal-dialog"><div class="modal-content">');
    var temp = document.getElementById('saveColorModal');
    if (!temp) {
      saveConfigPage.appendTo('body');
    }
    $('#saveColorModal').modal('show').find('.modal-content').load('/save_color_code_grammar.html');
  }
}

function initSaveColorCodeModal() {
  var tmp = localStorage.getItem('colorCode-UserColorConfigNames');
  if (tmp) {
    $('#saveColorModalPromptForDropdownList').show();
    var s = $('<select id="saveColorConfigDropdown"/>');
    var UserColorConfigNames = JSON.parse(tmp);
    s.append($('<option/>').html(''));
    for (var i in UserColorConfigNames) {
      s.append($('<option/>').html(UserColorConfigNames[i]));
    }
    $('#saveColorModalSelectArea').append(s);
  } else $('#saveColorModalPromptForDropdownList').hide();
}

function saveUserColorConfig() {
  var UserColorConfigNames = [];
  var inputText = document.getElementById('saveColorModalInputArea').value.trim();
  var selectedConfig = document.getElementById('saveColorConfigDropdown');
  if (selectedConfig) selectedConfig = selectedConfig.value.trim();
  var tmp = localStorage.getItem('colorCode-UserColorConfigNames');
  if (inputText === '') {
    if (!tmp) {
      alert('Please enter a name for your color configuration before using the "Save" button.');
      return;
    } else if (selectedConfig === '') {
      alert('Please enter or select a name for your color configuration before using the "Save" button.');
      return;
    } else inputText = selectedConfig;
  } else {
    if (tmp) {
      UserColorConfigNames = JSON.parse(tmp);
      for (var i = 0; i < UserColorConfigNames.length; i += 1) {
        if (UserColorConfigNames[i] === inputText) {
          alert('The name you entered is already used.  If you want to save the configuration to the same name, select the name from the dropdown list instead of using the text input field.');
          return;
        }
      }
    }
    UserColorConfigNames.push(inputText);
    localStorage.setItem('colorCode-UserColorConfigNames', JSON.stringify(UserColorConfigNames));
  }
  localStorage.setItem('colorCode-UserColorConfigName-' + inputText, JSON.stringify(c4));
  $('#saveColorModal .close').click();
  var element = document.getElementById('saveColorModal');
  element.parentNode.removeChild(element);
}

function addNounTable() {
    var htmlTable = '<table class="tg2">' +
      '<tr>' +
          '<th valign="middle" align="center" colspan="2" rowspan="2">' +
          '<div class="onoffswitch">' +
          '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="gennumonoffswitch" onchange=\'userToggleColorGrammar("gennum")\'/>' +
          '<label class="onoffswitch-label" for="gennumonoffswitch">' +
          '<span class="onoffswitch-inner"></span>' +
          '<span class="onoffswitch-switch"></span>' +
          '</label>' +
          '</div>' +
          '</th>' +
          '<th class="tg-amwm2" colspan="4">Gender</th>' +
      '</tr><tr>' +
          '<td class="tg-yw4l">Masculine:<br>' +
          '<input id="inputColorMasculine" type="color" class="nInptC" value="' + c4.inputColorMasculine + '"/>' +
          '</td>' +
          '<td class="tg-yw4l">Feminine:<br>' +
          '<input id="inputColorFeminine" type="color" class="nInptC" value="' + c4.inputColorFeminine + '"/>' +
          '</td>' +
          '<td class="tg-yw4l">Neuter:<br>' +
          '<input id="inputColorNeuter" type="color" class="nInptC" value="' + c4.inputColorNeuter + '"/>' +
          '</td>' +
      '</tr><tr>' +
          '<td class="tg-e3zv2" rowspan="4">Number</td>' +
          '<td><span>Singular:</span><br><br>' +
              '<select id="selectedHighlightSingular" class="nInptN" onchange=\'userUpdateNumber("singular", value)\'>' +
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
              '<select id="selectedHighlightPlural" class="nInptN" onchange=\'userUpdateNumber("plural", value)\'>' +
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
    htmlTable.appendTo('#nounColors');
}
  
function addOtTitleToXAxis(descOfHebrewXAxisItems, descOfAramaicwXAxisItems, numOfRows, createUserInputFields) {
    var htmlTable = '';
    var curXTitle = c4['otVerbTableXHeader'];
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
    for (var i = 0; i < descOfHebrewXAxisItems.length; i += 1) {
        htmlTable += '<td class="tg-yw4l">' + descOfXAxisItems[i];
        if (createUserInputFields) htmlTable += htmlToAdd3(i, 'OT');
        htmlTable += '</td>';
    }
    htmlTable += '</tr>';
    return htmlTable;
}
  
function addCssToXAxisHeader(descOfHebrewXAxisItems, descOfAramaicwXAxisItems, numOfRows) {
    var result = [];
    for (var c = 0; c < descOfHebrewXAxisItems.length; c++) {
      var hebrewStemsInThisGroup = descOfHebrewXAxisItems[c].replace(/<br>/g, " ").replace(/\s+/g, " ").split(' ');
      var aramaicStemsInThisGroup = descOfAramaicwXAxisItems[c].replace(/<br>/g, " ").replace(/\s+/g, " ").split(' ');
      result.push("");
      for (var i = 0; i < hebrewStemsInThisGroup.length; i++) {
        if (hebrewStemsInThisGroup[i] != '') {
          if (result[c].length > 0) result[c] += '<br>';
          var voice = c4.hebrewCodeOfStem[hebrewNameOfStem[hebrewStemsInThisGroup[i].toLowerCase()]][1];
          if (voice == 'p') {
            result[c] += '<span class="vot_R' + numOfRows + 'C' + ((c*3)+1) + '">' + hebrewStemsInThisGroup[i] + '</span>';
          }
          else if (voice == 'm') {
            result[c] += '<span class="vot_R' + numOfRows + 'C' + ((c*3)+2) + '">' + hebrewStemsInThisGroup[i] + '</span>';
          }
          else result[c] += hebrewStemsInThisGroup[i];
        }
      }
      for (var i = 0; i < aramaicStemsInThisGroup.length; i++) {
        if (aramaicStemsInThisGroup[i] != '') {
          if (result[c].length > 0) result[c] += '<br>';
          var voice = c4.aramaicCodeOfStem[aramaicNameOfStem[aramaicStemsInThisGroup[i].toLowerCase()]][1];
          if (voice == 'p') {
            result[c] += '<span class="vot_R' + numOfRows + 'C' + ((c*3)+1) + '">(' + aramaicStemsInThisGroup[i] + ')</span>' 
          }
          else if (voice == 'm') {
            result[c] += '<span class="vot_R' + numOfRows + 'C' + ((c*3)+2) + '">(' + aramaicStemsInThisGroup[i] + ')</span>' 
          }
          else result[c] += '(' + aramaicStemsInThisGroup[i] + ')';
        }
      }
    }
    return result;
}
  
function addOTVerbTable(createUserInputFields, htmlElement) {
    var r = getVariablesForOTVerbTable('H');
    var xAxisItems, yAxisItems, descOfXAxisItems, descOfYAxisItems;
    if (createUserInputFields) {
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
    if (!createUserInputFields) htmlTable = '<link href="css/color_code_grammar.css" rel="stylesheet" media="screen"/>';
    var yAxisSpan = tableAxisSpan('Y', createUserInputFields, 'OT');
    htmlTable += '<table class="tg2"><tr><th valign="middle" align="center" colspan="' +
    yAxisSpan + '" rowspan="' + tableAxisSpan('X', createUserInputFields, 'OT') + '">';
    if (createUserInputFields) htmlTable += htmlToAdd1('OT');
    htmlTable += '</th><th class="tg-amwm2" colspan="' + xAxisItems.length + '">' + upCaseFirst(r.xAxisTitle);
    if (createUserInputFields) htmlTable += htmlToAdd2(r.xAxisTitle, 'OT');
    htmlTable += '</th></tr>';
    htmlTable += addOtTitleToXAxis(descOfXAxisItems, getVariablesForOTVerbTable('A').descOfXAxisItems, yAxisItems.length, createUserInputFields);
    htmlTable += '<tr>' +
      '<td class="tg-e3zv2" rowspan="' + yAxisItems.length + '">' + upCaseFirst(r.yAxisTitle);
    if (createUserInputFields) htmlTable += htmlToAdd4(r.yAxisTitle, 'OT');
    htmlTable += '</td>';
    for (i = 0; i < yAxisItems.length; i += 1) {
      if (i > 0) htmlTable += '<tr>';
      htmlTable += addTitleToYAxis(i, descOfYAxisItems[i], createUserInputFields, yAxisSpan, 'OT');
      if (createUserInputFields) htmlTable += htmlToAdd5(i, 'OT');
      htmlTable += '</td>';
      for (var counter = 0; counter < xAxisItems.length; counter += 1) {
        htmlTable += '<td>' + voicesInFormAndStem(counter, i) + '</td>';
      }
      htmlTable += '</tr>';
    }
    htmlTable += '</table><br>';
    if (createUserInputFields) htmlTable += htmlToAdd6('OT');
    htmlTable = $(htmlTable);
    htmlTable.appendTo(htmlElement);
}
  
function voicesInFormAndStem(yAxisNum, xAxisNum) {
    yAxisNum = yAxisNum * 3
    return '<span class="vot_' + ulOTVbCSS[xAxisNum][yAxisNum].name + '">active</span><br>' +
           '<span class="vot_' + ulOTVbCSS[xAxisNum][yAxisNum+1].name + '">passive</span><br>' +
           '<span class="vot_' + ulOTVbCSS[xAxisNum][yAxisNum+2].name + '">middle</span>';
}

function userUpdateYAxisItem(itemNumberOfYAxis, nameOfUnderline) {
    updateLocalStorage('selectedHighlightVerbItem' + itemNumberOfYAxis, canvasUnderlineName[nameOfUnderline]);
    var srcImgObj = _.find(uLBASEIMGS, function(obj) { return obj.name == nameOfUnderline; });
    if (srcImgObj === undefined) {
      alert('Error: cannot find the name of tense or underline');
    } 
    else {
      var r = getVerbItemsCombinedWithCurrentItem('Y', itemNumberOfYAxis);
      for (var count = 0; count < r.nameOfItemCombinedWithCurrentItem.length; count ++) {
        updateUlForAllInstancesOfYAxisItem(r.nameOfItemCombinedWithCurrentItem[count], srcImgObj);
      }
      if ((nameOfUnderline !== 'ulSolid') && (nameOfUnderline !== 'ulDoubleSolid') && (c4.enableAdvancedTools) ) {
        hideIndividualInputField('#inputAnimate' + itemNumberOfYAxis, true);
        hideIndividualInputField('#inputAnimateCheckbox' + itemNumberOfYAxis, true);
      }
      else {
        hideIndividualInputField('#inputAnimate' + itemNumberOfYAxis, false);
        hideIndividualInputField('#inputAnimateCheckbox' + itemNumberOfYAxis, false);
        updateLocalStorage('inputAnimate' + itemNumberOfYAxis, false);
        $('#inputAnimate' + itemNumberOfYAxis).prop('checked', false);
      }
    }
}
  
function userUpdateOTYAxisItem(itemNumberOfYAxis, nameOfUnderline) {
    updateLocalStorage('selectedHighlightOTVerbItem' + itemNumberOfYAxis, canvasUnderlineName[nameOfUnderline]);
    creatUlForOTYAxis(itemNumberOfYAxis);
}
  
function updateUlForAllInstancesOfYAxisItem(nameOfYAxisItem, srcImgObj, color) {
    var indexOfYAxisItem, orderOfCurrentXAxisItem;
    if (c4.xAxisForMood)
      indexOfYAxisItem = _.find(tenseIndexArray, function(obj) { return obj.name == nameOfYAxisItem; }).array;
    else 
      indexOfYAxisItem = _.find(moodIndexArray, function(obj) { return obj.name == nameOfYAxisItem; }).array;
    for (var j = 0; j < indexOfYAxisItem.length; j += 1) {
      var index = indexOfYAxisItem[j];
      orderOfCurrentXAxisItem = getAxisOrderOfCSS(ulVerbCSS[index].name, 'X');
      var color = c4['inputColorVerbItem' + orderOfCurrentXAxisItem];
      updateUlForSpecificYAxis(ulVerbCSS[index], srcImgObj, color, index);
    }
}
  
function userSwapAxis() {
    c4.xAxisForMood = !c4.xAxisForMood;
    localStorage.setItem('colorCode-CurrentSettings', JSON.stringify(c4));
    $('#sortAxisModal .close').click();
    var element = document.getElementById('sortAxisModal');
    element.parentNode.removeChild(element);
    updateAllSettingsAndInputFields();
  }
  
function userSortAxis(axis) {
    axisUserSelectedToSort = axis;
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
    axisUserSelectedToSort = axis;
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
        c4['granularControlOfOT' + axis + 'Axis'] = !c4['granularControlOfOT' + axis + 'Axis'];
        updateLocalStorage('granularControlOfOT' + axis + 'Axis', c4['granularControlOfOT' + axis + 'Axis']);
      }
      else {
        c4['ot' + axis + 'AxisOnOff'][index] = !c4['ot' + axis + 'AxisOnOff'][index];
        updateLocalStorage('ot' + axis + 'AxisOnOff', c4['ot' + axis + 'AxisOnOff']);
      }
    }
    else {
      var moodOrTense;
      if ((c4.xAxisForMood && axis == 'X') ||
          (!c4.xAxisForMood && axis == 'Y')) 
        moodOrTense = 'moods';
      else moodOrTense = 'tenses';
      if (index == null)
        updateLocalStorage('granularControlOf' + upCaseFirst(moodOrTense), !c4['granularControlOf' + upCaseFirst(moodOrTense)]);
      else {
        c4[moodOrTense + 'OnOff'][index] = !c4[moodOrTense + 'OnOff'][index];
        updateLocalStorage(moodOrTense + 'OnOff', c4[moodOrTense + 'OnOff']);
      }
    }
    enableOrDisableAxisConfigButtons(axis, otPrefix);
    refreshForAllInstancesOfTense();
}

function userToggleColorGrammar(grammarFunction) {
    var checkedValue;
    if (document.getElementById(grammarFunction + 'onoffswitch').checked) checkedValue = true;
    else checkedValue = false;
    if (grammarFunction === 'verb') {
      updateLocalStorage('enableGreekVerbColor', checkedValue);
      updateVerbInputFields(checkedValue);
    }
    else if (grammarFunction === 'gennum') {
      updateNounInputFields(checkedValue);
      updateLocalStorage('enableGenderNumberColor', checkedValue);
      userTurnGenderNumberFromOffToOn = checkedValue;
    }
    else if (grammarFunction === 'OTverb') {
      updateLocalStorage('enableOTVerbColor', checkedValue);
      updateVerbInputFields(checkedValue, 'OT');
    }
    refreshForAllInstancesOfTense();
    if ((grammarFunction === 'verb') && (checkedValue) && (handleOfRequestedAnimation === -1)) goAnimate();
}

function userUpdateColor(itemNumber, color) {
    var robinsonCode, itemIndexArray, orderInYAxis;
    updateLocalStorage('inputColorVerbItem' + itemNumber, color);
    if (c4.xAxisForMood) {
      robinsonCode = robinsonCodeOfMood;
      itemIndexArray = moodIndexArray;
    }
    else {
      robinsonCode = robinsonCodeOfTense;
      itemIndexArray = tenseIndexArray;
    }
    var r = getVerbItemsCombinedWithCurrentItem('X', itemNumber);
    for (counter = 0; counter < r.codeOfItemCombinedWithCurrentItem.length; counter ++) {
      var currentItemName = robinsonCode[r.codeOfItemCombinedWithCurrentItem[counter]];
      var arrayIdxWithCurrentItem = _.find(itemIndexArray, function(obj) { return obj.name == currentItemName; }).array;
      for (var i = 0; i < arrayIdxWithCurrentItem.length; i += 1) {
        var indexToUlVerbCSS = arrayIdxWithCurrentItem[i];
        orderInYAxis = getAxisOrderOfCSS(ulVerbCSS[indexToUlVerbCSS].name, 'Y');
        var selectedUnderline = underlineCanvasName[c4['selectedHighlightVerbItem' + orderInYAxis]];
        var srcImgObj = _.find(uLBASEIMGS, function(obj) { return obj.name == selectedUnderline; });
        updateUlForSpecificYAxis(ulVerbCSS[indexToUlVerbCSS], srcImgObj, color, indexToUlVerbCSS);
      }
    }
}
  
function userUpdateOTColor(itemNumber, color) {
    updateLocalStorage('inputColorOTVerbItem' + itemNumber, color);
    var numOfRows = getVariablesForOTVerbTable('H').orderOfYAxisItems.length;
    var numOfColumns = getVariablesForOTVerbTable('H').orderOfXAxisItems.length;
    for (var counter1 = 0; counter1 < numOfRows; counter1++) {
      creatUlForOTYAxis(counter1, numOfRows, numOfColumns);
    }
}
  
function userUpdateNounColor(gender, color) {
    updateLocalStorage('inputColor' + upCaseFirst(gender), color);
    var cssName = '';
    if (gender === 'masculine') cssName = '.mas';
    else if (gender === 'feminine') cssName = '.fem';
    else if (gender === 'neuter') cssName = '.neut';
    $(cssName).css({
      'color': color
    });
    updatedGenderNumberCSS = true;
}
  
  function userUpdateNumber(type, fontHighlight) {
    updateLocalStorage('selectedHighlight' + upCaseFirst(type), fontHighlight);
    updateCssForNumber(type, fontHighlight);
}

function userUpdateAnimation(itemNumber) {
    var arrayIndexOfCSSRelatedToItemSelected = [];
    var currentULForItem = c4['selectedHighlightVerbItem' + itemNumber];
    var tempIndexArray;
    if (c4.xAxisForMood) tempIndexArray = tenseIndexArray;
    else tempIndexArray = moodIndexArray;
    var r = getVerbItemsCombinedWithCurrentItem('Y', itemNumber);
    for (i = 0; i < r.nameOfItemCombinedWithCurrentItem.length; i ++) {
      arrayIndexOfCSSRelatedToItemSelected = arrayIndexOfCSSRelatedToItemSelected.concat( 
        _.find(tempIndexArray, function(obj) { return obj.name == r.nameOfItemCombinedWithCurrentItem[i]; }).array );
    }
    if ((document.getElementById('inputAnimateCheckbox' + itemNumber).checked) &&
      (currentULForItem !== '2 lines') && (currentULForItem !== 'Underline')) {
      updateLocalStorage('inputAnimate' + itemNumber, true);
      for (var j = 0; j < arrayIndexOfCSSRelatedToItemSelected.length; j += 1) {
        var indexToUlVerbCSS = arrayIndexOfCSSRelatedToItemSelected[j];
        if (animationIndexArray.indexOf(indexToUlVerbCSS) === -1) animationIndexArray.push(indexToUlVerbCSS);
      }
    } else {
      updateLocalStorage('inputAnimate' + itemNumber, false);
      for (var k = 0; k < arrayIndexOfCSSRelatedToItemSelected.length; k += 1) {
        var indexToUlVerbCSS = arrayIndexOfCSSRelatedToItemSelected[k];
        var tempIdx = animationIndexArray.indexOf(indexToUlVerbCSS);
        if (indexToUlVerbCSS >= 0) animationIndexArray.splice(tempIdx, 1);
      }
    }
    copyOfpassiveIndexArray = passiveIndexArray.slice(0);
    copyOfmiddleIndexArray = middleIndexArray.slice(0);
    for (var counter = 0; counter < animationIndexArray.length; counter += 1) {
      var tempIndex1 = animationIndexArray[counter];
      var tempIndex2 = copyOfpassiveIndexArray.indexOf(tempIndex1);
      if (tempIndex2 >= 0) copyOfpassiveIndexArray.splice(tempIndex2, 1);
      tempIndex2 = copyOfmiddleIndexArray.indexOf(tempIndex1);
      if (tempIndex2 >= 0) copyOfmiddleIndexArray.splice(tempIndex2, 1);
    }
    if ((animationIndexArray.length > 0) && (handleOfRequestedAnimation === -1))
      goAnimate();
}

function userUpdatePassiveMiddleVoiceBackground(voice, otVerb) {
    var otPrefix = '';
    if ((otVerb != undefined) && (otVerb != '')) otPrefix = otVerb;
    var ucVoice = upCaseFirst(voice);
    if (document.getElementById('inputCheckbox' + otPrefix + ucVoice + 'BackgroundColor').checked) {
      updateLocalStorage('inputCheckbox' + otPrefix + ucVoice + 'BackgroundColorCheckValue', true);
      $('#input' + otPrefix + ucVoice + 'BackgroundColor').spectrum('enable');
    } else {
      updateLocalStorage('inputCheckbox' + otPrefix + ucVoice + 'BackgroundColorCheckValue', false);
      $('#input' + otPrefix + ucVoice + 'BackgroundColor').spectrum('disable');
    }
    if (otVerb == 'OT') createUlForOT();
    else updateVerbsBackground(voice);
}
  
function userEnablePassiveMiddleVerbsUnderline1(voice, otVerb) {
    var otPrefix = '';
    if ((otVerb != undefined) && (otVerb != '')) otPrefix = otVerb;
    var ucVoice = upCaseFirst(voice);
    if (document.getElementById('inputCheckbox' + otPrefix + ucVoice + 'UlColor1').checked) {
      updateLocalStorage('inputCheckbox' + otPrefix + ucVoice + 'UlColor1CheckValue', true);
      updateLocalStorage('inputCheckbox' + otPrefix + ucVoice + 'UlColor2', true);
      $('#input' + otPrefix + ucVoice + 'UlColor1').spectrum('enable');
      $('#inputCheckbox' + otPrefix + ucVoice + 'UlColor2').show();
      $('#inputCheckbox' + otPrefix + ucVoice + 'UlColor2').prop('disabled', false);
      userEnablePassiveMiddleVerbsUnderline2(voice, otVerb);
    } else {
      updateLocalStorage('inputCheckbox' + otPrefix + ucVoice + 'UlColor1CheckValue', false);
      updateLocalStorage('inputCheckbox' + otPrefix + ucVoice + 'UlColor2', false);
      $('#input' + otPrefix + ucVoice + 'UlColor1').spectrum('disable');
      $('#input' + otPrefix + ucVoice + 'UlColor1').hide();
      $('#inputCheckbox' + otPrefix + ucVoice + 'UlColor2').hide();
      $('#inputCheckbox' + otPrefix + ucVoice + 'UlColor2').prop('disabled', true);
      $('#input' + otPrefix + ucVoice + 'UlColor2').spectrum('disable');
    }
    if (otVerb == 'OT') createUlForOT();
    else updateVerbsBackground(voice);
}
  
function userEnablePassiveMiddleVerbsUnderline2(voice, otVerb) {
    var otPrefix = '';
    if ((otVerb != undefined) && (otVerb != '')) return;
    var ucVoice = upCaseFirst(voice);
    if (document.getElementById('inputCheckbox' + otPrefix + ucVoice + 'UlColor2').checked) {
      updateLocalStorage('inputCheckbox' + otPrefix + ucVoice + 'UlColor2CheckValue', true);
      $('#input' + otPrefix + ucVoice + 'UlColor2').spectrum('enable');
      if (handleOfRequestedAnimation === -1) goAnimate();
    } else {
      updateLocalStorage('inputCheckbox' + otPrefix + ucVoice + 'UlColor2CheckValue', false);
      $('#input' + otPrefix + ucVoice + 'UlColor2').spectrum('disable');
    }
}

/*function userToggleAdvancedTools(ot) {
  var otPrefix = '';
  if ((ot != undefined) && (ot == 'OT')) otPrefix = 'OT';
  c4['enable' + otPrefix + 'AdvancedTools'] = !c4['enable' + otPrefix + 'AdvancedTools'];
  updateLocalStorage('enable' + otPrefix + 'AdvancedTools', c4['enable' + otPrefix + 'AdvancedTools']);
  enableOrDisableAdvancedToolsButtons(otPrefix);
  updateHtmlForYAxis();
}*/

function enableOrDisableVerbAndNounButtons() {
    var checkedValue = c4.enableGreekVerbColor;
    $('#verbonoffswitch').prop('checked', checkedValue);
    updateVerbInputFields(checkedValue);
    checkedValue = c4.enableGenderNumberColor;
    $('#gennumonoffswitch').prop('checked', checkedValue);
    updateNounInputFields(checkedValue);
    checkedValue = c4.enableOTVerbColor;
    updateVerbInputFields(checkedValue, 'OT');
    $('#OTverbonoffswitch').prop('checked', checkedValue);
}
  
function enableOrDisableAxisConfigButtons(axis, ot) {
    var otPrefix = ''
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
      var granularControlOfAxis = c4['granularControlOf' + ucMoodOrTense +'s'];
      var itemInAxisOnOff = c4[moodOrTense + 'sOnOff'];
      var ulVerbCSSArrayOfAxis = window[moodOrTense + 'IndexArray']
      var itemToCombineWithPrevious = c4[moodOrTense + 'ToCombineWithPrevious'];
      highlightIcon(iconName, granularControlOfAxis);
      hideIndividualInputField(onOffClassName, granularControlOfAxis);
      for (var i = 0; i < orderOfItemsInAxis.length; i += 1) {
        $('#' + onOffCheckBox + i).prop('checked', granularControlOfAxis && itemInAxisOnOff[i]);
      }
      if (granularControlOfAxis) {
        var k = -1;
        for (var i = 0; i < nameOfAllItemsInAxis.length; i ++) {
          if (!itemToCombineWithPrevious[i]) k++;
          var currentItemInAxisOnOff = itemInAxisOnOff[k];
          index2 = _.find(ulVerbCSSArrayOfAxis, function(obj) { return obj.name == nameOfAllItemsInAxis[i]; }).array;
          for (var j = 0; j < index2.length; j += 1) {
            ulVerbCSS[index2[j]]['displayStatusSelectedBy' + ucMoodOrTense] = currentItemInAxisOnOff;
          }
        }
      }
      else {
        for (k = 0; k < ulVerbCSS.length; k ++) {
          ulVerbCSS[k]['displayStatusSelectedBy' + ucMoodOrTense] = true;
        }
      }
    }
    else if (otPrefix == 'OT') {
      var granularControlOfAxis = c4['granularControlOfOT' + axis +'Axis'];
      var itemInAxisOnOff = c4['ot' + axis + 'AxisOnOff'];
      highlightIcon(iconName, granularControlOfAxis);
      hideIndividualInputField(onOffClassName, granularControlOfAxis);
      if (axis == 'Y')
        for (var j = 0; j < ulOTVbCSS.length; j += 1) {
          $('#' + onOffCheckBox + j).prop('checked', granularControlOfAxis && c4.otYAxisOnOff[j]);
        }
      else if (axis == 'X') {
        for (var k = 0; k < ulOTVbCSS[0].length; k += 1) {
          if ((k % 3) == 0) $('#' + onOffCheckBox + (k/3)).prop('checked', granularControlOfAxis && c4.otXAxisOnOff[k/3]);
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
    var otPrefix = '';
    if ((ot != undefined) && (ot == 'OT')) otPrefix = 'OT';
  //  highlightIcon('#' + otPrefix + 'advancedToolsIcon', c4['enable' + otPrefix + 'AdvancedTools']);
    hideIndividualInputField('.' + otPrefix + 'advancedtools', c4['enable' + otPrefix + 'AdvancedTools']);
}

function checkNounColor() {
    var currentColorPicker = $('#inputColorMasculine').spectrum('get').toHexString();
    if (c4.inputColorMasculine != currentColorPicker) 
      userUpdateNounColor('masculine', currentColorPicker);
    currentColorPicker = $('#inputColorFeminine').spectrum('get').toHexString();
    if (c4.inputColorFeminine != currentColorPicker) 
      userUpdateNounColor('feminine', currentColorPicker);
    currentColorPicker = $('#inputColorNeuter').spectrum('get').toHexString();
    if (c4.inputColorNeuter != currentColorPicker) 
      userUpdateNounColor('feminine', currentColorPicker);
}
  
function checkVerbColorInput() {
    for (var i = 0; i < getVariablesForVerbTable().orderOfXAxisItems.length; i ++) {
      var currentColor = c4['inputColorVerbItem' + i];
      var currentColorPicker = $('#inputColorVerbItem' + i).spectrum("get").toHexString();
      if (currentColor != currentColorPicker) userUpdateColor(i, currentColorPicker);
    }
    for (var i = 0; i < getVariablesForOTVerbTable('H').orderOfXAxisItems.length; i ++) {
      var currentColor = c4['inputColorOTVerbItem' + i];
      var currentColorPicker = $('#inputColorOTVerbItem' + i).spectrum("get").toHexString();
      if (currentColor != currentColorPicker) userUpdateOTColor(i, currentColorPicker);
    }
    var currentColor = c4.inputMiddleBackgroundColor;
    var currentColorPicker = $('#inputMiddleBackgroundColor').spectrum("get").toHexString();
    var colorForMiddleWasUpdated = false;
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputMiddleBackgroundColor', currentColorPicker);
      colorForMiddleWasUpdated = true;
    }
    currentColor = c4.inputMiddleUlColor1;
    currentColorPicker = $('#inputMiddleUlColor1').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputMiddleUlColor1', currentColorPicker);
      colorForMiddleWasUpdated = true;
    }
    currentColor = c4.inputMiddleUlColor2;
    currentColorPicker = $('#inputMiddleUlColor2').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputMiddleUlColor2', currentColorPicker);
      colorForMiddleWasUpdated = true;
    }
    if (colorForMiddleWasUpdated) updateVerbsBackground('middle');
    currentColor = c4.inputPassiveBackgroundColor;
    currentColorPicker = $('#inputPassiveBackgroundColor').spectrum("get").toHexString();
    var colorForPassiveWasUpdated = false;
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputPassiveBackgroundColor', currentColorPicker);
      colorForPassiveWasUpdated = true;
    }
    currentColor = c4.inputPassiveUlColor1;
    currentColorPicker = $('#inputPassiveUlColor1').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputPassiveUlColor1', currentColorPicker);
      colorForPassiveWasUpdated = true;
    }
    currentColor = c4.inputPassiveUlColor2;
    currentColorPicker = $('#inputPassiveUlColor2').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputPassiveUlColor2', currentColorPicker);
      colorForPassiveWasUpdated = true;
    }
    if (colorForPassiveWasUpdated) updateVerbsBackground('passive');
    var currentColor = c4.inputMiddleBackgroundColor;
    var currentColorPicker = $('#inputMiddleBackgroundColor').spectrum("get").toHexString();
    var colorForMiddleWasUpdated = false;
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputMiddleBackgroundColor', currentColorPicker);
      colorForMiddleWasUpdated = true;
    }
    currentColor = c4.inputMiddleUlColor1;
    currentColorPicker = $('#inputMiddleUlColor1').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputMiddleUlColor1', currentColorPicker);
      colorForMiddleWasUpdated = true;
    }
    currentColor = c4.inputMiddleUlColor2;
    currentColorPicker = $('#inputMiddleUlColor2').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputMiddleUlColor2', currentColorPicker);
      colorForMiddleWasUpdated = true;
    }
    if (colorForMiddleWasUpdated) updateVerbsBackground('middle');
    currentColor = c4.inputPassiveBackgroundColor;
    currentColorPicker = $('#inputPassiveBackgroundColor').spectrum("get").toHexString();
    var colorForPassiveWasUpdated = false;
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputPassiveBackgroundColor', currentColorPicker);
      colorForPassiveWasUpdated = true;
    }
    currentColor = c4.inputPassiveUlColor1;
    currentColorPicker = $('#inputPassiveUlColor1').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputPassiveUlColor1', currentColorPicker);
      colorForPassiveWasUpdated = true;
    }
    currentColor = c4.inputPassiveUlColor2;
    currentColorPicker = $('#inputPassiveUlColor2').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputPassiveUlColor2', currentColorPicker);
      colorForPassiveWasUpdated = true;
    }
    if (colorForPassiveWasUpdated) updateVerbsBackground('passive');
  
  
    currentColor = c4.inputOTMiddleBackgroundColor;
    currentColorPicker = $('#inputOTMiddleBackgroundColor').spectrum("get").toHexString();
    var colorForOTWasUpdated = false;
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputOTMiddleBackgroundColor', currentColorPicker);
      colorForOTWasUpdated = true;
    }
    currentColor = c4.inputOTMiddleUlColor1;
    currentColorPicker = $('#inputOTMiddleUlColor1').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputOTMiddleUlColor1', currentColorPicker);
      colorForOTWasUpdated = true;
    }
  /*  currentColor = c4.inputOTMiddleUlColor2;
    currentColorPicker = $('#inputOTMiddleUlColor2').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputOTMiddleUlColor2', currentColorPicker);
      colorForOTWasUpdated = true;
    } */
    currentColor = c4.inputOTPassiveBackgroundColor;
    currentColorPicker = $('#inputOTPassiveBackgroundColor').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputOTPassiveBackgroundColor', currentColorPicker);
      colorForOTWasUpdated = true;
    }
    currentColor = c4.inputOTPassiveUlColor1;
    currentColorPicker = $('#inputOTPassiveUlColor1').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputOTPassiveUlColor1', currentColorPicker);
      colorForOTWasUpdated = true;
    }
  /*  currentColor = c4.inputOTPassiveUlColor2;
    currentColorPicker = $('#inputOTPassiveUlColor2').spectrum("get").toHexString();
    if (currentColor != currentColorPicker) {
      updateLocalStorage('inputOTPassiveUlColor2', currentColorPicker);
      colorForOTWasUpdated = true;
    } */
    if (colorForOTWasUpdated) createUlForOT();
}

function updateHtmlForYAxis() {
    var numOfRows = getVariablesForVerbTable().nameOfYAxisItems.length;
    for (var i = 0; i < numOfRows; i += 1) {
      var currentULForItem = c4['selectedHighlightVerbItem' + i];
      $('#selectedHighlightVerbItem' + i + ' option')
        .filter(function() {
          return $.trim($(this).text()) == currentULForItem;
        })
        .prop('selected', true);
      var temp = ((currentULForItem !== '2 lines') && (currentULForItem !== 'Underline') && (c4.enableAdvancedTools) );
      hideIndividualInputField('#inputAnimate' + i, temp);
      hideIndividualInputField('#inputAnimateCheckbox' + i, temp);
      if ((c4['inputAnimate' + i]) && (c4.enableAdvancedTools)) {
        document.getElementById('inputAnimateCheckbox' + i).checked = true;
        if ((currentULForItem !== '2 lines') && (currentULForItem !== 'Underline'))
          userUpdateAnimation(i);
      } else document.getElementById('inputAnimateCheckbox' + i).checked = false;
    }
    numOfRows = getVariablesForOTVerbTable('H').nameOfYAxisItems.length;
    for (var i = 0; i < numOfRows; i += 1) {
      var currentULForItem = c4['selectedHighlightOTVerbItem' + i];
      $('#selectedHighlightOTVerbItem' + i + ' option')
        .filter(function() {
          return $.trim($(this).text()) == currentULForItem;
        })
        .prop('selected', true);
    }
  }
  
function updateHtmlForXAxis() {
    var numOfColumns = getVariablesForVerbTable().orderOfXAxisItems.length;
    if (numOfColumns > -1) 
      $('#inputColorVerbItem0').spectrum({
        color: c4.inputColorVerbItem0,
        showInput: true,
        preferredFormat: 'hex',
        clickoutFiresChange: false,
        change: function(color) {
          userUpdateColor(0, color.toHexString());
        },
        show: function(color) {
          checkVerbColorInput();
        }
      });
    if (numOfColumns > 0) 
      $('#inputColorVerbItem1').spectrum({
        color: c4.inputColorVerbItem1,
        showInput: true,
        preferredFormat: 'hex',
        clickoutFiresChange: false,
        change: function(color) {
          userUpdateColor(1, color.toHexString());
        },
        show: function(color) {
          checkVerbColorInput();
        }
      });
    if (numOfColumns > 1) 
      $('#inputColorVerbItem2').spectrum({
        color: c4.inputColorVerbItem2,
        showInput: true,
        preferredFormat: 'hex',
        clickoutFiresChange: false,
        change: function(color) {
          userUpdateColor(2, color.toHexString());
        },
        show: function(color) {
          checkVerbColorInput();
        }
      });
    if (numOfColumns > 2) 
      $('#inputColorVerbItem3').spectrum({
        color: c4.inputColorVerbItem3,
        showInput: true,
        preferredFormat: 'hex',
        clickoutFiresChange: false,
        change: function(color) {
          userUpdateColor(3, color.toHexString());
        },
        show: function(color) {
          checkVerbColorInput();
        }
      });
    if (numOfColumns > 3)
      $('#inputColorVerbItem4').spectrum({
        color: c4.inputColorVerbItem4,
        showInput: true,
        preferredFormat: 'hex',
        clickoutFiresChange: false,
        change: function(color) {
          userUpdateColor(4, color.toHexString());
        },
        show: function(color) {
          checkVerbColorInput();
        }
      });
    if (numOfColumns > 4)
      $('#inputColorVerbItem5').spectrum({
        color: c4.inputColorVerbItem5,
        showInput: true,
        preferredFormat: 'hex',
        clickoutFiresChange: false,
        change: function(color) {
          userUpdateColor(5, color.toHexString());
        },
        show: function(color) {
          checkVerbColorInput();
        }  
      });
    numOfColumns = getVariablesForOTVerbTable('H').orderOfXAxisItems.length;
    if (numOfColumns > -1) 
      $('#inputColorOTVerbItem0').spectrum({
        color: c4.inputColorOTVerbItem0,
        showInput: true,
        preferredFormat: 'hex',
        clickoutFiresChange: false,
        change: function(color) {
          userUpdateOTColor(0, color.toHexString());
        },
        show: function(color) {
          checkVerbColorInput('OT');
        }
      });
    if (numOfColumns > 0) 
      $('#inputColorOTVerbItem1').spectrum({
        color: c4.inputColorOTVerbItem1,
        showInput: true,
        preferredFormat: 'hex',
        clickoutFiresChange: false,
        change: function(color) {
          userUpdateOTColor(1, color.toHexString());
        },
        show: function(color) {
          checkVerbColorInput('OT');
        }
      });
    if (numOfColumns > 1) 
      $('#inputColorOTVerbItem2').spectrum({
        color: c4.inputColorOTVerbItem2,
        showInput: true,
        preferredFormat: 'hex',
        clickoutFiresChange: false,
        change: function(color) {
          userUpdateOTColor(2, color.toHexString());
        },
        show: function(color) {
          checkVerbColorInput('OT');
        }
      });
    if (numOfColumns > 2) 
      $('#inputColorOTVerbItem3').spectrum({
        color: c4.inputColorOTVerbItem3,
        showInput: true,
        preferredFormat: 'hex',
        clickoutFiresChange: false,
        change: function(color) {
          userUpdateOTColor(3, color.toHexString());
        },
        show: function(color) {
          checkVerbColorInput('OT');
        }
      });
    if (numOfColumns > 3)
      $('#inputColorOTVerbItem4').spectrum({
        color: c4.inputColorOTVerbItem4,
        showInput: true,
        preferredFormat: 'hex',
        clickoutFiresChange: false,
        change: function(color) {
          userUpdateOTColor(4, color.toHexString());
        },
        show: function(color) {
          checkVerbColorInput('OT');
        }
      });
    if (numOfColumns > 4)
      $('#inputColorOTVerbItem5').spectrum({
        color: c4.inputColorOTVerbItem5,
        showInput: true,
        preferredFormat: 'hex',
        clickoutFiresChange: false,
        change: function(color) {
          userUpdateOTColor(5, color.toHexString());
        },
        show: function(color) {
          checkVerbColorInput('OT');
        }  
      });
  }
  
  function updateHtmlForGender() {
    $('#inputColorMasculine').spectrum({
      color: c4.inputColorMasculine,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateNounColor('masculine', color.toHexString());
      },
      show: function(color) {
        checkNounColor();
      }
    });
    $('#inputColorFeminine').spectrum({
      color: c4.inputColorFeminine,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateNounColor('feminine', color.toHexString());
      },
      show: function(color) {
        checkNounColor();
      }
    });
    $('#inputColorNeuter').spectrum({
      color: c4.inputColorNeuter,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        userUpdateNounColor('neuter', color.toHexString());
      },
      show: function(color) {
        checkNounColor();
      }
    });
  }
  
  function updateHtmlForNumber() {
    $('#selectedHighlightPlural option')
      .filter(function() {
        return $.trim($(this).text()) == upCaseFirst(c4.selectedHighlightPlural);
      })
      .attr('selected', true);
    $('#selectedHighlightSingular option')
      .filter(function() {
        return $.trim($(this).text()) == upCaseFirst(c4.selectedHighlightSingular);
      })
      .attr('selected', true);
  }
  
  function updateHtmlForPassiveBackgroundColor() {
    $('#inputPassiveBackgroundColor').spectrum({
      color: c4.inputPassiveBackgroundColor,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        updateLocalStorage('inputPassiveBackgroundColor', color.toHexString());
        updateVerbsBackground('passive');
      },
      show: function(color) {
        checkVerbColorInput();
      }
    });
    $('#inputPassiveUlColor1').spectrum({
      color: c4.inputPassiveUlColor1,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        updateLocalStorage('inputPassiveUlColor1', color.toHexString());
        updateVerbsBackground('passive');
      },
      show: function(color) {
        checkVerbColorInput();
      }
    });
    $('#inputPassiveUlColor2').spectrum({
      color: c4.inputPassiveUlColor2,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        updateLocalStorage('inputPassiveUlColor2', color.toHexString());
        updateVerbsBackground('passive');
      },
      show: function(color) {
        checkVerbColorInput();
      }
    });
  
    $('#inputOTPassiveBackgroundColor').spectrum({
      color: c4.inputOTPassiveBackgroundColor,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        updateLocalStorage('inputOTPassiveBackgroundColor', color.toHexString());
        createUlForOT();
      },
      show: function(color) {
        checkVerbColorInput();
      }
    });
    $('#inputOTPassiveUlColor1').spectrum({
      color: c4.inputOTPassiveUlColor1,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        updateLocalStorage('inputOTPassiveUlColor1', color.toHexString());
        createUlForOT();
      },
      show: function(color) {
        checkVerbColorInput();
      }
    });
  /*  $('#inputOTPassiveUlColor2').spectrum({
      color: c4.inputOTPassiveUlColor2,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        updateLocalStorage('inputOTPassiveUlColor2', color.toHexString());
        createUlForOT();
      },
      show: function(color) {
        checkVerbColorInput();
      }
    }); */
  
  
}
  
function updateHtmlForMiddleBackgroundColor() {
    $('#inputMiddleBackgroundColor').spectrum({
      color: c4.inputMiddleBackgroundColor,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        updateLocalStorage('inputMiddleBackgroundColor', color.toHexString());
        updateVerbsBackground('middle');
      },
      show: function(color) {
        checkVerbColorInput();
      }
    });
    $('#inputMiddleUlColor1').spectrum({
      color: c4.inputMiddleUlColor1,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        updateLocalStorage('inputMiddleUlColor1', color.toHexString());
        updateVerbsBackground('middle');
      },
      show: function(color) {
        checkVerbColorInput();
      }
    });
    $('#inputMiddleUlColor2').spectrum({
      color: c4.inputMiddleUlColor2,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        updateLocalStorage('inputMiddleUlColor2', color.toHexString());
        updateVerbsBackground('middle');
      },
      show: function(color) {
        checkVerbColorInput();
      }
    });
  
    $('#inputOTMiddleBackgroundColor').spectrum({
      color: c4.inputOTMiddleBackgroundColor,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        updateLocalStorage('inputOTMiddleBackgroundColor', color.toHexString());
        createUlForOT();
      },
      show: function(color) {
        checkVerbColorInput();
      }
    });
    $('#inputOTMiddleUlColor1').spectrum({
      color: c4.inputOTMiddleUlColor1,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        updateLocalStorage('inputOTMiddleUlColor1', color.toHexString());
        createUlForOT();
      },
      show: function(color) {
        checkVerbColorInput();
      }
    });
  /*  $('#inputOTMiddleUlColor2').spectrum({
      color: c4.inputOTMiddleUlColor2,
      showInput: true,
      preferredFormat: 'hex',
      clickoutFiresChange: false,
      change: function(color) {
        updateLocalStorage('inputOTMiddleUlColor2', color.toHexString());
        createUlForOT();
      },
      show: function(color) {
        checkVerbColorInput();
      }
    }); */
  
}
  
function hideOrShowHtmlForPassiveBackgroundColor(passiveBackgroundName) {
    var ucPassiveBackgroundName = upCaseFirst(passiveBackgroundName);
    var checkedValue = c4['inputCheckbox' + ucPassiveBackgroundName + 'CheckValue'];
    $('#inputCheckbox' + ucPassiveBackgroundName).prop('checked', checkedValue);
    if (c4['inputCheckbox' + ucPassiveBackgroundName]) {
      $('#inputCheckbox' + ucPassiveBackgroundName).show();
      $('#inputCheckbox' + ucPassiveBackgroundName).prop('disabled', false);
      if ($('#input' + ucPassiveBackgroundName).length) {
        if (checkedValue) $('#input' + ucPassiveBackgroundName).spectrum('enable');
        else $('#input' + ucPassiveBackgroundName).spectrum('disable');
      }
    } else {
      $('#inputCheckbox' + ucPassiveBackgroundName).hide();
      $('#inputCheckbox' + ucPassiveBackgroundName).prop('disabled', true);
      if ($('#input' + ucPassiveBackgroundName).length)
        $('#input' + ucPassiveBackgroundName).spectrum('disable');
    }
}

function cancelColorChanges() {
    if (typeof(Storage) !== 'undefined') {
      var previousEnableGenderNumberColor = c4.enableGenderNumberColor;
      var tmp = localStorage.getItem('colorCode-PreviousSettings');
      if (tmp) c4 = JSON.parse(tmp);
      else c4 = JSON.parse(JSON.stringify(defaultC4));
      localStorage.setItem('colorCode-CurrentSettings', JSON.stringify(c4));
      if ((!previousEnableGenderNumberColor) && (c4.enableGenderNumberColor)) userTurnGenderNumberFromOffToOn = true;
      alert('Your color settings has been reset to your previous setting.');
      updateAllSettingsAndInputFields();
    }
}
  
function resetColorConfig() {
    if (typeof(Storage) !== 'undefined') {
      var previousEnableGenderNumberColor = c4.enableGenderNumberColor;
      c4 = JSON.parse(JSON.stringify(defaultC4));
      localStorage.setItem('colorCode-CurrentSettings', JSON.stringify(c4));
      if ((!previousEnableGenderNumberColor) && (c4.enableGenderNumberColor)) userTurnGenderNumberFromOffToOn = true;
      alert('Your color settings has been reset to default setting.');
      updateAllSettingsAndInputFields();
    }
}
  
function closeColorConfig() {
  $('#theGrammarColorModal').modal('hide');
  $('#theGrammarColorModal').modal({
    show: 'false'
  });
  var element = document.getElementById('theGrammarColorModal');
  element.parentNode.removeChild(element);
}

function updateAllSettingsAndInputFields() {
    animationIndexArray = [];
    copyOfpassiveIndexArray = passiveIndexArray.slice(0);
    copyOfmiddleIndexArray = middleIndexArray.slice(0);
    updateVerbsBackground('active');
    updateVerbsBackground('passive');
    updateVerbsBackground('middle');
    createUlForAllItemsInYAndX();
    createUlForOT();
    $('#theGrammarColorModal').modal({
      show: 'false'
    });
    if ($.getUrlVars().indexOf("debug") == -1) 
      $('#theGrammarColorModal').modal('show').find('.modal-content').load('/color_code_grammar.min.html');
    else 
      $('#theGrammarColorModal').modal('show').find('.modal-content').load('/color_code_grammar.html');
}
  
function updateNounInputFields(inputOnOff) {
    hideIndividualInputField('.nInptN', inputOnOff);
    hideOrDisplayIndividualColorInputField('.nInptC', inputOnOff);
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
  
function hideOrDisplayIndividualColorInputField(fieldName, inputOnOff) {
    if (inputOnOff) $(fieldName).spectrum('enable');
    else $(fieldName).spectrum('disable');
}
  
function updateVerbInputFields(inputOnOff, ot) {
    var otPrefix = '';
    if ((ot != undefined) && (ot == 'OT')) otPrefix = 'OT';
  
    hideOrDisplayIndividualColorInputField('.' + otPrefix + 'vrbInptC', inputOnOff);
    hideIndividualInputField('.' + otPrefix + 'vrbInpt1', inputOnOff);
  //  hideIndividualInputField('#advancedToolsBtn', inputOnOff);
    if (otPrefix != 'OT') {
      var showAnimationCheckbox = c4.enableAdvancedTools && inputOnOff;
      hideIndividualInputField('#inputAnimate0', showAnimationCheckbox, true);
      hideIndividualInputField('#inputAnimate1', showAnimationCheckbox, true);
      hideIndividualInputField('#inputAnimate2', showAnimationCheckbox, true);
      hideIndividualInputField('#inputAnimate3', showAnimationCheckbox, true);
      hideIndividualInputField('#inputAnimate4', showAnimationCheckbox, true);
      hideIndividualInputField('#inputAnimate5', showAnimationCheckbox, true);
      hideIndividualInputField('#inputAnimateCheckbox0', showAnimationCheckbox, true);
      hideIndividualInputField('#inputAnimateCheckbox1', showAnimationCheckbox, true);
      hideIndividualInputField('#inputAnimateCheckbox2', showAnimationCheckbox, true);
      hideIndividualInputField('#inputAnimateCheckbox3', showAnimationCheckbox, true);
      hideIndividualInputField('#inputAnimateCheckbox4', showAnimationCheckbox, true);
      hideIndividualInputField('#inputAnimateCheckbox5', showAnimationCheckbox, true);
      if (c4.xAxisForMood) {
        hideIndividualInputField('.vrbInptX', c4.granularControlOfMoods && inputOnOff);
        hideIndividualInputField('.vrbInptY', c4.granularControlOfTenses && inputOnOff);
      }
      else {
        hideIndividualInputField('.vrbInptX', c4.granularControlOfTenses && inputOnOff);
        hideIndividualInputField('.vrbInptY', c4.granularControlOfMoods && inputOnOff);
      }
      hideOrShowHtmlForPassiveBackgroundColor('PassiveUlColor2');
      hideOrShowHtmlForPassiveBackgroundColor('MiddleUlColor2');
    }
    hideOrShowHtmlForPassiveBackgroundColor(otPrefix + 'PassiveBackgroundColor');
    hideOrShowHtmlForPassiveBackgroundColor(otPrefix + 'PassiveUlColor1');
    hideOrShowHtmlForPassiveBackgroundColor(otPrefix + 'MiddleBackgroundColor');
    hideOrShowHtmlForPassiveBackgroundColor(otPrefix + 'MiddleUlColor1');
    if (!inputOnOff) { // Turning on the passive colors is more complex and is handled by other routines.  
      hideOrDisplayIndividualColorInputField('#input' + otPrefix + 'PassiveBackgroundColor', inputOnOff);
      hideOrDisplayIndividualColorInputField('#input' + otPrefix + 'PassiveUlColor1', inputOnOff);
      hideIndividualInputField('#inputCheckbox' + otPrefix + 'PassiveBackgroundColor', inputOnOff);
      hideIndividualInputField('#inputCheckbox' + otPrefix + 'PassiveUlColor1', inputOnOff);
      hideIndividualInputField('#inputCheckboxPassiveUlColor2', inputOnOff);
      hideOrDisplayIndividualColorInputField('#input' + otPrefix + 'MiddleBackgroundColor', inputOnOff);
      hideOrDisplayIndividualColorInputField('#input' + otPrefix + 'MiddleUlColor1', inputOnOff);
      hideIndividualInputField('#inputCheckbox' + otPrefix + 'MiddleBackgroundColor', inputOnOff);
      hideIndividualInputField('#inputCheckbox' + otPrefix + 'MiddleUlColor1', inputOnOff);
      if (otPrefix != 'OT') {
        hideOrDisplayIndividualColorInputField('#inputPassiveUlColor2', inputOnOff);
        hideOrDisplayIndividualColorInputField('#inputMiddleUlColor2', inputOnOff);
        hideIndividualInputField('#inputCheckboxMiddleUlColor2', inputOnOff);
      }
    }
}

function updateVerbsBackground(voice) {
    var selectedUnderline, selectedColor;
    var indexArray = [];
    if (voice === 'passive') indexArray = passiveIndexArray;
    else if (voice === 'middle') indexArray = middleIndexArray;
    else if (voice === 'active') indexArray = activeIndexArray;
    for (var counter = 0; counter < indexArray.length; counter += 1) {
      var indexToUlVerbCSS = indexArray[counter];
      var orderOfXAxis = getAxisOrderOfCSS(ulVerbCSS[indexToUlVerbCSS].name, 'X');
      var orderOfYAxis = getAxisOrderOfCSS(ulVerbCSS[indexToUlVerbCSS].name, 'Y');
      if (c4.xAxisForMood) {
        selectedUnderline = underlineCanvasName[c4['selectedHighlightVerbItem' + orderOfYAxis]];
        selectedColor = c4['inputColorVerbItem' + orderOfXAxis];
      }
      else {
        selectedUnderline = underlineCanvasName[c4['selectedHighlightVerbItem' + orderOfXAxis]];
        selectedColor = c4['inputColorVerbItem' + orderOfYAxis];
      }
      var srcImgObj = _.find(uLBASEIMGS, function(obj) { return obj.name == selectedUnderline; });
      updateUlForSpecificYAxis(ulVerbCSS[indexToUlVerbCSS], srcImgObj, selectedColor, indexToUlVerbCSS);
    }
}
  
function getVerbItemsCombinedWithCurrentItem(axis, itemNumber) {
    var codeOfItemCombinedWithCurrentItem = [], nameOfItemCombinedWithCurrentItem = [];
    var orderOfItem, itemsCombinedWithPreviousItem, robinsonCode;
    if ( ((c4.xAxisForMood) && (axis == 'X')) ||
         ((!c4.xAxisForMood) && (axis == 'Y')) ) {
      orderOfItem = c4.orderOfMood;
      itemsCombinedWithPreviousItem = c4.moodToCombineWithPrevious;
      robinsonCode = robinsonCodeOfMood;
    }
    else {
      orderOfItem = c4.orderOfTense;
      itemsCombinedWithPreviousItem = c4.tenseToCombineWithPrevious;
      robinsonCode = robinsonCodeOfTense;
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
    }
}

function getAxisOrderOfCSS(cssName, axis) {
    var positionInOrderOfMoodOrTense, moodOrTense;
    if ( ((!c4.xAxisForMood) && (axis == 'X')) ||
         ((c4.xAxisForMood) && (axis == 'Y')) ) {
      moodOrTense = 'tense';
      positionInOrderOfMoodOrTense = c4.orderOfTense.indexOf(cssName.substr(0, 1));
    }
    else {
      moodOrTense = 'mood';
      positionInOrderOfMoodOrTense = c4.orderOfMood.indexOf(cssName.substr(2, 1));
    }
    return getAxisOrderOfItem(moodOrTense, positionInOrderOfMoodOrTense);
}