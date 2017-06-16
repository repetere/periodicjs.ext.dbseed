'use strict';

const fs = require('fs-extra');
const path = require('path');
const periodicjs = require('periodicjs');
const Promisie = require('promisie');

/**
 * exports data from a given core data database model
 * 
 * @param {string} core_data_name 
 * @returns {Promise} contents of the core data model seed
 */
function exportCoreData(core_data_name) {
  return new Promise((resolve, reject) => {
    try {
      periodicjs.datas.get(core_data_name).query()
        .then(data => {
          resolve({
            [ core_data_name ]: data,
          });
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * exports all data from periodic into a seed file
 * 
 * @param {string} filepath 
 * @returns {Promise} resolved value from each export from exportCoreData
 */
function exportData(filepath) {
  return new Promise((resolve, reject) => {
    try {
      const excluded_data = periodicjs.settings.extensions['periodicjs.ext.dbseed'].export.ignore_core_datas;
      const core_datas = Array.from(periodicjs.datas.keys()).filter(datum => excluded_data.indexOf(datum) === -1);
      fs.ensureFile(filepath)
        .then(() => {
          return Promisie.map(core_datas, 5, exportCoreData);
        })
        .then(datas => {
          resolve(fs.outputJSON(filepath, datas));
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  exportCoreData,
  // exportCoreDatabase,
  exportData,
};