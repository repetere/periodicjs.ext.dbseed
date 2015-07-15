(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var seedpathInput,
	seedpathDisplayInput,
	previousseedInput,
	assetidInput,
	existingseedlist,
	importstatusoutputel,
	seedcustomstatusoutputel,
	importSeedSelectionEl,
	importFormContainer,
	exampleSeedSelect;


var setExistingSeed = function (value) {
	seedpathInput.value = value;
	seedpathDisplayInput.value = value;
	previousseedInput.value = 'usepreviousseed';
	importSeedSelectionEl.style.display = 'none';
	importFormContainer.style.display = 'block';
};

var useExistingSeedListener = function (e) {
	// console.log('useExistingSeedListener', event);
	setExistingSeed(e.target.value);
};

/**
 * resize codemirror on window resize
 */
var styleWindowResizeEventHandler = function () {
	if (window.codeMirrors) {
		for (var y in window.codeMirrors) {
			window.codeMirrors[y].refresh();
			window.codeMirrors[y].setSize('auto', '80%');
		}
	}
};

var tabEvents = function () {
	window.StylieTab['dbseed-tabs'].on('tabsShowIndex', function ( /*index*/ ) {
		// console.log('showing tab', index);
		// codemirrortab(index);
		styleWindowResizeEventHandler();
	});
};

var exapmleSeedSelectEventHandler = function (e) {
	var newCMValue = JSON.stringify(window.exampleseed[e.target.value], null, 2);
	window.codeMirrors['example-seed-ta'].doc.setValue(newCMValue);
};

window.useUploadedSeed = function (data) {
	var optionElement = document.createElement('option');
	optionElement.value = data.body.data.files[0].name;
	optionElement.innerHTML = optionElement.value;
	existingseedlist.appendChild(optionElement);
	existingseedlist.value = optionElement.value;
	setExistingSeed(optionElement.value);
};

window.addEventListener('resize', styleWindowResizeEventHandler, false);

window.showImportStatusResult = function () {
	document.getElementById('importstatuscontainer').style.display = 'block';
	importstatusoutputel.innerHTML = 'Importing seed data';
};

// window.displayImportSeedStatus = function (ajaxFormResponse) {
// 	// console.log(ajaxFormResponse);
// 	importstatusoutputel.innerHTML = JSON.stringify(ajaxFormResponse, null, 2);
// };
window.displayImportSeedStatus = window.displayCustomSeedStatus;

window.showCustomStatusResult = function () {
	document.getElementById('customseed-codemirror').innerHTML = window.codeMirrors['customseed-codemirror'].getValue();
	document.getElementById('customstatuscontainer').style.display = 'block';
	seedcustomstatusoutputel.innerHTML = 'Customing seed data';
};

window.displayCustomSeedStatus = function (ajaxFormResponse) {
	// console.log(ajaxFormResponse.body.data);
	// seedcustomstatusoutputel.innerHTML = JSON.stringify(ajaxFormResponse.body.data, null, 2);
	var predata = document.createElement('pre'),
		h5element = document.createElement('h5'),
		hrelement = document.createElement('hr');

	h5element.innerHTML = 'Import Seed Result';
	predata.innerHTML = JSON.stringify(ajaxFormResponse.body.data, null, 2);
	predata.setAttribute('class', 'ts-text-xs ts-overflow-auto');
	predata.setAttribute('style', 'max-height:30em;');

	window.servermodalElement.querySelector('#servermodal-content').innerHTML = '';
	window.servermodalElement.querySelector('#servermodal-content').appendChild(h5element);
	window.servermodalElement.querySelector('#servermodal-content').appendChild(hrelement);
	window.servermodalElement.querySelector('#servermodal-content').appendChild(predata);
	window.AdminModal.show('servermodal-modal');
};


var elementSelectors = function () {
	seedpathInput = document.getElementById('seedpath');
	previousseedInput = document.getElementById('previousseed');
	seedpathDisplayInput = document.getElementById('seedpathdisplay');
	assetidInput = document.getElementById('assetid');
	exampleSeedSelect = document.getElementById('example-seed-select');
	importFormContainer = document.getElementById('importFormContainer');
	existingseedlist = document.getElementById('existingseedlist');
	importstatusoutputel = document.getElementById('seedimportstatus');
	importSeedSelectionEl = document.getElementById('importSeedSelection');
	seedcustomstatusoutputel = document.getElementById('seedcustomstatus');
};

var eventHandlers = function () {
	exampleSeedSelect.addEventListener('change', exapmleSeedSelectEventHandler, false);
	if (existingseedlist) {
		existingseedlist.addEventListener('change', useExistingSeedListener, false);
	}
};

var init = function () {
	elementSelectors();
	eventHandlers();
	tabEvents();
};

if (typeof window.domLoadEventFired !== 'undefined') {
	init();
}
else {
	window.addEventListener('load', init, false);
}

},{}]},{},[1]);
