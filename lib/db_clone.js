'use strict';
const path = require('path');
const Promisie = require('promisie');
const fs = Promisie.promisifyAll(require('fs-extra'));
const async = Promisie.promisifyAll(require('async'));
const merge = require('util-extend');
const capitalize = require('capitalize');
const mongo = require('mongoose');

var logger;
var mongoose;
var appSettings;
var CoreController;
var CoreUtilities;
var appenvironment;
var transformConfiguration;
var exportDB;
var exportOptions;

/**
 * Appends json data to json file either being pushing object into data array or merging objects if data property does not exist.  Will also create new file if file does not exist
 * @param  {string} filePath  Path to json file
 * @param  {Object} writeData JSON data to be appended to file
 * @return {Object} Function returns an Promise
 */
var appendJSONToFile = function (filePath, writeData) {
	return fs.statAsync(filePath)
		.then(() => fs.readJsonAsync(filePath), () => true)
		.then(fileData => {
			if (typeof fileData === 'boolean' && fileData) { return fs.writeJsonAsync(filePath, writeData); }
			else {
				if (fileData.data && Array.isArray(fileData.data)) { fileData.data.push(writeData); }
				else { fileData = merge(fileData, fileData.data); }
				return fs.writeJsonAsync(filePath, fileData);
			}
		})
		.catch(e => Promise.reject(e));
};

/**
 * Utility method for writing json data to a file.  Can optionally write data to write stream, append json data to a file or create/overwrite a json file
 * @param  {Object} options Options object for function
 * @param {Object} options.writeStream fs writeable stream object.  Defaults to writing json data to stream if this option is passed
 * @param {string|Object} options.writeData JSON data to be written to file.  Must be stringified if writeStream option is passed
 * @param {string} options.filePath Path to json file
 * @param {Boolean} options.overwrite Optional flag which determines if file will be overwritten with json data or if data should be appended to file
 * @param  {Function} cb      Optional callback
 * @return {Object}  If no cb argument is not passed returns a Promise
 */
var writeToFile = function (options, cb) {
	if (options.writeStream) {
		options.writeStream.write(options.writeData);
		return options.writeStream;
	}
	else {
		let fn = function (callback) {
			if (!options.overwrite) {
				appendJSONToFile(options.filePath, options.writeData)
					.then(() => {
						callback(null, 'File write complete');
					}, callback);
			}
			else {
				fs.writeJson(options.filePath, options.writeData, err => {
					if (err) { callback(err);	}
					else { callback(null, 'File write complete'); }
				});
			}
		};
		if (typeof cb === 'function') { fn(cb); }
		else { return Promisie.promisify(fn)(); }
	}
};

/**
 * Pulls db seed settings out of file.  Will ensure file exists and either requires or reads json data depending on file type
 * @param  {string}   filePath Optional path to settings file.  Will default to periodic app controller_settings.js file if none is specified
 * @param  {Function} cb       Options callback function
 * @return {Object}            Returns a Promise if no callback function is passed
 */
var getModelSettingsFromFile = function (filePath, cb) {
	filePath = (typeof filePath === 'string') ? filePath : path.join(__dirname, '../../../app/controller/controller_settings.js');
	let fn = function (callback) {
		fs.statAsync(filePath)
			.then(() => {
				if (path.extname(filePath) === '.js') {
					let settings = require(filePath);
					callback(null, settings);
				}
				else {
					fs.readJsonAsync(filePath)
						.then(settings => {
							callback(null, settings);
						}, callback);
				}
			}, callback);
	};
	if (typeof cb === 'function') { fn(cb); }
	else { return Promisie.promisify(fn)(); }
};

/**
 * Infers db seed settings from the models that exist for a given mongoose instance
 * @param  {Object} mongooseConnection Mongoose connection object
 * @return {Object} Returns a settings object that contains model_name and load_model_population properties
 */
var getModelSettings = function (mongooseConnection) {
	try {
		let pullModelDetails = function (model) {
			let populationSettings = [];
			let paths = model.schema.paths;
			for (let key in paths) {
				if (paths[key].instance === 'ObjectID') {
					populationSettings.push(paths[key].path);
				}
			}
			return {
				model_name: model.modelName.toLowerCase(),
				load_model_population: populationSettings.join(' ')
			};
		};
		let settings = Object.keys(mongooseConnection.models).reduce((config, key) => {
			let model = mongooseConnection.models[key];
			if (model) {
				config[key.toLowerCase()] = pullModelDetails(model);
			}
			return config;
		}, {});
		return settings;
	}
	catch (e) {
		logger.warn('Could not generate seetings from model', e);
	}
};

/**
 * Gets a combined population string from a settings object load_model_population and load_multiple_model_population properties
 * @param  {Object} options Population settings from the controller_settings object for a given schema
 * @return {string}         A population string with only unique values
 */
var getPopulationSettings = function (options) {
	if (!options.load_model_population && options.load_multiple_model_population) {
		return options.load_multiple_model_population;
	}
	else if (options.load_model_population && !options.load_multiple_model_population) {
		return options.load_model_population;
	}
	else if (!options.load_model_population && !options.load_multiple_model_population) {
		return '';
	}
	else {
		let population = options.load_model_population.split(' ');
		options.load_multiple_model_population.split(' ').forEach(str => {
			if (population.indexOf(str) === -1) {
				population.push(str);
			}
		});
		return population.join(' ');
	}
};

/**
 * Given a settings object function creates a populated mongoose query stream for a model
 * @param  {Object} settings Settings object created by getModelSettings or getModelSettingsFromFile
 * @param {string} settings.model_name Name of the mongoose model
 * @return {Object}          Mongoose query stream
 */
var getMongoQueryStream = function (options) {
	let model_name;
	if (options.custom_model_names && typeof options.custom_model_names[options.model_settings.model_name] === 'string') { model_name = options.custom_model_names[options.model_settings.model_name]; }
	else if (options.capitalize_suffix && options.capitalize_suffix.length) { model_name = options.model_settings.model_name.replace(new RegExp(`${options.capitalize_suffix}$`), capitalize(options.capitalize_suffix)); }
	else { model_name = options.model_settings.model_name; }
	let Model = options.connection.model(capitalize(model_name));
	let populationSettings = getPopulationSettings(options.model_settings);
	let dataStream = Model.find({}).populate(populationSettings).cursor();
	return dataStream;
};

/**
 * Utility function for wrapping output json in an object with a "data" property
 * @param {Object} options Options for the seed file creation finalize function
 * @param {Object|Number} options.records Total count of inserted records or an object containing total records indexed by datatype
 * @param {Boolean} options.usePartition Boolean flag describing if seperate files were created for each of the different data types
 * @param {string} options.writePath Absolute path for the JSON seed file
 * @return {Function} Returns a function used for finalizing the seed file by wrapping it in a object and setting it to the data property of that object
 */
var setupCompleteSeedFile = function (options, cb) {
	let { records, usePartition, writePath } = options;
	/**
	 * Completes creation of seed file by reading file and wrapping data in an object under the "data" property
	 * @param {string} wp Path to the un-finalized seed file
	 * @param {Function} callback Callback function
	 */
	let completeFile = function (wp, callback) {
		let _file_data;
		fs.readFileAsync(wp, 'utf8')
			.then(fileData => {
				_file_data = `{\r\n"data": [\r\n${ fileData.substring(0, fileData.length - 1) }\r\n]\r\n}`;
				return fs.writeFileAsync(wp, _file_data);
			})
			.then(() => {
				callback(null, {
					records: (!usePartition) ? records : records[Object.keys(records).filter(key => new RegExp(key, 'gi').test(path.basename(wp)))[0]],
					data: _file_data,
					path: wp
				});
			})
			.catch(callback);
	};
	return function () {
		if (usePartition) {
			fs.readdirAsync(path.dirname(writePath))
				.then(paths => {
					paths = paths.filter(filePath => {
						let regexp = new RegExp(`^${ path.basename(writePath, '.json') }.+\\.json$`);
						return regexp.test(filePath);
					});
					return async.mapSeriesAsync(paths, (filePath, mapcb) => {
						completeFile(path.join(path.dirname(writePath), filePath), mapcb);
					});
				})
				.then(results => {
					cb(null, results);
				})
				.catch(cb);
		}
		else { completeFile(writePath || './seed_data.json', cb); }
	};
};

/**
 * Configures a queue whose worker writes json data to a writeable stream
 * @param  {string} writePath    Optional file path for the data write will default to ./seed_data.json if argument is undefined
 * @param  {Boolean} usePartition If true seperate json files will be created for each collection.  Files names will match writePath with appended collection name
 * @param  {Function} onDrain      Function to be called once last task is returned from worker
 * @return {Object}              Returns async queue object
 */
var configureWriteQueue = function (writePath, usePartition, onDrain) {
	writePath = writePath || './seed_data.json';
	let streamHolder = {
		_current: {
			path: null,
			fd: null
		}
	};
	let records = (!usePartition) ? 0 : {};
	/**
	 * Switches between writeStreams dependent on the specified write path
	 * @param  {Object} data json data to be written to file
	 * @param {string} data.datatype Data must contain datatype property which is used to determine write path
	 * @return {Object}      Returns a fs writeable stream
	 */
	let createWriteStreamSwitchboard = function (data) {
		if (streamHolder._current.path !== writePath.replace(/(.+)(\.json)/, `$1_${data.datatype}$2`)) {
			if (!streamHolder[data.datatype] || !streamHolder[data.datatype].fd) {
				let wp = writePath.replace(/(.+)(\.json)/, `$1_${data.datatype}$2`);
				let fd = fs.createWriteStream(wp);
				streamHolder[data.datatype] = { path: wp, fd };
			}
			streamHolder._current = streamHolder[data.datatype];
		}
		return streamHolder._current.fd;
	};
	let writeStream = (usePartition === true) ? createWriteStreamSwitchboard : fs.createWriteStream(writePath);
	let queue = async.queue(function (data, cb) {
		writeToFile({
			writeStream: (typeof writeStream === 'function') ? writeStream(data) : writeStream,
			writeData: JSON.stringify(data) + ','
		});
		if (!usePartition) { records++; }
		else {
			records[data.datatype] = (typeof records[data.datatype] === 'number') ? records[data.datatype] : 0;
			records[data.datatype]++;
		}
		cb();
	}, 1);
	let timeout;
	let done = setupCompleteSeedFile({ records, usePartition, writePath }, onDrain);
	queue.drain = function () {
		if (!timeout) { timeout = setTimeout(done, 5000); }
		else {
			clearTimeout(timeout);
			timeout = setTimeout(done, 5000);
		}
	};
	return queue;
};

/**
 * Runs transform function on data or auto resolves data if there is an error or if operation argument is not a function
 * @param  {Object} data      Document from mongoose collection
 * @param  {Function} operation Transform function to be run on the given data object
 * @return {Object}          Returns a Promise
 */
var transformDataForSeed = function (data, operation) {
	if (typeof operation !== 'function') { return Promise.resolve(data); }
	try {
		return Promise.resolve(operation(data));
	}
	catch (e) {
		logger.warn('Transform function could not be completed', e);
		return Promise.resolve(data);
	}
};

/**
 * Configures mongo query streams for all models on a mongoose instance to push data into queue on "data"
 * @param {Object} options Options for configuring functionality of query streams
 * @param {Object} options.model_settings Object containing schema data for all schemas on mongoose instance indexed by document type
 * @param {Object} [options.transform_configuration] A set of transform functions indexed by document type
 * @param {Boolean|string} [options.skipUserSeeds] If any non-falsy value is passed model wont be included in seed this option can be set for different models following the same pattern "skip" + "model name" + "seeds"
 * @param {Object} queue Async queue or any queue that has a push method which accepts a data and cb argument
 * @return {Object} Mongo query streams indexed by document type
 */
var configureQueryStreams = function (options) {
	let { model_settings, transform_configuration, queue } = options;
	try {
		let skipOptionRegexp = /^(skip)(\w+)(seeds)$/i;
		let skip_models = Object.keys(options).reduce((result, key) => {
			if (skipOptionRegexp.test(key) && options[key]) { result.push(key.replace(skipOptionRegexp, '$2').toLowerCase()); }
			return result;
		}, []);
		return Object.keys(model_settings).reduce((streams, key) => {
			if (skip_models.indexOf(key) === -1) {
				let mongoOptions = Object.assign({ connection: options.mongooseConnection || mongoose }, options, { model_settings: model_settings[key] });
				streams[key] = getMongoQueryStream(mongoOptions);
				streams[key].on('data', data => {
					data = data.toJSON();
					transformDataForSeed(data, (transform_configuration) ? transform_configuration[key] : null)
						.then(transformed => {
							let writeData = {
								datatype: key,
								datadocument: transformed
							};
							queue.push(writeData, err => {
								if (err) { logger.warn('Could not write data to seed', err.stack); }
								else { logger.silly('Successfully wrote data to seed', writeData); }
							});
						}, logger.warn.bind(logger));
				});
			}
			return streams;
		}, {});
	}
	catch (e) {
		return Promise.reject(e);
	}
};

/**
 * Ensures that correct mongo db instance is used and has properly connected
 * @param {Object} [mongooseConnection] A connected mongoose instance if this argument is passed it will be assumed that this connection should be used
 * @return {Object} Connected mongoose instance
 */
var ensureDBConnection = function (mongooseConnection) {
	return new Promise((resolve, reject) => {
		try {
			let db;
			let waitForConnection = false;
			if (mongooseConnection) {
				if (typeof mongooseConnection.url === 'string' && mongooseConnection.mongooptions && typeof mongooseConnection.mongooptions === 'object') {
					db = mongo.connect(mongooseConnection.url, mongooseConnection.mongooptions);
					waitForConnection = true;
				}
				else { db = mongooseConnection; }
			}
			else if (exportDB) {
				if (typeof exportDB.url === 'string' && exportDB.mongooptions && typeof exportDB.mongooptions === 'object') {
					db = mongo.connect(exportDB.url, exportDB.mongooptions);
					waitForConnection = true;
				}
				else { db = exportDB; }
			}
			else { db = mongoose; }
			if (waitForConnection) {
				db.connection.once('connected', () => resolve(db));
				db.connection.once('error', reject);
			}
			else { resolve(db); }
		}
		catch (e) {
			reject(e);
		}
	});
};

var ensureExportDirectory = function (outputPath) {
	if (typeof outputPath === 'string') {
		if (path.extname(outputPath) === '') { return fs.ensureDirAsync(outputPath); }
		else {
			let dirname = path.dirname(outputPath);
			return fs.ensureDirAsync(dirname);
		}
	}
	else { return Promise.resolve(); }
};

/**
 * Runs full create seed suite
 * @param  {Object}   options Options object for create seed function
 * @param {Boolean} options.useConfigurationFile Default behavior is to infer settings from the mongoose instance set this property to true in order to pull settings from config file
 * @param {string} options.configPath If using configuration file this sets the path to that file
 * @param {Object} options.mongooseConnection Mongoose instance to be used in seed defaults to the current periodic instance
 * @param {string} options.outputPath Path for seed json file
 * @param {Boolean} options.partition Will create separate json seed file per collection if true
 * @param  {Function} cb      Optional callback function
 * @return {Object}           Returns a Promise if callback is not passed
 */
var createSeed = function (options, cb) {
	options = Object.assign({}, exportOptions, options);
	let fn = function (callback) {
		let transform_configuration = Object.assign({}, transformConfiguration);
		ensureExportDirectory(options.outputPath)
			.then(ensureDBConnection.bind(null, options.mongooseConnection))
			.then(dbConnection => {
				options.mongooseConnection = dbConnection;
				return new Promise((resolve, reject) => {
					if (options.useConfigurationFile) {
						getModelSettingsFromFile(options.configPath)
							.then(resolve, reject);
					}
					else if (options.mongooseConnection) { resolve(getModelSettings(options.mongooseConnection)); }
				});
			})	
			.then(model_settings => {
				let queue = configureWriteQueue(options.outputPath, options.partition, callback);
				return configureQueryStreams(Object.assign({}, options, { model_settings, transform_configuration, queue }));
			})
			.then(streams => {
				Object.keys(streams).forEach(key => {
					if (streams.hasOwnProperty(key)) {
						streams[key].on('end', () => {
							logger.info(`${ key } data stream has ended`);
						});
					}
				});
			})
			.catch(callback);
	};
	if (typeof cb === 'function') { fn(cb); }
	else { return Promisie.promisify(fn)(); }
};

/**
 * Runs full create seed suite and formats response
 * @param  {Object}   options Options object for create seed function
 * @param {Boolean} [options.useConfigurationFile] Default behavior is to infer settings from the mongoose instance set this property to true in order to pull settings from config file
 * @param {string} [options.configPath] If using configuration file this sets the path to that file
 * @param {Object} [options.mongooseConnection] Mongoose instance to be used in seed defaults to the current periodic instance
 * @param {string} [options.outputPath] Path for seed json file
 * @param {Boolean} [options.partition] Will create separate json seed file per collection if true
 * @param  {Function} [cb]      Optional callback function will return a Promise if cb arugment is not passed
 * @return {Object}           Returns a Promise if callback is not passed
 */
var exportSeed = function (options, cb) {
	let export_seed = function (callback) {
		try {
			createSeed(options, (err, result) => {
				if (err) { callback(err); }
				else {
					if (options.partition) {
						callback(null, result.map(r => {
							return {
								exportseedresult: r.data,
								exportSeedFilePath: r.path,
								numOfSeeds: r.records
							};
						}));
					}
					else {
						callback(null, {
							exportseedresult: result.data,
							exportSeedFilePath: result.path,
							numOfSeeds: result.records
						});
					}
				}
			});
		}
		catch (e) {
			callback(e);
		}
	};
	if (typeof cb === 'function') { export_seed(cb); }
	else { return Promisie.promisify(export_seed)(); }
};

var initialize = function (resources) {
	logger = resources.logger;
	mongoose = resources.mongoose;
	appSettings = resources.settings;
	appenvironment = appSettings.application.environment;
	CoreController = resources.core.controller;
	CoreUtilities = resources.core.utilities;
	try {
		let export_configuration = require(path.join(__dirname, '../../../content/config/extensions/periodicjs.ext.dbseed/customseed.js'))(resources)[appenvironment];
		transformConfiguration = export_configuration.exportseed;
		exportDB = export_configuration.exportdb;
		exportOptions = export_configuration.exportoptions || {};
	}
	catch (e) {
		logger.warn('There is not a transform configuration file', e.stack);
	}
	return {
		writeSeedToDisk: writeToFile,
		createSeeds: createSeed,
		exportSeed
	};
};

module.exports = initialize;
