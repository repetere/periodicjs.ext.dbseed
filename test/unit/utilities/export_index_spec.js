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
// erouter.get('/aslkjdsf', (req, res) => {
//   res.send('outputting data');
// })
// app.get('/SOMEGETROUTE', (req, res) => {
//   res.send({ data: 'ok' });
// })
// app.use(erouter);
// app.use(EXTENSION_routers);

describe('export-seed', function() {
  this.timeout(10000);
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
    // it('it should expor')
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
      // console.log({ periodic });
      const dummySeedData = { dummy: 'data', };
      const core_data_name = 'test_exportCoreData';
      periodic.datas.set(core_data_name, {
        query: () => {
          return Promise.resolve(dummySeedData)
        }
      });
      exportSeed.exportCoreData(core_data_name)
        .then(result => {
          expect(result[ core_data_name ]).to.eql(dummySeedData);
          // console.log({ result });
          done();
        })
        .catch(done);
    });
  });
});