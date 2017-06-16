# periodicjs.ext.dbseed [![Coverage Status](https://coveralls.io/repos/github/typesettin/periodicjs.ext.dbseed/badge.svg?branch=master)](https://coveralls.io/github/typesettin/periodicjs.ext.dbseed?branch=master) [![Build Status](https://travis-ci.org/typesettin/periodicjs.ext.dbseed.svg?branch=master)](https://travis-ci.org/typesettin/periodicjs.ext.dbseed)

An extension that exports and imports data from your periodic application.

[API Documentation](https://github.com/typesettin/periodicjs.ext.dbseed/blob/master/doc/api.md)

## Usage

### Importing Data

You can import data using CLI
```
$ cd path/to/application/root
### Using the CLI
$ periodicjs ext periodicjs.ext.dbseed import path/to/seed/file.json 
### Calling Manually
$ node index.js --cli --command --ext --name=periodicjs.ext.dbseed --task=import --args=path/to/seed/file.json
```

### Exporting Data

You can export data using CLI
```
$ cd path/to/application/root
### Using the CLI
$ periodicjs ext periodicjs.ext.dbseed export path/to/seed/file.json 
### Calling Manually
$ node index.js --cli --command --ext --name=periodicjs.ext.dbseed --task=export --args=path/to/seed/file.json
```

## Configuration

### Default Configuration

## Installation

### Installing the Extension

Install like any other extension, run `npm run install periodicjs.ext.dbseed` from your periodic application root directory and then run `periodicjs addExtension periodicjs.ext.dbseed`.
```
$ cd path/to/application/root
$ npm run install periodicjs.ext.dbseed
$ periodicjs addExtension periodicjs.ext.dbseed
```
### Uninstalling the Extension

Run `npm run uninstall periodicjs.ext.dbseed` from your periodic application root directory and then run `periodicjs removeExtension periodicjs.ext.dbseed`.
```
$ cd path/to/application/root
$ npm run uninstall periodicjs.ext.dbseed
$ periodicjs removeExtension periodicjs.ext.dbseed
```


## Testing
*Make sure you have grunt installed*
```
$ npm install -g grunt-cli
```

Then run grunt test or npm test
```
$ grunt test && grunt coveralls #or locally $ npm test
```
For generating documentation
```
$ grunt doc
$ jsdoc2md commands/**/*.js config/**/*.js controllers/**/*.js resources/**/*.js transforms/**/*.js utilities/**/*.js index.js > doc/api.md
```
##Notes
* Check out https://github.com/typesettin/periodicjs for the full Periodic Documentation