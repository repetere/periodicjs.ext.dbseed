'use strict';

module.exports = {
  settings: {
    defaults: true,
    export: {
      ignore_core_datas: [ 'configuration', 'extension' ],
      split_count:1000,
    },
    import: {
      ignore_core_datas: [ 'configuration', 'extension' ],
    },
  },
  databases: {
  },
};