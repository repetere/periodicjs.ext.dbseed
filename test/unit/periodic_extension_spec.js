'use strict';

const path = require('path');
const events = require('events');
const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs-extra');
const expect = require('chai').expect;
const extension_root_dir = path.resolve(__dirname, '../../');
chai.use(require('sinon-chai'));
require('mocha-sinon');

const EXTENSION_commands = require(path.join(extension_root_dir, 'commands/index'));
const EXTENSION_config = require(path.join(extension_root_dir, 'config/settings'));


describe('Valid Periodic extension', function () {
  this.timeout(10000);
  describe('complete extension folder structure', function () {
    it('should have all of the required extension components', (done) => {
      const standardExtensionStructure = [
        'commands',
        'config',
        'controllers',
        'doc',
        'resources',
        'routers',
        'test',
        'transforms',
        'utilities',
        'views',
        'index.js',
        'package.json',
        'periodicjs.ext.json',
      ];
      let requiredStructure = standardExtensionStructure.length;
      fs.readdir(extension_root_dir)
        .then(files => {
          files.forEach(file => {
            if (standardExtensionStructure.indexOf(file.toString()) > -1) {
              requiredStructure--;
            }
          });
          expect(files.length).to.be.greaterThan(standardExtensionStructure.length - 1);
          expect(requiredStructure).to.eql(0);
          done();
        })
        .catch(done);
    });
    it('should export asynchronous tasks', () => {
      Object.keys(EXTENSION_commands).forEach(command => {
        expect(EXTENSION_commands[ command ]).to.be.a('function');
      });
    });
    it('should export default config, with settings and databases', () => {
      expect(EXTENSION_config.settings).to.be.an('object');
      expect(EXTENSION_config.databases).to.be.an('object');
    })
  });
});