'use strict';

const periodicjs = require('periodicjs');

function exportCoreData(options) {
  return new Promise((resolve, reject) => {
    resolve('coreData');
  });
}

function exportCoreDatabase(options) {
  return new Promise((resolve, reject) => {
    resolve('coreDatas');
  });
}

function exportData(options) {
  return new Promise((resolve, reject) => {
    console.log('coreDatas',{options})
    resolve('coreDatas');
  });
}

module.exports = {
  exportCoreData,
  exportCoreDatabase,
  exportData,
};