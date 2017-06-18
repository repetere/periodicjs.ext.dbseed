# periodicjs.ext.dbseed [![Coverage Status](https://coveralls.io/repos/github/typesettin/periodicjs.ext.dbseed/badge.svg?branch=master)](https://coveralls.io/github/typesettin/periodicjs.ext.dbseed?branch=master) [![Build Status](https://travis-ci.org/typesettin/periodicjs.ext.dbseed.svg?branch=master)](https://travis-ci.org/typesettin/periodicjs.ext.dbseed)

An extension that exports data in seed format and imports data in seed format to your periodic application.

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

You can configure DB Seed to exclude core datas in your database during the import and export process.

You can also configure how many core data documents are permitted in a file before it's split into a new file.

Customized import and export transforms are coming soon.

### Default Configuration
```javascript
{
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
```

## Seed Format

The seed format is an array of data to import into any configured core data database (SQL, Mongo, Loki, etc). Regardless of the underlying database, the format for seeds are the name.

A seed is comprised of a core data name, and core data documents, the combination of `{ core-data-name: [core data documents] }` is what is referred to as a seed.

A seed file contains an array of seeds:
```javascript
//example seed file
[
   {
     standard_item:[
       {
         "_id": 1,
         "title": "doc1"
       },
       {
         "_id": 2,
         "title": "doc2"
       },
       {
         "_id": 3,
         "title": "doc3"
       }
     ]
   },
   {
     standard_item:[
       {
         "_id": 4,
         "title": "doc4"
       },
       {
         "_id": 5,
         "title": "doc5"
       },
       {
         "_id": 6,
         "title": "doc6"
       }
     ]
   },
   {
     standard_user:[
       {
         "_id": 1,
         "email": "user1@domain.tld"
       },
       {
         "_id": 2,
         "email": "user2@domain.tld"
       },
       {
         "_id": 3,
         "email": "user3@domain.tld"
       }
     ]
   }
 ]
```

## Example data

There's a sample seed document in `periodicjs.ext.dbseed/examples/exampleseed.json` that you can use to seed your database.

```
$ periodicjs extension periodicjs.ext.dbseed import node_modules/periodicjs.ext.dbseed/examples/exampleseed.json 
```

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
$ jsdoc2md commands/**/*.js config/**/*.js controllers/**/*.js  transforms/**/*.js utilities/**/*.js index.js > doc/api.md
```
##Notes
* Check out https://github.com/typesettin/periodicjs for the full Periodic Documentation