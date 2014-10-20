'use strict';

var Utilities = require('periodicjs.core.utilities'),
	ControllerHelper = require('periodicjs.core.controller'),
	fs = require('fs-extra'),
	path = require('path'),
	async = require('async'),
	Asset,
	exportSeedModule,
	importSeedModule,
	dbopsModule,
	CoreUtilities,
	CoreController,
	appSettings,
	mongoose,
	logger,
	d = new Date(),
	defaultExportFileName = 'dbemptybackup' + '-' + d.getUTCFullYear() + '-' + d.getUTCMonth() + '-' + d.getUTCDate() + '-' + d.getTime() + '.json';


/**
 * upload post controller for seeds uplaoded via admin interface
 * @param  {object} req
 * @param  {object} res
 * @return {object} responds with dbseed page
 */
var import_upload = function (req, res) {
	var uploadSeedObject = CoreUtilities.removeEmptyObjectValues(req.body),
		originalseeduploadpath,
		uploadseeddir = path.resolve(process.cwd(), 'content/files/dbseeds'),
		seedname,
		useExistingSeed = (uploadSeedObject.previousseed && uploadSeedObject.previousseed === 'usepreviousseed') ? true : false,
		newseedpath;

	async.series({
			setupseeddata: function (cb) {
				try {
					if (useExistingSeed) {
						seedname = path.basename(uploadSeedObject.seedpath);
						newseedpath = path.resolve(process.cwd(), 'content/files/dbseeds', seedname);
					}
					else {
						originalseeduploadpath = path.join(process.cwd(), 'public', uploadSeedObject.seedpath);
						seedname = path.basename(uploadSeedObject.seedpath);
						newseedpath = path.resolve(process.cwd(), 'content/files/dbseeds', seedname);
					}
					cb(null, 'setup seed data');
				}
				catch (e) {
					cb(e);
				}
			},
			checkdirexists: function (cb) {
				if (useExistingSeed) {
					cb(null, 'skip directory check, useExistingSeed');
				}
				else {
					fs.ensureDir(uploadseeddir, cb);
				}
			},
			moveseed: function (cb) {
				if (useExistingSeed) {
					cb(null, 'skip move directory, useExistingSeed');
				}
				else {
					fs.rename(originalseeduploadpath, newseedpath, cb);
				}
			},
			deleteOldUpload: function (cb) {
				if (useExistingSeed) {
					cb(null, 'skip delete old seed, useExistingSeed');
				}
				else {
					fs.remove(originalseeduploadpath, cb);
				}
			},
			removeAssetFromDB: function (cb) {
				if (uploadSeedObject.assetid) {
					CoreController.deleteModel({
						model: Asset,
						deleteid: uploadSeedObject.assetid,
						req: req,
						res: res,
						callback: cb
					});
				}
				else {
					cb(null, 'existing seed');
				}
			},
			wipedb: function (cb) {
				if (uploadSeedObject.wipecheckbox) {
					async.series([
						function (wipedbcallback) {
							console.time('Exporting Seed Data');
							exportSeedModule.exportSeed({
								filepath: 'content/files/dbseeds/' + defaultExportFileName,
							}, function (err, status) {
								console.timeEnd('Exporting Seed Data');
								wipedbcallback(err, status);
							});
						},
						function (emptydbcallback) {
							console.time('Empty Database Data');
							dbopsModule.emptyDB({},
								function (err, status) {
									console.timeEnd('Empty Database Data');
									emptydbcallback(err, status);
								});
						}
					], function (err, status) {
						cb(err, status);
					});
				}
				else {
					cb(null, 'do not empty db');
				}
			},
			seeddb: function (cb) {
				fs.readJson(newseedpath, function (err, seedjson) {
					if (err) {
						cb(err);
					}
					else {
						console.time('Importing Seed Data');
						importSeedModule.importSeed({
							jsondata: seedjson,
							insertsetting: 'upsert'
						}, function (err, status) {
							console.timeEnd('Importing Seed Data');
							cb(err, status);
						});
					}
				});
			}
		},
		function (err, status) {
			if (err) {
				CoreController.handleDocumentQueryErrorResponse({
					err: err,
					res: res,
					req: req
				});
			}
			else {
				CoreController.handleDocumentQueryRender({
					res: res,
					req: req,
					renderView: 'home/index',
					responseData: {
						pagedata: {
							title: 'New Item',
						},
						data: status,
						user: req.user
					}
				});
			}
		});
};

/**
 * uploads seeds via admin interface
 * @param  {object} req
 * @param  {object} res
 * @return {object} responds with dbseed page
 */
var index = function (req, res) {
	async.waterfall([
		function (cb) {
			CoreController.getPluginViewDefaultTemplate({
					viewname: 'p-admin/dbseed/index',
					themefileext: appSettings.templatefileextension,
					extname: 'periodicjs.ext.dbseed'
				},
				function (err, templatepath) {
					cb(err, templatepath);
				});
		},
		function (templatepath, cb) {
			fs.readdir(path.join(process.cwd(), 'content/files/dbseeds'), function (err, files) {
				cb(err, {
					templatepath: templatepath,
					existingseeds: files
				});
			});
		}
	], function (err, result) {
		CoreController.handleDocumentQueryRender({
			res: res,
			req: req,
			err: err,
			renderView: result.templatepath,
			responseData: {
				pagedata: {
					title: 'Seed Admin',
					headerjs: ['/extensions/periodicjs.ext.dbseed/js/dbseed.min.js'],
					extensions: CoreUtilities.getAdminMenu()
				},
				periodic: {
					version: appSettings.version
				},
				existingseeds: result.existingseeds,
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
	dbopsModule = require('./dbops')(resources);
	Asset = mongoose.model('Asset');

	return {
		index: index,
		import_upload: import_upload,
		seedDocuments: importSeedModule.seedDocuments,
		importSeed: importSeedModule.importSeed,
		exportSeed: exportSeedModule.exportSeed,
		emptyDB: dbopsModule.emptyDB,
		isValidSeedJSONSync: importSeedModule.isValidSeedJSONSync
	};
};

module.exports = controller;
