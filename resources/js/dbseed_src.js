'use strict';

var componentTab1,
	contentEntryModule = require('./../../../periodicjs.ext.admin/resources/js/contententry'),
	contententry,
	tabelement,
	seedpathInput,
	seedpathDisplayInput,
	previousseedInput,
	assetidInput,
	existingseedlist,
	importstatusoutputel,
	importSeedSelectionEl,
	importFormContainer,
	ComponentTabs = require('periodicjs.component.tabs');

var useExistingSeedListener = function (e) {
	seedpathInput.value = e.target.value;
	seedpathDisplayInput.value = e.target.value;
	previousseedInput.value = 'usepreviousseed';
	importSeedSelectionEl.style.display = 'none';
	importFormContainer.style.display = 'block';
};

window.showImportStatusResult = function () {
	document.getElementById('importstatuscontainer').style.display = 'block';
	importstatusoutputel.innerHTML = 'Importing seed data';
};

window.displayImportSeedStatus = function (ajaxFormResponse) {
	// console.log(ajaxFormResponse);
	importstatusoutputel.innerHTML = JSON.stringify(ajaxFormResponse, null, 2);
};

window.addEventListener('load', function () {
	seedpathInput = document.getElementById('seedpath');
	previousseedInput = document.getElementById('previousseed');
	seedpathDisplayInput = document.getElementById('seedpathdisplay');
	assetidInput = document.getElementById('assetid');
	tabelement = document.getElementById('tabs');
	importFormContainer = document.getElementById('importFormContainer');
	existingseedlist = document.getElementById('existingseedlist');
	importstatusoutputel = document.getElementById('seedimportstatus');
	importSeedSelectionEl = document.getElementById('importSeedSelection');
	window.ajaxFormEventListers('._pea-ajax-form');
	if (tabelement) {
		componentTab1 = new ComponentTabs(tabelement);
	}
	contententry = new contentEntryModule({
		// ajaxFormToSubmit: document.getElementById('edit-collection-form'),
		mediafileinput: document.getElementById('upload-seed_button'),
		uploadmediaCallback: function (mediadoc) {
			seedpathInput.value = mediadoc.fileurl;
			seedpathDisplayInput.value = mediadoc.fileurl;
			assetidInput.value = mediadoc._id;
			importSeedSelectionEl.style.display = 'none';
			importFormContainer.style.display = 'block';
			// console.log('uploadmediaCallback mediadoc', mediadoc);
		}
	});
	if (existingseedlist) {
		existingseedlist.addEventListener('change', useExistingSeedListener, false);
	}
});
