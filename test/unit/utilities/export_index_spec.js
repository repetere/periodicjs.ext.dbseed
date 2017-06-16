'use strict';

const path = require('path');
const fs = require('fs-extra');
const flatten = require('flat');
const events = require('events');
const chai = require('chai');
const sinon = require('sinon');
const express = require('express');
const periodic = require('periodicjs');
const expect = require('chai').expect;
const extension_root_dir = path.resolve(__dirname, '../../../');
const packageJSON = require(path.join(extension_root_dir, 'package.json'));
var request = require('supertest');


// const httpMocks = require('node-mocks-http');
const exportSeed = require(path.join(extension_root_dir, 'utilities/export-seed'));
const app = express();
let extension_files = [];
chai.use(require('sinon-chai'));
require('mocha-sinon');
const erouter = express.Router();
const core_data_name = 'test_exportCoreData';
const dummySeedData = { dummy: 'data', };
const dummySeedDataQuery = [ dummySeedData, dummySeedData, dummySeedData ];
const export_seed_dir = path.resolve(__dirname, '../../mock/unit/utilities/export_seed');

describe('Export-seed', function() {
  this.timeout(10000); 
  before('initialize seed core data', (done) => {
    periodic.datas.set(core_data_name, {
      query: () => {
        return Promise.resolve(dummySeedDataQuery);
      }
    });
    periodic.settings = Object.assign({}, periodic.settings, {
      extensions: {
        'periodicjs.ext.dbseed': {
          export: {
            ignore_core_datas:[],
          }
        }
      }
    });
    Promise.all([
      fs.ensureDir(export_seed_dir),
    ])
      .then(() => {
        done();
      }).catch(done);
  });
  describe('exportData', function() {
    it('should handle errors', (done) => {
      exportSeed.exportData()
        .then(() => {
          done(new Error('this should not reach this block'));
        })
        .catch(e => {
          expect(e).to.be.a('error');
          done();
        });
    });
    it('should handle filepath errors', (done) => {
      exportSeed.exportData(NaN)
        .then(() => {
          done(new Error('this should not reach this block'));
        })
        .catch(e => {
          expect(e).to.be.a('error');
          done();
        });
    });
    it('it should export seed to a file', (done) => {
      const exportSeedFile = path.join(export_seed_dir, 'test_seed_export.json');
      exportSeed.exportData(exportSeedFile)
        .then(result => {
          return fs.readJSON(exportSeedFile);
        })
        .then((seedJSON) => { 
          let hasTestExportSeed = false;
          expect(seedJSON).to.be.an('array');
          seedJSON.forEach(seed => {
            if (Object.keys(seed)[ 0 ] === core_data_name) {
              hasTestExportSeed = true;
              expect(seed[ core_data_name ]).to.be.an('array');
            }
          });
          expect(hasTestExportSeed).to.be.true;
          done();
        })
        .catch(done);
    });
  });
  describe('exportCoreData', function() {
    it('should handle errors', (done) => {
      exportSeed.exportCoreData()
        .then(() => {
          done(new Error('this should not reach this block'));
        })
        .catch(e => {
          expect(e).to.be.a('error');
          done();
        });
    });
    it('should export data in seed format', (done) => {
      exportSeed.exportCoreData(core_data_name)
        .then(result => {
          expect(result[ core_data_name ]).to.eql(dummySeedDataQuery);
          done();
        })
        .catch(done);
    });
  });
  after('remove test export seed dir', (done) => {
    Promise.all([
        fs.remove(export_seed_dir),
      ])
      .then(() => {
        done();
      }).catch(done);
  });
});