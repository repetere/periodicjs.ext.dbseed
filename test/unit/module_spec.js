'use strict';

const path = require('path');
const fs = require('fs-extra');
const flatten = require('flat');
const events = require('events');
const chai = require('chai');
const sinon = require('sinon');
const expect = require('chai').expect;
const extension_root_dir = path.resolve(__dirname, '../../');
const EXTENSION_module = require(path.join(extension_root_dir, 'index'));
let extension_files = [];
chai.use(require('sinon-chai'));
require('mocha-sinon');

describe('Valid extension module', function() {
  this.timeout(10000);
  describe('exports a module', function() {
    it('should export a function', () => {
      expect(EXTENSION_module).to.be.a('function');
    });
    it('should return a promise', () => {
      expect(EXTENSION_module()).to.be.a('promise');
    });
    it('should resolve true', (done) => {
      EXTENSION_module()
        .then(result => {
          expect(result).to.be.true;
          done();
        })
        .catch(done);
    })
  });
});