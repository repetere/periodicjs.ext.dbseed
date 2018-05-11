'use strict';

const Promisie = require('promisie');
const fs = Promisie.promisifyAll(require('fs-extra'));
const path = require('path');
const periodicjs = require('periodicjs');

/**
 * this function will take an array object { [core_data_name]:[{array of documents}] } and insert them into the respective core data database
 * 
 * @param {Object} core_data_seeds a core data seed
 * @returns {Promise}
 */
function importCoreData(core_data_seeds) {
  return new Promise((resolve, reject) => {
    try {
      const core_data_name = Object.keys(core_data_seeds)[0];
      const core_data_documents = core_data_seeds[core_data_name];
      if (core_data_documents.length && periodicjs.datas.get(core_data_name)) {
        periodicjs.datas.get(core_data_name).create({
          newdoc: core_data_documents,
          bulk_create: true,
        })
          .then(data => {
            resolve({
              [core_data_name]: data.length,
            });
          })
          .catch(reject);
      } else {
        resolve({
          [core_data_name]: 'no valid seeds',
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

function handleFileStats (filepath) {
  return function (stats) {
    try {
      if (stats.isDirectory()) {
        return fs.readdirAsync(filepath)
          .map(filename => path.join(filepath, filename))
          .catch(e => Promisie.reject(e));
      }
      return Promisie.resolve([filepath,]);
    } catch (e) {
      return Promisie.reject(e);
    }
  };
}

function handleFileReads (filepath) {
  try {
    if (path.extname(filepath) === '.json') {
      return fs.readJSONAsync(filepath);
    }
    return Promisie.resolve([]);
  } catch (e) {
    return Promisie.reject(e);
  }
}

function handleFilteredCollections (included) {
  return function (filedata) {
    try {
      return filedata.filter(data => {
        let keys = Object.keys(data);
        if (keys.length) {
          let type = keys[0];
          return (included.indexOf(type) !== -1);
        }
        return false;
      });
    } catch (e) {
      return Promisie.reject(e);
    }
  };
}

function handleDataImport (filedata) {
  try {
    if (!filedata.length) return null;
    return Promisie.map(filedata, 1, importCoreData);
  } catch (e) {
    return Promisie.reject(e);
  }
}

/**
 * imports a seedfile json file path into core data databases
 * 
 * @param {string} filepath 
 * @returns {Promise}
 */
function importData (options) {
  try {
    const excluded_data = periodicjs.settings.extensions[ 'periodicjs.ext.dbseed' ].import.ignore_core_datas;
    const filepath = (typeof options === 'string')
      ? options
      : options.filepath;
    const include_data_filter = (Array.isArray(options.include_datas))
      ? (datum => options.include_datas.indexOf(datum) > -1)
      : (() => true);
    const core_datas = Array.from(periodicjs.datas.keys())
      .filter(datum => excluded_data.indexOf(datum) === -1)
      .filter(include_data_filter);
    
    return fs.statAsync(filepath)
      .then(handleFileStats(filepath))
      .map(handleFileReads, 5)
      .map(handleFilteredCollections(core_datas))
      .map(handleDataImport, 5)
      .catch(e => Promisie.reject(e));
  } catch (e) {
    return Promisie.reject(e);
  }
}

module.exports = {
  importCoreData,
  importData,
};