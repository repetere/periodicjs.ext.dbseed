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
var request = require('supertest');

// const httpMocks = require('node-mocks-http');
const importSeed = require(path.join(extension_root_dir, 'utilities/import-seed'));
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

describe('Import-seed', function() {
  this.timeout(10000);
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
    // it('should be a functional express middleware', (done) => {
    //   console.log('app._router.stack', app._router.stack);
    //   console.log('express.Router', express.Router)
    //     // console.log({ app });
    //     // const request = httpMocks.createRequest({
    //     //   method: 'GET',
    //     //   url: '/user/42',
    //     //   params: {
    //     //     id: 42
    //     //   }
    //     // });
    //     // const response = httpMocks.createResponse();
    //     // EXTENSION_routers(request, response);
    //     // const data = JSON.parse(response._getData());
    //     // console.log({ data });
    //   request(app)
    //     .get(`/${packageJSON.name}`)
    //     .expect(200, 'ok')
    //     .end((err, res) => {
    //       // console.log({ res });
    //       done(err);
    //     });

    // });
  });
});