'use strict';
const path = require('path');
const Promisie = require('promisie');
const fs = Promisie.promisifyAll(require('fs-extra'));
const async = Promisie.promisifyAll(require('async'));
const merge = require('util-extend');
const capitalize = require('capitalize');

var logger;
var mongoose;
var appSettings;
var CoreController;
var CoreUtilities;
var appenvironment;

var isValidSeedJSONSync = function (options) {
	let seedjsondata = options.jsondata;
	if (!seedjsondata || (seedjsondata && typeof seedjsondata === 'object' && !seedjsondata.data)) { return new Error('Seed document is missing data array of documents'); }
	return true;
};

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

var setupInsertTask = function (options) {
	let { transform_configuration, mongooseConnection, custom_model_names, capitalize_suffix } = options;
	return function (data, cb) {
		try {
			let modelName;
			if (custom_model_names && typeof custom_model_names[data.datatype] === 'string') { modelName = custom_model_names[data.datatype]; }
			else if (typeof capitalize_suffix === 'string') { modelName = data.datatype.replace(new RegExp(`${capitalize_suffix}$`), capitalize(capitalize_suffix)); }
			else { modelName = data.datatype; }
			let db = mongooseConnection || mongoose;
			transformDataForSeed(data.datadocument, (transform_configuration[modelName]) ? transform_configuration[modelName] : null)
				.then(transformed => {
					db.model(capitalize(modelName)).create(transformed, cb);
				}, cb);
		}
		catch (e) {
			cb(e);
		}
	};
};

var configureCreateQueue = function (options, fileData) {
	let transform_configuration;
	try {
		transform_configuration = require(path.join(__dirname, '../../../content/config/extensions/periodicjs.ext.dbseed/customseed.js')).importseed;
	}
	catch (e) {
		logger.warn('There is not a transform configuration file');
	}
	let createTask = setupInsertTask(Object.assign({}, options, { transform_configuration }));
	let queue = async.queue(createTask, 25);
	let inserted = fileData.data.map(data => Promisie.promisify(queue.push, queue)(data));
	return Promise.all(inserted)
		.then(result => {
			return {
				validDocuments: result,
				numOfSeededDocuments: fileData.data.length,
			};
		})
		.catch(e => Promise.reject(e));
};

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
	return { readSeedFromFile, importSeed, isValidSeedJSONSync };
};

module.exports = initialize;
