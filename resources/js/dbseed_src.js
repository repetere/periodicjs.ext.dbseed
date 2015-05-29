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

window.useUploadedSeed = function (data) {
	// console.log('data', data);
	var optionElement = document.createElement('option');
	optionElement.value = data.body.data.files[0].filename;
	optionElement.innerHTML = optionElement.value;
	existingseedlist.appendChild(optionElement);
	existingseedlist.value = optionElement.value;
	setExistingSeed(optionElement.value);

};

var setExistingSeed = function (value) {
	seedpathInput.value = value;
	seedpathDisplayInput.value = value;
	previousseedInput.value = 'usepreviousseed';
	importSeedSelectionEl.style.display = 'none';
	importFormContainer.style.display = 'block';
};

var useExistingSeedListener = function (e) {
	setExistingSeed(e.target.value);
};

/**
 * resize codemirror on window resize
 */
var styleWindowResizeEventHandler = function () {
	if (window.codeMirrors) {
		for (var y in window.codeMirrors) {
			window.codeMirrors[y].refresh();
			// codeMirrorJSEditors[y].setSize('auto', '80%');
		}
	}
};

var tabEvents = function () {
	window.StylieTab['dbseed-tabs'].on('tabsShowIndex', function ( /*index*/ ) {
		// codemirrortab(index);
		styleWindowResizeEventHandler();
	});
};

var exapmleSeedSelectEventHandler = function (e) {
	var newCMValue = JSON.stringify(window.exampleseed[e.target.value], null, 2);
	window.codeMirrors['example-seed-ta'].doc.setValue(newCMValue);
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
	document.getElementById('customseed-codemirror').innerHTML = codeMirrors['customseed-codemirror'].getValue();
	document.getElementById('customstatuscontainer').style.display = 'block';
	seedcustomstatusoutputel.innerHTML = 'Customing seed data';
};

window.displayCustomSeedStatus = function (ajaxFormResponse) {
	// console.log(ajaxFormResponse.body.data);
	// seedcustomstatusoutputel.innerHTML = JSON.stringify(ajaxFormResponse.body.data, null, 2);
	var predata = document.createElement('pre'),
		h5element = document.createElement('h5'),
		hrelement = document.createElement('hr');

	h5element.innerHTML = 'Import Seed Result'
	predata.innerHTML = JSON.stringify(ajaxFormResponse.body.data, null, 2);
	predata.setAttribute('class', 'ts-text-xs ts-overflow-auto')
	predata.setAttribute('style', 'max-height:30em;')

	window.servermodalElement.querySelector('#servermodal-content').innerHTML = '';
	window.servermodalElement.querySelector('#servermodal-content').appendChild(h5element);
	window.servermodalElement.querySelector('#servermodal-content').appendChild(hrelement);
	window.servermodalElement.querySelector('#servermodal-content').appendChild(predata);
	AdminModal.show('servermodal-modal');
};

window.addEventListener('load', function () {
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
	exampleSeedSelect.addEventListener('change', exapmleSeedSelectEventHandler, false);


	if (existingseedlist) {
		existingseedlist.addEventListener('change', useExistingSeedListener, false);
	}
	tabEvents();
});
