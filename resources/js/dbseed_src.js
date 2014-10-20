'use strict';

var componentTab1,
	contentEntryModule = require('./../../../periodicjs.ext.admin/resources/js/contententry'),
	contententry,
	tabelement,
	seedpathInput,
	seedpathDisplayInput,
	assetidInput,
	ComponentTabs = require('periodicjs.component.tabs');

window.displayImportSeedStatus = function (ajaxFormResponse) {
	console.log(ajaxFormResponse);
};

window.addEventListener('load', function () {
	seedpathInput = document.getElementById('seedpath');
	seedpathDisplayInput = document.getElementById('seedpathdisplay');
	assetidInput = document.getElementById('assetid');
	tabelement = document.getElementById('tabs');
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
			// console.log('uploadmediaCallback mediadoc', mediadoc);
		}
	});
});
//9178050772
