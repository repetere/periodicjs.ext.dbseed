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
module.exports = function(periodic){
	// express,app,logger,config,db,mongoose
	var seedRouter = periodic.express.Router(),
			seedController = require('./controller/dbseed')(periodic);

	for(var x in periodic.settings.extconf.extensions){
		if(periodic.settings.extconf.extensions[x].name === 'periodicjs.ext.admin'){
			seedRouter.get('/', seedController.index);
			// seedRouter.get('/status', seedController.status);
		}
	}
	// seedRouter.post('/grow', seedController.grow);

	periodic.app.use('/p-admin/dbseed',seedRouter);
};