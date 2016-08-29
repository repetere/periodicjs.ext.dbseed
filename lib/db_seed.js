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

var readSeedFromFile = function (file) {
	if (typeof file === 'string' && path.isAbsolute(file)) { return fs.readJsonAsync(file); }
	else { return Promise.resolve(file); }
};

var transformDataForSeed = function (data, operation) {
	if (typeof operation !== 'function') {
		return Promise.resolve(data);
	}
	try {
		return Promise.resolve(operation(data));
	}
	catch (e) {
		logger.warn('Transform function could not be completed', e);
		return Promise.resolve(data);
	}
};

var configureCreateQueue = function (mongooseConnection, fileData) {
	let transformConfiguration;
	try {
		transformConfiguration = require(path.join(__dirname, '../../../config/extensions/periodicjs.ext.dbseed/customseed.js')).importseed;
	}
	catch (e) {
		logger.warn('There is not a transform configuration file');
	}
	let createTask = function (data, cb) {
		try {
			let modelName = capitalize(data.datatype).replace(/data/g, 'Data');
			transformDataForSeed(data.datadocument, transformConfiguration[key])
				.then(transformed => {
					mongooseConnection.model(modelName).create(transformed, cb);
				}, cb);
		}
		catch (e) {
			cb(e);
		}
	};
	let queue = async.queue(createTask, 25);
	let inserted = fileData.data.forEach(data => Promisie.promisify(queue.push, queue)(data));
	return Promise.all(inserted)
		.then(() => 'Documents have finished inserting')
		.catch(e => Promise.reject(e));
};

var importSeed = function (options, cb) {
	let { file, mongooseConnection } = options;
	let insert = function (callback) {
		try {
			let createQueue;
			readSeedFromFile(file)
				.then(configureCreateQueue.bind(null, mongooseConnection))
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
	return { readSeedFromFile, importSeed };
};

module.exports = initialize;
