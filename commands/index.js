'use strict';
const periodic = require('periodicjs');
const utilities = require('../utilities/index');

module.exports = {
  export: utilities.exportSeed.exportData,
  import: utilities.importSeed.importData,
};