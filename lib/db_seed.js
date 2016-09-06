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
var importOrder;
var importDB;

var isValidSeedJSONSync = function (options) {
	let seedjsondata = options.jsondata;
	if (!seedjsondata || (seedjsondata && typeof seedjsondata === 'object' && !seedjsondata.data)) { return new Error('Seed document is missing data array of documents'); }
	return true;
};

/**
 * Handles resolving seed document data
 * @param {string|Object} file Can be a file path, directory path, stringified object or regular json object
 * @return {Object} Return a Promise which resolves to the seed data or combined seed data in the case the file is a directory path
 */
var readSeedFromFile = function (file) {
	if (typeof file === 'string' && path.isAbsolute(file)) {
		return fs.statAsync(file)
			.then(stats => {
				if (stats.isDirectory()) { return fs.readdirAsync(file); }
				else { return fs.readFileAsync(file, 'utf8'); }
			})
			.then(data => {
				if (!Array.isArray(data)) { return JSON.parse(data); }
				else {
					let read = data.map(fileName => fs.readFileAsync(path.join(file, fileName), 'utf8'));
					return Promise.all(read)
						.then(files => {
							return files.reduce((result, json) => {
								result.data = result.data.concat(JSON.parse(json).data);
								return result;
							}, { data: [] });
						}, e => Promise.reject(e));
				}
			})
			.catch(e => Promise.reject(e));
	}
	else if (typeof file === 'string') { return Promise.resolve(JSON.parse(file)); }
	else { return Promise.resolve(file); }
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
			else if (importDB) {
				if (typeof importDB.url === 'string' && importDB.mongooptions && typeof importDB.mongooptions === 'object') {
					db = mongo.connect(importDB.url, importDB.mongooptions);
					waitForConnection = true;
				}
				else { db = importDB; }
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

/**
 * Configures a queue task function that inserts data into database from the seed file
 * @param {Object} options Configuration options for the database seed
 * @param {Object} [options.mongooseConnection] A mongoose instance
 * @param {Object} [options.custom_model_names] Associates mongoose model name to it registered model name ie. { userdata: 'UserData' }
 * @param {string} [options.capitalize_suffix] Modifies the model name by replacing matching suffix with its capitalized version ie. 'data' -> 'userData'
 * @param {Object} options.transform_configuration An object with transform functions indexed by datatype. Transform is run on data prior to insertion into the database
 * @return {Function} Returns a queue task function that will perform transform and insertion of data
 */
var setupInsertTask = function (options) {
	let { transform_configuration, mongooseConnection, custom_model_names, capitalize_suffix } = options;
	let db;
	/**
	 * A queue task function that will transform and insert data into db
	 * @param {Object} data Data to be inserted into database
	 * @param {Function} cb Callback function
	 */
	return ensureDBConnection(mongooseConnection)
		.then(dbConnection => {
			db = dbConnection;
			return function (data, cb) {
				try {
					let modelName;
					if (custom_model_names && typeof custom_model_names[data.datatype] === 'string') { modelName = custom_model_names[data.datatype]; }
					else if (typeof capitalize_suffix === 'string') { modelName = data.datatype.replace(new RegExp(`${capitalize_suffix}$`), capitalize(capitalize_suffix)); }
					else { modelName = data.datatype; }
					transformDataForSeed(data.datadocument, (transform_configuration[modelName]) ? transform_configuration[modelName] : null)
						.then(transformed => {
							db.model(capitalize(modelName)).create(transformed, (err,result) => {
								if (err) { 
									let insertError = new Error(`There was an insert error - ${err.message}:\r\n${ JSON.stringify(data.datadocument) }`);
									cb(insertError);
								}
								else { cb(null, result); }
							});
						}, cb);
				}
				catch (e) {
					cb(e);
				}
			};
		}, e => Promise.reject(e));
};

/**
 * Orders data by the order in which they should be inserted into the database
 * @param {Array} datas A set of data that should be ordered by priority
 * @param {Object} [order] An object indexed by datatype that describes the order in which the documents should be inserted
 * @return {Array} Returns ordered array of data or returns original array of order argument is not passed or is not an object
 */
var reorderDataByImportOrder = function (datas, order) {
	let ordered = [];
	let unordered = [];
	if (!order) { return datas; }
	datas.forEach(data => {
		if (order && typeof order === 'object') {
			if (typeof order[data.datatype] !== 'number') { unordered.push(data); }
			else {
				let insert_priority = order[data.datatype];
				ordered[insert_priority] = (Array.isArray(ordered[insert_priority])) ? ordered[insert_priority] : [];
				ordered[insert_priority].push(data);
			}
		}
		else { unordered.push(data); }
	});
	ordered[ordered.length] = unordered;
	return ordered.filter(d => Array.isArray(d));
};

/**
 * Handles database inserts in parallel
 * @param {Array} data An array of data to be inserted
 * @param {Object} queue Async queue or any other queue with a push method that accepts data and callback parameters
 * @param {Object} [order] An object indexed by datatype that describes the order in which the documents should be inserted
 * @return {Object} Returns a Promise which resolves once queue has cleared
 */
var handleParallelInsertQueue = function (data, queue, order) {
	data = reorderDataByImportOrder(data, order).reduce((result, d) => {
		if (Array.isArray(data)) { return result.concat(d); }
		else {
			result.push(d);
			return result;
		}
	}, []);
	let inserted = data.map(d => Promisie.promisify(queue.push, queue)(d));
	return Promise.all(inserted)
		.then(result => {
			return {
				validDocuments: result,
				numOfSeededDocuments: data.length
			};
		})
		.catch(e => Promise.reject(e));
};

/**
 * Handles database inserts in series organized by document datatype
 * @param {Array} data An array of arrays split by document datatype
 * @param {Object} queue Async queue or any other queue with a push method that accepts data and callback parameters
 * @param {Object} [order] An object indexed by datatype that describes the order in which the documents should be inserted
 * @return {Object} Returns a Promise which resolves once queue has cleared
 */
var handleSeriesInsertQueue = function (data, queue, order) {
	data = reorderDataByImportOrder(data, order);
	return async.mapSeriesAsync(data, (datatype, mapcb) => {
		handleParallelInsertQueue(datatype, queue)
			.then(result => mapcb(null, result))
			.catch(mapcb);
	})
		.then(results => results.reduce((final, result) => {
			final.validDocuments = final.validDocuments.concat(result.validDocuments);
			final.numOfSeededDocuments += result.numOfSeededDocuments;
			return final;
		}, {
			validDocuments: [],
			numOfSeededDocuments: 0	
		}))
		.catch(e => Promise.reject(e));
};

/**
 * Configures create queue which takes data from seed file and inserts into the database
 * @param {Object} options Configuration options for the database seed
 * @param {Boolean} [options.use_series] If true database will be seeded with data in series by datatype
 * @param {Object} Returns a Promise which resolves once creation queue has cleared
 */
var configureCreateQueue = function (options, fileData) {
	let transform_configuration = Object.assign({}, transformConfiguration);
	let import_order = Object.assign({}, importOrder);
	return setupInsertTask(Object.assign({}, options, { transform_configuration }))
		.then(createTask => {
			let queue = async.queue(createTask, 25);
			if (options.use_series) { return handleSeriesInsertQueue(fileData.data, queue, import_order); }
			else { return handleParallelInsertQueue(fileData.data, queue, import_order); }
		}, e => Promise.reject(e));
};

/**
 * Method for importing seed data
 * @param {Object} options Options for the database import
 * @param {string|Object} options.file Seed data which can either be a file path, stringified JSON object or a JSON object
 * @param {Boolean} [options.use_series] If true database will be seeded with data in series by datatype
 * @param {Object} [options.mongooseConnection] A mongoose instance
 * @param {Object} [options.custom_model_names] Associates mongoose model name to it registered model name ie. { userdata: 'UserData' }
 * @param {string} [options.capitalize_suffix] Modifies the model name by replacing matching suffix with its capitalized version ie. 'data' -> 'userData'
 * @param {Function} [cb] Callback function
 * @return {Object} Returns a Promise if cb argument is not passed
 */
var importSeed = function (options, cb) {
	let file = options.file;
	let insert = function (callback) {
		try {
			readSeedFromFile(file)
				.then(configureCreateQueue.bind(null, options))
				.then(result => callback(null, result))
				.catch(callback);
		}
		catch (e) {
			callback(e);
		}
	};
	if (typeof cb === 'function') { insert(cb); }
	else { return Promisie.promisify(insert)(); }
};

var initialize = function (resources) {
	logger = resources.logger;
	mongoose = resources.mongoose;
	appSettings = resources.settings;
	appenvironment = appSettings.application.environment;
	CoreController = resources.core.controller;
	CoreUtilities = resources.core.utilities;
	try {
		let import_configuration = require(path.join(__dirname, '../../../content/config/extensions/periodicjs.ext.dbseed/customseed.js'))(resources)[appenvironment]
		transformConfiguration = import_configuration.importseed;
		importOrder = import_configuration.importorder;
		importDB = import_configuration.importdb;
	}
	catch (e) {
		logger.warn('There is not a transform configuration file', e.stack);
	}
	return { readSeedFromFile, importSeed, isValidSeedJSONSync };
};

module.exports = initialize;
