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
	codeMirrorJSEditorsElements,
	codeMirrors = [],
	CodeMirror = require('codemirror'),
	ComponentTabs = require('periodicjs.component.tabs');


require('../../node_modules/codemirror/addon/edit/matchbrackets');
require('../../node_modules/codemirror/addon/comment/comment');
require('../../node_modules/codemirror/addon/comment/continuecomment');
require('../../node_modules/codemirror/addon/fold/foldcode');
require('../../node_modules/codemirror/addon/fold/comment-fold');
require('../../node_modules/codemirror/addon/fold/indent-fold');
require('../../node_modules/codemirror/addon/fold/brace-fold');
require('../../node_modules/codemirror/addon/fold/foldgutter');
require('../../node_modules/codemirror/mode/css/css');
require('../../node_modules/codemirror/mode/htmlembedded/htmlembedded');
require('../../node_modules/codemirror/mode/javascript/javascript');


var useExistingSeedListener = function (e) {
	seedpathInput.value = e.target.value;
	seedpathDisplayInput.value = e.target.value;
	previousseedInput.value = 'usepreviousseed';
	importSeedSelectionEl.style.display = 'none';
	importFormContainer.style.display = 'block';
};

/**
 * resize codemirror on window resize
 */
var styleWindowResizeEventHandler = function () {
	if (codeMirrorJSEditorsElements) {
		for (var y in codeMirrors) {
			codeMirrors[y].refresh();
			// codeMirrorJSEditors[y].setSize('auto', '80%');
		}
	}
};

var initCodemirrors = function () {
	for (var cm = 0; cm < codeMirrorJSEditorsElements.length; cm++) {
		codeMirrors[cm] = CodeMirror.fromTextArea(
			codeMirrorJSEditorsElements[cm], {
				lineNumbers: true,
				lineWrapping: true,
				matchBrackets: true,
				autoCloseBrackets: true,
				mode: 'application/json',
				indentUnit: 4,
				indentWithTabs: true,
				'overflow-y': 'hidden',
				'overflow-x': 'auto',
				lint: true,
				gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
				foldGutter: true
			}
		);
	}
};

var tabEvents = function () {
	componentTab1.on('tabsShowIndex', function ( /*index*/ ) {
		// codemirrortab(index);
		styleWindowResizeEventHandler();
	});
};
window.addEventListener('resize', styleWindowResizeEventHandler, false);

window.showImportStatusResult = function () {
	document.getElementById('importstatuscontainer').style.display = 'block';
	importstatusoutputel.innerHTML = 'Importing seed data';
};

window.displayImportSeedStatus = function (ajaxFormResponse) {
	// console.log(ajaxFormResponse);
	importstatusoutputel.innerHTML = JSON.stringify(ajaxFormResponse, null, 2);
};

window.showCustomStatusResult = function () {
	document.getElementById('importstatuscontainer').style.display = 'block';
	importstatusoutputel.innerHTML = 'Customing seed data';
};

window.displayCustomSeedStatus = function (ajaxFormResponse) {
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
	codeMirrorJSEditorsElements = document.querySelectorAll('.codemirroreditor');
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
	initCodemirrors();
	tabEvents();
});