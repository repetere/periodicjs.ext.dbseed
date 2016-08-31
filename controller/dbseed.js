'use strict';
const Promisie = require('promisie');
const fs = Promisie.promisifyAll(require('fs-extra'));
const path = require('path');
const moment = require('moment');
const defaultUploadDir = path.join(__dirname, '../../../content/files/dbseeds');
const defaultExportFileName = `dbemptybackup-${ moment().format('YYYY-MM-DD-hh:mm:ss') }.json`;
const archiver = require('archiver');

var logger;
var mongoose;
var appSettings;
var CoreController;
var CoreUtilities;
var export_db;
var import_db;
var dbopsModule;
var Asset;
var extJson;

var uploaded_seed_file = function (req, res) {
	res.send({
		result: 'success',
		data: req.controllerData
	});
};

var set_seed_upload_dir = function (req, res, next) {
	req.localuploadpath = defaultUploadDir;
	next();
};

/**
 *
 */
var sendExportDownload = function (options) {
	let { res, filePath } = options;
	let exportFileName = path.basename(filePath);
	res.setHeader('Content-disposition', 'attachment; filename=' + exportFileName);
	res.setHeader('Content-type', (path.extname(exportFileName) === '.zip') ? 'application/zip' : 'application/json' );
	Promisie.promisify(res.download, res)(filePath, exportFileName)
		.then(() => fs.removeAsync(filePath))
		.then(() => logger.info('Successfully exported seed file'))
		.catch(logger.error);
};

/**
 *
 */
var handleArchivePartitionedFile = function (writeStream, files, cb) {
	let handler = function (callback) {
		try {
			let archive = archiver('zip');
			writeStream.on('close', callback)
				.on('error', callback);
			archive.on('error', callback);
			archive.pipe(writeStream);
			for (let i = 0; i < files.length; i++) {
				archive = archive.append(fs.createReadStream(files[i].exportSeedFilePath), { name: path.basename(files[i].exportSeedFilePath) });
			}
			archive.finalize();
		}
		catch (e) {
			callback(e);
		}
	};
	if (typeof cb === 'function') { handler(cb); }
	else { Promisie.promisify(handler)(); }
};

/**
 *
 */
var export_download = function (req, res) {
	let downloadOptions = CoreUtilities.removeEmptyObjectValues(req.body);
	export_db.exportSeed(downloadOptions)
		.then(result => {
			if (downloadOptions.partition) {
				let zipPath = `${ path.join(path.dirname(downloadOptions.outputPath), path.basename(downloadOptions.outputPath, '.json')) }.zip`;
				let seedOutput = fs.createWriteStream(zipPath);
				handleArchivePartitionedFile(seedOutput, result, (err) => {
					if (err) {
						CoreController.handleDocumentQueryErrorResponse({
							err: err,
							res: res,
							req: req
						});
					}
					else { sendExportDownload({ res, filePath: zipPath }); }
				});
			}
			else { sendExportDownload({ res, filePath: result.exportSeedFilePath }); }
		}, e => {
			CoreController.handleDocumentQueryErrorResponse({
				err: e,
				res: res,
				req: req
			});
		});
};

/**
 *
 */
var import_upload_utils = function (req, res) {
	return {
		/**
		 *
		 */
		setupseeddata: function (options = {}) {
			try {
				let seedname = path.basename(options.seedpath);
				let newseedpath = path.join(__dirname, '../content/files/dbseeds', seedname);
				let originalseeduploadpath;
				if (!options.useExistingSeed) {
					originalseeduploadpath = path.join(__dirname, '../public', seedname);
				}
				return Promise.resolve(Object.assign({ seedname, newseedpath, originalseeduploadpath }, options));
			}
			catch (e) {
				return Promise.reject(e);
			}
		},
		/**
		 *
		 */
		checkdirexists: function (options = {}) {
			if (options.useExistingSeed) { return Promise.resolve(options); }
			else {
				return fs.ensureDirAsync(options.uploadseeddir)
					.then(() => options, e => Promise.reject(e));
			}
		},
		/**
		 *
		 */
		moveseed: function (options = {}) {
			if (options.useExistingSeed) { return Promise.resolve(options); }
			else {
				return fs.renameAsync(options.originalseeduploadpath, options.newseedpath)
					.then(() => options, e => Promise.reject(e));
			}
		},
		/**
		 *
		 */
		deleteOldUpload: function (options = {}) {
			if (options.useExistingSeed) { return Promise.resolve(options); }
			else {
				return fs.removeAsync(options.originalseeduploadpath)
					.then(() => options, e => Promise.reject(e));
			}
		},
		/**
		 *
		 */
		removeAssetFromDB: function (options = {}) {
			if (options.assetid) {
				return Promisie.promisify(CoreController.deleteModel, CoreController)({
					model: Asset,
					deleteid: options.assetid,
					req,
					res
				})
					.then(() => options, e => Promise.reject(e));
			}
			else { return Promise.resolve(options); }
		},
		/**
		 *
		 */
		wipedb: function (options = {}) {
			if (options.wipecheckbox) {
				return export_db.exportSeed({
					outputPath: path.join(__dirname, '../content/files/dbseeds', defaultExportFileName)
				})
					.then(result => Promisie.promisify(dbopsModule.emptyDB)({}))
					.then(() => options)
					.catch(e => Promise.reject(e));
			}
			else { return Promise.resolve(options); }
		},
		/**
		 *
		 */
		seeddb: function (options = {}) {
			return import_db.importSeed({
				file: options.newseedpath
			});
		}
	};
};

/**
 *
 */
var import_customseed = function (req, res) {
	let uploadOptions = CoreUtilities.removeEmptyObjectValues(req.body);
	import_db.importSeed({ file: uploadOptions.customseedjson })
		.then(data => {
			CoreController.handleDocumentQueryRender({
				req,
				res,
				renderView: 'home/index',
				responseData: {
					pagedata: { title: 'New Item' },
					data: { result: 'success', data },
					user: req.user
				}
			});
		}, err => {
			CoreController.handleDocumentQueryErrorResponse({ err, req, res });
		});
};

/**
 * 
 */
var import_upload = function (req, res) {
	let uploadOptions = CoreUtilities.removeEmptyObjectValues(req.body);
	let useExistingSeed = (uploadOptions.previousseed && uploadOptions.previousseed === 'usepreviousseed') ? true : false;
	let import_utils = import_upload_utils(req, res);
	import_utils.setupseeddata(Object.assign({ useExistingSeed }, uploadOptions))
		.then(import_utils.checkdirexists)
		.then(import_utils.moveseed)
		.then(import_utils.deleteOldUpload)
		.then(import_utils.removeAssetFromDB)
		.then(import_utils.wipedb)
		.then(import_utils.seeddb)
		.then(() => {
			CoreController.handleDocumentQueryRender({
				res,
				req,
				renderView: 'home/index',
				responseData: {
					pagedata: { title: 'New Item' },
					data: { result: 'success' },
					user: req.user
				}
			});
		})
		.catch(err => CoreController.handleDocumentQueryErrorResponse({ err, req, res }));
};

/**
 * Loads the index view for dbseed extension
 * @param {Object} req Express request object
 * @param {Object} req.user Periodic user
 * @param {Object} res Express response object
 */
var index = function (req, res) {
	let getPluginViewDefaultTemplate = Promisie.promisify(CoreController.getPluginViewDefaultTemplate, CoreController).bind(CoreController, {
		viewname: 'p-admin/dbseed/index',
		themefileext: appSettings.templatefileextension,
		extname: 'periodicjs.ext.dbseed'
	});
	let readdirAsync = fs.readdirAsync.bind(fs, defaultUploadDir);
	Promise.all([getPluginViewDefaultTemplate(), readdirAsync()])
		.then(results => {
			CoreController.handleDocumentQueryRender({
				res: res,
				req: req,
				renderView: results[0],
				responseData: {
					pagedata: {
						title: 'DBSeed Import/Export',
						toplink: '&raquo; DB Seed Import/Export',
						headerjs: ['/extensions/periodicjs.ext.dbseed/js/dbseed.min.js?v=' + extJson.version],
						extensions: CoreUtilities.getAdminMenu()
					},
					periodic: {
						version: appSettings.version
					},
					existingseeds: results[1],
					user: req.user
				}
			});
		}, e => {
			CoreController.handleDocumentQueryErrorResponse({
				err: e,
				res: res,
				req: req
			});
		});
};

var controller = function (resources) {
	logger = resources.logger;
	mongoose = resources.mongoose;
	appSettings = resources.settings;
	CoreController = resources.core.controller;
	CoreUtilities = resources.core.utilities;
	export_db = require(path.join(__dirname, '../lib/db_clone'))(resources);
	import_db = require(path.join(__dirname, '../lib/db_seed'))(resources);
	dbopsModule = require('./dbops')(resources);
	Asset = mongoose.model('Asset');
	extJson = (resources.app.locals && resources.app.locals.dbseedExtJson) ? resources.app.locals.dbseedExtJson : { version: '1.0' };
	try {
		fs.ensureDirSync(defaultUploadDir);
	}
	catch (e) {
		logger.error(e);
	}
	return Object.assign({ index, export_download, import_upload, import_customseed, uploaded_seed_file, set_seed_upload_dir }, export_db, import_db);
};

module.exports = controller;
