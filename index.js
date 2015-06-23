'use strict';
/**
 * An extension to import json seeds into periodic mongodb.
 * @{@link https://github.com/typesettin/periodicjs.ext.dbseed}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @exports periodicjs.ext.dbseed
 * @param  {object} periodic variable injection of resources from current periodic instance
 */
module.exports = function (periodic) {
	// express,app,logger,config,db,mongoose
	periodic.app.controller.extension.dbseed = {
		seed: require('./controller/dbseed')(periodic)
	};

	var seedRouter = periodic.express.Router(),
		seedController = periodic.app.controller.extension.dbseed.seed,
		assetController = periodic.app.controller.native.asset;

	for (var x in periodic.settings.extconf.extensions) {
		if (periodic.settings.extconf.extensions[x].name === 'periodicjs.ext.asyncadmin') {
			seedRouter.post('/uploadseed', seedController.import_upload);
			seedRouter.post('/downloadseed', seedController.export_download);
			seedRouter.post('/customseed', seedController.import_customseed);
			seedRouter.get('/', seedController.index);
		}
	}
	seedRouter.post('/newuploadseed',
		seedController.set_seed_upload_dir,
		assetController.localupload,
		assetController.create_assets_from_files,
		seedController.uploaded_seed_file);

	periodic.app.use('/' + periodic.app.locals.adminPath + '/dbseed', seedRouter);
	return periodic;
};
