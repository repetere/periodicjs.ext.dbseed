'use strict';

module.exports = function(periodic){
	// express,app,logger,config,db,mongoose
	var seedRouter = periodic.express.Router(),
			seedController = require('./controller/seed')(periodic);

	for(var x in periodic.settings.extconf.extensions){
		if(periodic.settings.extconf.extensions[x].name === 'periodicjs.ext.admin'){
			seedRouter.get('/', seedController.index);
			// seedRouter.get('/status', seedController.status);
		}
	}
	seedRouter.post('/grow', seedController.grow);

	periodic.app.use('/p-admin/seed',seedRouter);
};