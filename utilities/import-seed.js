'use strict';

const fs = require('fs-extra');
const path = require('path');
const periodicjs = require('periodicjs');
const Promisie = require('promisie');

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

/**
 * imports a seedfile json file path into core data databases
 * 
 * @param {string} filepath 
 * @returns {Promise}
 */
function importData(filepath) {
  return new Promise((resolve, reject) => {
    try {
      const excluded_data = periodicjs.settings.extensions[ 'periodicjs.ext.dbseed' ].import.ignore_core_datas;
      //TODO: @janbialostok filter datas collections on import
      const core_datas = Array.from(periodicjs.datas.keys()).filter(datum => excluded_data.indexOf(datum) === -1);
      fs.readJSON(filepath)
        .then(datas => {
          resolve(Promisie.map(datas, 1, importCoreData));
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  importCoreData,
  importData,
};