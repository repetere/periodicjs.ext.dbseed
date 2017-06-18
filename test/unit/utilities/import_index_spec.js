'use strict';

const path = require('path');
const fs = require('fs-extra');
const flatten = require('flat');
const events = require('events');
const chai = require('chai');
const sinon = require('sinon');
const express = require('express');
const expect = require('chai').expect;
const extension_root_dir = path.resolve(__dirname, '../../../');
const packageJSON = require(path.join(extension_root_dir, 'package.json'));
const importSeed = require(path.join(extension_root_dir, 'utilities/import-seed'));
const app = express();
let extension_files = [];
const periodic = require('periodicjs');
chai.use(require('sinon-chai'));
require('mocha-sinon');
const erouter = express.Router();
const import_seed_dir = path.resolve(__dirname, '../../mock/unit/utilities/import_seed');
const core_data_name = 'test_importCoreData';

describe('Import-seed', function() {
  this.timeout(10000);
  before('initialize seed core data', (done) => {
    periodic.datas.set(core_data_name, {
      query: () => {
        return Promise.resolve(dummySeedDataQuery);
      },
      create: (documents) => {
        return Promise.resolve(documents);
      }
    });
    periodic.settings = Object.assign({}, periodic.settings, {
      extensions: {
        'periodicjs.ext.dbseed': {
          import: {
            ignore_core_datas: [],
          }
        }
      }
    });
    Promise.all([
        fs.ensureDir(import_seed_dir),
      ])
      .then(() => {
        done();
      }).catch(done);
  });
  describe('importData', function() {
    it('should handle errors', (done) => {
      importSeed.importData()
        .then(() => {
          done(new Error('this should not reach this block'));
        })
        .catch(e => {
          expect(e).to.be.a('error');
          done();
        });
    });
    it('should handle filepath errors', (done) => {
      importSeed.importData(NaN)
        .then(() => {
          done(new Error('this should not reach this block'));
        })
        .catch(e => {
          expect(e).to.be.a('error');
          done();
        });
    });
    it('should import seed data from a filepath', (done) => {
      const emptySeedImport = path.resolve(__dirname, '../../mock/testseeds/testempty_seed_import.json');
      importSeed.importData(emptySeedImport)
        .then(result => {
          expect(result[0][core_data_name]).to.eql('no valid seeds');
          done();
        })
        .catch(done);
    });
  });
  describe('importCoreData', function() {
    it('should handle errors', (done) => {
      importSeed.importCoreData()
        .then(() => {
          done(new Error('this should not reach this block'));
        })
        .catch(e => {
          expect(e).to.be.a('error');
          done();
        });
    });
    it('should skip inserting empty seed data into core data', (done) => {
      const mockSeed = {
        [core_data_name]: [],
      };
      importSeed.importCoreData(mockSeed)
        .then(result => {
          expect(result[core_data_name]).to.eql('no valid seeds');
          done();
        })
        .catch(done)
    });
    it('should insert seed data into core data', (done) => {
      const mockSeedData = [1, 2, 3, 4];
      const mockSeed = {
        [core_data_name]: mockSeedData,
      };
      importSeed.importCoreData(mockSeed)
        .then(result => {
          // expect(result[ core_data_name ]).to.eql(mockSeedData);
          expect(result).to.be.ok;
          done();
        })
        .catch(done)
    });
  });
  after('remove test import seed dir', (done) => {
    Promise.all([
        fs.remove(import_seed_dir),
      ])
      .then(() => {
        done();
      }).catch(done);
  });
});