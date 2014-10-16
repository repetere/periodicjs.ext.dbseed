'use strict';

var Utilities = require('periodicjs.core.utilities'),
	ControllerHelper = require('periodicjs.core.controller'),
	exportSeedModule,
	importSeedModule,
	CoreUtilities,
	CoreController,
	appSettings,
	mongoose,
	logger;

/**
 * uploads seeds via admin interface
 * @param  {object} req
 * @param  {object} res
 * @return {object} responds with dbseed page
 */
var index = function (req, res) {
	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/dbseed/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.dbseed'
		},
		function (err, templatepath) {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				err: err,
				renderView: templatepath,
				responseData: {
					pagedata: {
						title: 'Seed Admin',
						extensions: CoreUtilities.getAdminMenu()
					},
					periodic: {
						version: appSettings.version
					},
					user: req.user
				}
			});
		});
};

/**
 * dbseed controller
 * @module dbseedController
 * @{@link https://github.com/typesettin/periodicjs.ext.dbseed}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @requires module:async
 * @requires module:periodicjs.core.utilities
 * @requires module:periodicjs.core.controller
 * @param  {object} resources variable injection from current periodic instance with references to the active logger and mongo session
 * @return {object}           dbseed
 */
var controller = function (resources) {
	logger = resources.logger;
	mongoose = resources.mongoose;
	appSettings = resources.settings;
	CoreController = new ControllerHelper(resources);
	CoreUtilities = new Utilities(resources);
	exportSeedModule = require('./exportseed')(resources);
	importSeedModule = require('./importseed')(resources);

	return {
		index: index,
		seedDocuments: importSeedModule.seedDocuments,
		importSeed: importSeedModule.importSeed,
		exportSeed: exportSeedModule.exportSeed,
		isValidSeedJSONSync: importSeedModule.isValidSeedJSONSync
	};
};

module.exports = controller;
