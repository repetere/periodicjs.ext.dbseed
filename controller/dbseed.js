'use strict';
const Promisie = require('promisie');
const fs = Promisie.promisifyAll(require('fs-extra'));
const path = require('path');
const moment = require('moment');
const defaultUploadDir = path.join(process.cwd(), 'content/files/dbseeds');
const defaultExportFileName = `dbemptybackup-${ moment().format('YYYY-MM-DD-hh:mm:ss') }.json`;
const archiver = require('archiver');

var logger;
var mongoose;
var appSettings;
var CoreController;
var CoreUtilities;
var export_db;
var importSeedModule;
var dbopsModule;
var Asset;
var extJson;

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

// var import_upload = function (req, res) {
// 	let uploadOptions = CoreUtilities.removeEmptyObjectValues(req.body);
// 	let originalpath;
// 	let seedname;
// 	let (uploadSeedObject.previousseed && uploadSeedObject.previousseed === 'usepreviousseed') ? true : false;
// 	let newseedpath;

// };

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
	importSeedModule = require('./importseed')(resources);
	dbopsModule = require('./dbops')(resources);
	Asset = mongoose.model('Asset');
	extJson = resources.app.locals.dbseedExtJson;
	try {
		fs.ensureDirSync(defaultUploadDir);
	}
	catch (e) {
		logger.error(e);
	}
	return { index, export_download };
};

module.exports = controller;
