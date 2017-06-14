'use strict';
const periodic = require('periodicjs');
const utilities = require('../utilities/index');

module.exports = {
  hello: (options) => {
    periodic.logger.silly('hello',{options});
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  },
  export: utilities.exportSeed.exportData,
};