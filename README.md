# periodicjs.ext.dbseed

An extension to import/export json seeds into periodic mongodb, the seed format is a mirror of the model definition except objectID reference are placed with the document name, and dbseed looks up those name references and inserts the correct object id.

 [API Documentation](https://github.com/typesettin/periodicjs.ext.dbseed/blob/master/doc/api.md)

## Installation

```
$ npm install periodicjs.ext.dbseed
```

## Usage

### setting up your customseed file

Modify the customseed.js file
custom seed file must export a function which returns an object with keys detailing the import and export options
```javascript
/*
Sample returned config object
{
  development: {
    exportseed: {
      user: function (seed) {
        //these functions are used to transform data before export or import. Must return a Promise which resolves to the transformed object or syncronously returns transformed object
        return seed;
      }
    },
    importseed: {
      user: function (seed) {...}
    },
    importorder: {
      //details the order in which the models should be inserted into db
      user: 0
    },
    importdb: {
      "url": "mongodb://localhost/db_name",
      "mongooptions":{
        "replset": { 
          "rs_name": "somerandomereplsetname" 
        }
      }
    },
    importoptions: {
      //importoptions and exportoptions contains options for your seed imports and exports that will be treated as default options for each respectively
      custom_model_names: {...},
      capitalize_suffix: {...}
    },
    exportoptions: {...},
    exportdb: {...}
  },
  qa: {...}
};
*/
```

### import database (upsert/update) with custom file seed from cli

```
$ node index.js --cli --extension dbseed --task import --file /path/to/file.json
```

### export database to seed file seed from cli

```
$ node index.js --cli --extension dbseed --task export --file /path/to/file.json
```

If no file path is specified, the default file path is `content/files/backups/seeds/dbseed-[year]-[month]-[day]-[timestamp].json`

### import sample from cli

```
$ node index.js --cli --extension dbseed --task sampledata
```

### empty the database (WARNING THIS AWALYS EXPORTS A BACK UP) sample from cli

```
$ node index.js --cli --extension dbseed --task empty --confirm
```
TThe file path is `content/files/backups/dbemptybackup-[year]-[month]-[day]-[timestamp].json`

##Development
*Make sure you have grunt installed*
```
$ npm install -g grunt-cli
```

Then run grunt watch
```
$ grunt watch
```
For generating documentation
```
$ grunt doc
$ jsdoc2md controller/*.js lib/*.js index.js install.js uninstall.js > doc/api.md
```
##Notes
* Check out https://github.com/typesettin/periodicjs for the full Periodic Documentation