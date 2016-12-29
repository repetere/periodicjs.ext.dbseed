## Modules

<dl>
<dt><a href="#module_exportseed">exportseed</a> ⇒ <code>object</code></dt>
<dd><p>exportseed module</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#WriteStreamSwitchboard">WriteStreamSwitchboard</a></dt>
<dd><p>Switches between writeStreams dependent on the specified write path</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#emptyUsergroups">emptyUsergroups(err, emptyUsergroupsAsyncCallback)</a> ⇒ <code>function</code></dt>
<dd><p>removes all Usergroups from the database</p>
</dd>
<dt><a href="#emptyUserroles">emptyUserroles(err, emptyUserrolesAsyncCallback)</a> ⇒ <code>function</code></dt>
<dd><p>removes all Userroles from the database</p>
</dd>
<dt><a href="#emptyUserprivileges">emptyUserprivileges(err, emptyUserprivilegesAsyncCallback)</a> ⇒ <code>function</code></dt>
<dd><p>removes all Userprivileges from the database</p>
</dd>
<dt><a href="#emptyCollections">emptyCollections(err, emptyCollectionsAsyncCallback)</a> ⇒ <code>function</code></dt>
<dd><p>removes all Collections from the database</p>
</dd>
<dt><a href="#emptyCompilations">emptyCompilations(err, emptyCompilationsAsyncCallback)</a> ⇒ <code>function</code></dt>
<dd><p>removes all Compilations from the database</p>
</dd>
<dt><a href="#emptyDatas">emptyDatas(err, emptyDatasAsyncCallback)</a> ⇒ <code>function</code></dt>
<dd><p>removes all Datas from the database</p>
</dd>
<dt><a href="#emptyItems">emptyItems(err, emptyItemsAsyncCallback)</a> ⇒ <code>function</code></dt>
<dd><p>removes all Items from the database</p>
</dd>
<dt><a href="#emptyCategories">emptyCategories(err, emptyCategorysAsyncCallback)</a> ⇒ <code>function</code></dt>
<dd><p>removes all Categorys from the database</p>
</dd>
<dt><a href="#emptyTags">emptyTags(err, emptyTagsAsyncCallback)</a> ⇒ <code>function</code></dt>
<dd><p>removes all Tags from the database</p>
</dd>
<dt><a href="#emptyContenttypes">emptyContenttypes(err, emptyContenttypesAsyncCallback)</a> ⇒ <code>function</code></dt>
<dd><p>removes all Contenttypes from the database</p>
</dd>
<dt><a href="#emptyUsers">emptyUsers(err, emptyUsersAsyncCallback)</a> ⇒ <code>function</code></dt>
<dd><p>removes all Users from the database</p>
</dd>
<dt><a href="#emptyAssets">emptyAssets(err, emptyAssetsAsyncCallback)</a> ⇒ <code>function</code></dt>
<dd><p>removes all assets from the database</p>
</dd>
<dt><a href="#emptyDB">emptyDB(options, emptyDBCallback)</a> ⇒ <code>function</code></dt>
<dd><p>empties a database</p>
</dd>
<dt><a href="#sendExportDownload">sendExportDownload(options)</a></dt>
<dd><p>Sets headers and sends download to the client</p>
</dd>
<dt><a href="#handleArchivePartitionedFile">handleArchivePartitionedFile(writeStream, files, [cb])</a> ⇒ <code>Object</code></dt>
<dd><p>Handles the creation of the zip file when seed files are paritioned as part of an export</p>
</dd>
<dt><a href="#export_download">export_download(req)</a></dt>
<dd><p>Middleware used to call export seed function</p>
</dd>
<dt><a href="#import_upload_utils">import_upload_utils()</a></dt>
<dd></dd>
<dt><a href="#setupseeddata">setupseeddata(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Utility function that sets some options for import utility functions</p>
</dd>
<dt><a href="#checkdirexists">checkdirexists(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Utility function that ensures that a file directory exists</p>
</dd>
<dt><a href="#moveseed">moveseed(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Utility function that moves a file from one location to another</p>
</dd>
<dt><a href="#deleteOldUpload">deleteOldUpload(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Utility function that removes an existing seed file from disc</p>
</dd>
<dt><a href="#removeAssetFromDB">removeAssetFromDB(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Utility function will remove an asset from the db</p>
</dd>
<dt><a href="#wipedb">wipedb(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Utility function will wipe the db before seed or immediately resolve the options passed to it</p>
</dd>
<dt><a href="#seeddb">seeddb(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Runs the import command passed a file path to the seed file</p>
</dd>
<dt><a href="#import_customseed">import_customseed(req, res)</a></dt>
<dd><p>Uses JSON data submitted from UI to seed the database</p>
</dd>
<dt><a href="#import_upload">import_upload(req, res)</a></dt>
<dd><p>Imports seed data into database optionally drops original db if option passed</p>
</dd>
<dt><a href="#index">index(req, res)</a></dt>
<dd><p>Loads the index view for dbseed extension</p>
</dd>
<dt><a href="#appendJSONToFile">appendJSONToFile(filePath, writeData)</a> ⇒ <code>Object</code></dt>
<dd><p>Appends json data to json file either being pushing object into data array or merging objects if data property does not exist.  Will also create new file if file does not exist</p>
</dd>
<dt><a href="#writeToFile">writeToFile(options, cb)</a> ⇒ <code>Object</code></dt>
<dd><p>Utility method for writing json data to a file.  Can optionally write data to write stream, append json data to a file or create/overwrite a json file</p>
</dd>
<dt><a href="#getModelSettingsFromFile">getModelSettingsFromFile(filePath, cb)</a> ⇒ <code>Object</code></dt>
<dd><p>Pulls db seed settings out of file.  Will ensure file exists and either requires or reads json data depending on file type</p>
</dd>
<dt><a href="#getModelSettings">getModelSettings(mongooseConnection)</a> ⇒ <code>Object</code></dt>
<dd><p>Infers db seed settings from the models that exist for a given mongoose instance</p>
</dd>
<dt><a href="#getPopulationSettings">getPopulationSettings(options)</a> ⇒ <code>string</code></dt>
<dd><p>Gets a combined population string from a settings object load_model_population and load_multiple_model_population properties</p>
</dd>
<dt><a href="#getMongoQueryStream">getMongoQueryStream(settings)</a> ⇒ <code>Object</code></dt>
<dd><p>Given a settings object function creates a populated mongoose query stream for a model</p>
</dd>
<dt><a href="#setupCompleteSeedFile">setupCompleteSeedFile(options)</a> ⇒ <code>function</code></dt>
<dd><p>Utility function for wrapping output json in an object with a &quot;data&quot; property</p>
</dd>
<dt><a href="#createDataTransformStream">createDataTransformStream()</a> ⇒ <code>Object</code></dt>
<dd><p>Initializes a transform stream that is used to prepend data to a seed file and then push documents to file</p>
</dd>
<dt><a href="#handleEndOfFile">handleEndOfFile(usePartition, batchSize)</a> ⇒ <code>function</code></dt>
<dd><p>Creates a function which tracks the number of documents that have been written to file, the current batch number and the expected number of batches. Process determines the end of file from this data and also returns this data as part once it resolves</p>
</dd>
<dt><a href="#configureWriteQueue">configureWriteQueue(writePath, usePartition, onDrain)</a> ⇒ <code>Object</code></dt>
<dd><p>Configures a queue whose worker writes json data to a writeable stream</p>
</dd>
<dt><a href="#transformDataForSeed">transformDataForSeed(data, operation)</a> ⇒ <code>Object</code></dt>
<dd><p>Runs transform function on data or auto resolves data if there is an error or if operation argument is not a function</p>
</dd>
<dt><a href="#configureQueryStreams">configureQueryStreams(options, queue)</a> ⇒ <code>Object</code></dt>
<dd><p>Configures mongo query streams for all models on a mongoose instance to push data into queue on &quot;data&quot;</p>
</dd>
<dt><a href="#ensureDBConnection">ensureDBConnection([mongooseConnection])</a> ⇒ <code>Object</code></dt>
<dd><p>Ensures that correct mongo db instance is used and has properly connected</p>
</dd>
<dt><a href="#ensureExportDirectory">ensureExportDirectory(outputPath)</a> ⇒ <code>Object</code></dt>
<dd><p>Ensures the directory seed file is being written to exists</p>
</dd>
<dt><a href="#createSeed">createSeed(options, cb)</a> ⇒ <code>Object</code></dt>
<dd><p>Runs full create seed suite</p>
</dd>
<dt><a href="#exportSeed">exportSeed(options, [cb])</a> ⇒ <code>Object</code></dt>
<dd><p>Runs full create seed suite and formats response</p>
</dd>
<dt><a href="#readSeedFromFile">readSeedFromFile(file)</a> ⇒ <code>Object</code></dt>
<dd><p>Handles resolving seed document data</p>
</dd>
<dt><a href="#transformDataForSeed">transformDataForSeed(data, operation)</a> ⇒ <code>Object</code></dt>
<dd><p>Runs transform function on data or auto resolves data if there is an error or if operation argument is not a function</p>
</dd>
<dt><a href="#ensureDBConnection">ensureDBConnection([mongooseConnection])</a> ⇒ <code>Object</code></dt>
<dd><p>Ensures that correct mongo db instance is used and has properly connected</p>
</dd>
<dt><a href="#setupInsertTask">setupInsertTask(options)</a> ⇒ <code>function</code></dt>
<dd><p>Configures a queue task function that inserts data into database from the seed file</p>
</dd>
<dt><a href="#reorderDataByImportOrder">reorderDataByImportOrder(datas, [order])</a> ⇒ <code>Array</code></dt>
<dd><p>Orders data by the order in which they should be inserted into the database</p>
</dd>
<dt><a href="#handleParallelInsertQueue">handleParallelInsertQueue(data, queue, [order])</a> ⇒ <code>Object</code></dt>
<dd><p>Handles database inserts in parallel</p>
</dd>
<dt><a href="#handleSeriesInsertQueue">handleSeriesInsertQueue(data, queue, [order])</a> ⇒ <code>Object</code></dt>
<dd><p>Handles database inserts in series organized by document datatype</p>
</dd>
<dt><a href="#configureCreateQueue">configureCreateQueue(options, Returns)</a></dt>
<dd><p>Configures create queue which takes data from seed file and inserts into the database</p>
</dd>
<dt><a href="#importSeed">importSeed(options, [cb])</a> ⇒ <code>Object</code></dt>
<dd><p>Method for importing seed data</p>
</dd>
</dl>

<a name="module_exportseed"></a>

## exportseed ⇒ <code>object</code>
exportseed module

**Returns**: <code>object</code> - dbseed  
**Requires**: <code>module:async</code>, <code>module:periodicjs.core.utilities</code>, <code>module:periodicjs.core.controller</code>  
**{@link**: https://github.com/typesettin/periodicjs.ext.dbseed}  
**Author:** Yaw Joseph Etse  
**License**: MIT  
**Copyright**: Copyright (c) 2014 Typesettin. All rights reserved.  

| Param | Type | Description |
| --- | --- | --- |
| resources | <code>object</code> | variable injection from current periodic instance with references to the active logger and mongo session |

<a name="WriteStreamSwitchboard"></a>

## WriteStreamSwitchboard
Switches between writeStreams dependent on the specified write path

**Kind**: global class  

* [WriteStreamSwitchboard](#WriteStreamSwitchboard)
    * [new WriteStreamSwitchboard(data)](#new_WriteStreamSwitchboard_new)
    * [.getStream(data, [batches])](#WriteStreamSwitchboard+getStream) ⇒ <code>Object</code>

<a name="new_WriteStreamSwitchboard_new"></a>

### new WriteStreamSwitchboard(data)
Constructor for WriteStreamSwitchboard class

**Returns**: <code>Object</code> - Returns a fs writeable stream  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | json data to be written to file |
| data.datatype | <code>string</code> | Data must contain datatype property which is used to determine write path |

<a name="WriteStreamSwitchboard+getStream"></a>

### writeStreamSwitchboard.getStream(data, [batches]) ⇒ <code>Object</code>
Retrieves a write stream from the private var streamHolder or creates a write stream if there is no applicable stream. A new stream is created when either a new collection begins exporting or once a batch size limit is reached and a new file must be created

**Kind**: instance method of <code>[WriteStreamSwitchboard](#WriteStreamSwitchboard)</code>  
**Returns**: <code>Object</code> - The write stream that will be used in writing export data  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Collection data used to retrieve or create a write stream from streamHolder |
| data.datatype | <code>string</code> | The name of the collection being exported |
| [batches] | <code>number</code> | If batchsize limit is specified the current batch number used in creating a new write stream |

<a name="emptyUsergroups"></a>

## emptyUsergroups(err, emptyUsergroupsAsyncCallback) ⇒ <code>function</code>
removes all Usergroups from the database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyUsergroupsAsyncCallback(err,results);  

| Param | Type |
| --- | --- |
| err | <code>object</code> | 
| emptyUsergroupsAsyncCallback | <code>function</code> | 

<a name="emptyUserroles"></a>

## emptyUserroles(err, emptyUserrolesAsyncCallback) ⇒ <code>function</code>
removes all Userroles from the database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyUserrolesAsyncCallback(err,results);  

| Param | Type |
| --- | --- |
| err | <code>object</code> | 
| emptyUserrolesAsyncCallback | <code>function</code> | 

<a name="emptyUserprivileges"></a>

## emptyUserprivileges(err, emptyUserprivilegesAsyncCallback) ⇒ <code>function</code>
removes all Userprivileges from the database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyUserprivilegesAsyncCallback(err,results);  

| Param | Type |
| --- | --- |
| err | <code>object</code> | 
| emptyUserprivilegesAsyncCallback | <code>function</code> | 

<a name="emptyCollections"></a>

## emptyCollections(err, emptyCollectionsAsyncCallback) ⇒ <code>function</code>
removes all Collections from the database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyCollectionsAsyncCallback(err,results);  

| Param | Type |
| --- | --- |
| err | <code>object</code> | 
| emptyCollectionsAsyncCallback | <code>function</code> | 

<a name="emptyCompilations"></a>

## emptyCompilations(err, emptyCompilationsAsyncCallback) ⇒ <code>function</code>
removes all Compilations from the database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyCompilationsAsyncCallback(err,results);  

| Param | Type |
| --- | --- |
| err | <code>object</code> | 
| emptyCompilationsAsyncCallback | <code>function</code> | 

<a name="emptyDatas"></a>

## emptyDatas(err, emptyDatasAsyncCallback) ⇒ <code>function</code>
removes all Datas from the database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyDatasAsyncCallback(err,results);  

| Param | Type |
| --- | --- |
| err | <code>object</code> | 
| emptyDatasAsyncCallback | <code>function</code> | 

<a name="emptyItems"></a>

## emptyItems(err, emptyItemsAsyncCallback) ⇒ <code>function</code>
removes all Items from the database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyItemsAsyncCallback(err,results);  

| Param | Type |
| --- | --- |
| err | <code>object</code> | 
| emptyItemsAsyncCallback | <code>function</code> | 

<a name="emptyCategories"></a>

## emptyCategories(err, emptyCategorysAsyncCallback) ⇒ <code>function</code>
removes all Categorys from the database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyCategorysAsyncCallback(err,results);  

| Param | Type |
| --- | --- |
| err | <code>object</code> | 
| emptyCategorysAsyncCallback | <code>function</code> | 

<a name="emptyTags"></a>

## emptyTags(err, emptyTagsAsyncCallback) ⇒ <code>function</code>
removes all Tags from the database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyTagsAsyncCallback(err,results);  

| Param | Type |
| --- | --- |
| err | <code>object</code> | 
| emptyTagsAsyncCallback | <code>function</code> | 

<a name="emptyContenttypes"></a>

## emptyContenttypes(err, emptyContenttypesAsyncCallback) ⇒ <code>function</code>
removes all Contenttypes from the database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyContenttypesAsyncCallback(err,results);  

| Param | Type |
| --- | --- |
| err | <code>object</code> | 
| emptyContenttypesAsyncCallback | <code>function</code> | 

<a name="emptyUsers"></a>

## emptyUsers(err, emptyUsersAsyncCallback) ⇒ <code>function</code>
removes all Users from the database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyUsersAsyncCallback(err,results);  

| Param | Type |
| --- | --- |
| err | <code>object</code> | 
| emptyUsersAsyncCallback | <code>function</code> | 

<a name="emptyAssets"></a>

## emptyAssets(err, emptyAssetsAsyncCallback) ⇒ <code>function</code>
removes all assets from the database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyAssetsAsyncCallback(err,results);  

| Param | Type |
| --- | --- |
| err | <code>object</code> | 
| emptyAssetsAsyncCallback | <code>function</code> | 

<a name="emptyDB"></a>

## emptyDB(options, emptyDBCallback) ⇒ <code>function</code>
empties a database

**Kind**: global function  
**Returns**: <code>function</code> - async callback emptyDBCallback(err,results);  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | filepath,limits-tags,collections,etc |
| emptyDBCallback | <code>object</code> |  |

<a name="sendExportDownload"></a>

## sendExportDownload(options)
Sets headers and sends download to the client

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for sending the download |
| options.res | <code>Object</code> | Express response object used for sending download |
| options.filePath | <code>string</code> | Path to the file that is being downloaded |

<a name="handleArchivePartitionedFile"></a>

## handleArchivePartitionedFile(writeStream, files, [cb]) ⇒ <code>Object</code>
Handles the creation of the zip file when seed files are paritioned as part of an export

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise if cb argument is not passed  

| Param | Type | Description |
| --- | --- | --- |
| writeStream | <code>Object</code> | A writable stream which the zip data will be piped to |
| files | <code>Array</code> | An array of file paths for the seed files |
| [cb] | <code>function</code> | Optional callback will return a Promise if not passed |

<a name="export_download"></a>

## export_download(req)
Middleware used to call export seed function

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| req.body | <code>Object</code> | Contains configuration options for the seed export |
| req.body.partition | <code>Boolean</code> | If true separate seed files will be created for different schemas in db and a zip file will be downloaded |
| req.body.outputPath | <code>string</code> | Determines where the seed file will be created and its filename |

<a name="import_upload_utils"></a>

## import_upload_utils()
**Kind**: global function  
<a name="setupseeddata"></a>

## setupseeddata(options) ⇒ <code>Object</code>
Utility function that sets some options for import utility functions

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise which resolves to the options passed to the function and appended options  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration options for seed |
| options.seedpath | <code>string</code> | Initial file path to the seed file |
| options.useExistingSeed | <code>Boolean</code> | If true an additional originalseeduploadpath option will be added to the options object a set to a file path in the public directory |

<a name="checkdirexists"></a>

## checkdirexists(options) ⇒ <code>Object</code>
Utility function that ensures that a file directory exists

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise which resolves the options passed to the function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration options for seed |
| options.useExistingSeed | <code>Boolean</code> | If true execution of the function is skipped |
| options.uploadseeddir | <code>string</code> | Directory the seed file should be uploaded to |

<a name="moveseed"></a>

## moveseed(options) ⇒ <code>Object</code>
Utility function that moves a file from one location to another

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise which resolves the options passed to the function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>options</code> | Configuration options for seed |
| options.useExistingSeed | <code>Boolean</code> | If true execution of the function is skipped |
| options.originalseeduploadpath | <code>string</code> | The path to the file to be moved |
| options.newseedpath | <code>string</code> | The path to the new file location |

<a name="deleteOldUpload"></a>

## deleteOldUpload(options) ⇒ <code>Object</code>
Utility function that removes an existing seed file from disc

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise which resolves the options passed to the function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration options for seed |
| options.useExistingSeed | <code>Boolean</code> | If true execution of the function is skipped |
| options.originalseeduploadpath | <code>string</code> | Path to the file that should be removed |

<a name="removeAssetFromDB"></a>

## removeAssetFromDB(options) ⇒ <code>Object</code>
Utility function will remove an asset from the db

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise which resolves to the options passed to the function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration options for seed |
| [options.assetid] | <code>string</code> | If passed the asset will be removed from the db |

<a name="wipedb"></a>

## wipedb(options) ⇒ <code>Object</code>
Utility function will wipe the db before seed or immediately resolve the options passed to it

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise which resolves the options passed to the function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration options for seed |
| [options.wipecheckbox] | <code>Boolean</code> | If true a seed file of the existing database will be created an then the db will be emptied |

<a name="seeddb"></a>

## seeddb(options) ⇒ <code>Object</code>
Runs the import command passed a file path to the seed file

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a promise that resolves to import result  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration options for seed |
| options.newseedpath | <code>string</code> | File path or directory path to be used for seeding the db |

<a name="import_customseed"></a>

## import_customseed(req, res)
Uses JSON data submitted from UI to seed the database

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| req.body | <code>Object</code> | Contains configuration options for seed import |
| req.body.customseedjson | <code>Object</code> | Data to be used in seeding the database |
| res | <code>Object</code> | Express response object |

<a name="import_upload"></a>

## import_upload(req, res)
Imports seed data into database optionally drops original db if option passed

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| req.body | <code>Object</code> | Contains configuration options for seed import |
| req.body.previousseed | <code>string</code> | If true the seed file will be pulled from the public directory |
| res | <code>Object</code> | Express response object |

<a name="index"></a>

## index(req, res)
Loads the index view for dbseed extension

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| req.user | <code>Object</code> | Periodic user |
| res | <code>Object</code> | Express response object |

<a name="appendJSONToFile"></a>

## appendJSONToFile(filePath, writeData) ⇒ <code>Object</code>
Appends json data to json file either being pushing object into data array or merging objects if data property does not exist.  Will also create new file if file does not exist

**Kind**: global function  
**Returns**: <code>Object</code> - Function returns an Promise  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | Path to json file |
| writeData | <code>Object</code> | JSON data to be appended to file |

<a name="writeToFile"></a>

## writeToFile(options, cb) ⇒ <code>Object</code>
Utility method for writing json data to a file.  Can optionally write data to write stream, append json data to a file or create/overwrite a json file

**Kind**: global function  
**Returns**: <code>Object</code> - If no cb argument is not passed returns a Promise  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options object for function |
| options.writeStream | <code>Object</code> | fs writeable stream object.  Defaults to writing json data to stream if this option is passed |
| options.writeData | <code>string</code> &#124; <code>Object</code> | JSON data to be written to file.  Must be stringified if writeStream option is passed |
| options.filePath | <code>string</code> | Path to json file |
| options.overwrite | <code>Boolean</code> | Optional flag which determines if file will be overwritten with json data or if data should be appended to file |
| cb | <code>function</code> | Optional callback |

<a name="getModelSettingsFromFile"></a>

## getModelSettingsFromFile(filePath, cb) ⇒ <code>Object</code>
Pulls db seed settings out of file.  Will ensure file exists and either requires or reads json data depending on file type

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise if no callback function is passed  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | Optional path to settings file.  Will default to periodic app controller_settings.js file if none is specified |
| cb | <code>function</code> | Options callback function |

<a name="getModelSettings"></a>

## getModelSettings(mongooseConnection) ⇒ <code>Object</code>
Infers db seed settings from the models that exist for a given mongoose instance

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a settings object that contains model_name and load_model_population properties  

| Param | Type | Description |
| --- | --- | --- |
| mongooseConnection | <code>Object</code> | Mongoose connection object |

<a name="getPopulationSettings"></a>

## getPopulationSettings(options) ⇒ <code>string</code>
Gets a combined population string from a settings object load_model_population and load_multiple_model_population properties

**Kind**: global function  
**Returns**: <code>string</code> - A population string with only unique values  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Population settings from the controller_settings object for a given schema |

<a name="getMongoQueryStream"></a>

## getMongoQueryStream(settings) ⇒ <code>Object</code>
Given a settings object function creates a populated mongoose query stream for a model

**Kind**: global function  
**Returns**: <code>Object</code> - Mongoose query stream  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Settings object created by getModelSettings or getModelSettingsFromFile |
| settings.model_name | <code>string</code> | Name of the mongoose model |

<a name="setupCompleteSeedFile"></a>

## setupCompleteSeedFile(options) ⇒ <code>function</code>
Utility function for wrapping output json in an object with a "data" property

**Kind**: global function  
**Returns**: <code>function</code> - Returns a function used for finalizing the seed file by wrapping it in a object and setting it to the data property of that object  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the seed file creation finalize function |
| options.records | <code>Object</code> &#124; <code>Number</code> | Total count of inserted records or an object containing total records indexed by datatype |
| options.usePartition | <code>Boolean</code> | Boolean flag describing if seperate files were created for each of the different data types |
| options.writePath | <code>string</code> | Absolute path for the JSON seed file |

<a name="setupCompleteSeedFile..completeFile"></a>

### setupCompleteSeedFile~completeFile(wp, callback)
Completes creation of seed file by reading file and wrapping data in an object under the "data" property

**Kind**: inner method of <code>[setupCompleteSeedFile](#setupCompleteSeedFile)</code>  

| Param | Type | Description |
| --- | --- | --- |
| wp | <code>string</code> | Path to the un-finalized seed file |
| callback | <code>function</code> | Callback function |

<a name="createDataTransformStream"></a>

## createDataTransformStream() ⇒ <code>Object</code>
Initializes a transform stream that is used to prepend data to a seed file and then push documents to file

**Kind**: global function  
**Returns**: <code>Object</code> - instance of Transform Stream  
<a name="handleEndOfFile"></a>

## handleEndOfFile(usePartition, batchSize) ⇒ <code>function</code>
Creates a function which tracks the number of documents that have been written to file, the current batch number and the expected number of batches. Process determines the end of file from this data and also returns this data as part once it resolves

**Kind**: global function  
**Returns**: <code>function</code> - Returns a function that handles tracking the total number of documents, batch size limits etc.  

| Param | Type | Description |
| --- | --- | --- |
| usePartition | <code>Boolean</code> | If true batch size limit will be respected and files will be truncated at that limit |
| batchSize | <code>number</code> | The max number of documents that should be in a file |

<a name="configureWriteQueue"></a>

## configureWriteQueue(writePath, usePartition, onDrain) ⇒ <code>Object</code>
Configures a queue whose worker writes json data to a writeable stream

**Kind**: global function  
**Returns**: <code>Object</code> - Returns async queue object  

| Param | Type | Description |
| --- | --- | --- |
| writePath | <code>string</code> | Optional file path for the data write will default to ./seed_data.json if argument is undefined |
| usePartition | <code>Boolean</code> | If true seperate json files will be created for each collection.  Files names will match writePath with appended collection name |
| onDrain | <code>function</code> | Function to be called once last task is returned from worker |

<a name="transformDataForSeed"></a>

## transformDataForSeed(data, operation) ⇒ <code>Object</code>
Runs transform function on data or auto resolves data if there is an error or if operation argument is not a function

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Document from mongoose collection |
| operation | <code>function</code> | Transform function to be run on the given data object |

<a name="configureQueryStreams"></a>

## configureQueryStreams(options, queue) ⇒ <code>Object</code>
Configures mongo query streams for all models on a mongoose instance to push data into queue on "data"

**Kind**: global function  
**Returns**: <code>Object</code> - Mongo query streams indexed by document type  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for configuring functionality of query streams |
| options.model_settings | <code>Object</code> | Object containing schema data for all schemas on mongoose instance indexed by document type |
| [options.transform_configuration] | <code>Object</code> | A set of transform functions indexed by document type |
| [options.skipUserSeeds] | <code>Boolean</code> &#124; <code>string</code> | If any non-falsy value is passed model wont be included in seed this option can be set for different models following the same pattern "skip" + "model name" + "seeds" |
| queue | <code>Object</code> | Async queue or any queue that has a push method which accepts a data and cb argument |

<a name="ensureDBConnection"></a>

## ensureDBConnection([mongooseConnection]) ⇒ <code>Object</code>
Ensures that correct mongo db instance is used and has properly connected

**Kind**: global function  
**Returns**: <code>Object</code> - Connected mongoose instance  

| Param | Type | Description |
| --- | --- | --- |
| [mongooseConnection] | <code>Object</code> | A connected mongoose instance if this argument is passed it will be assumed that this connection should be used |

<a name="ensureExportDirectory"></a>

## ensureExportDirectory(outputPath) ⇒ <code>Object</code>
Ensures the directory seed file is being written to exists

**Kind**: global function  
**Returns**: <code>Object</code> - Promise that resolves once directory has been ensured  

| Param | Type | Description |
| --- | --- | --- |
| outputPath | <code>string</code> | The path to either the parent directory or the full file path |

<a name="createSeed"></a>

## createSeed(options, cb) ⇒ <code>Object</code>
Runs full create seed suite

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise if callback is not passed  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options object for create seed function |
| options.useConfigurationFile | <code>Boolean</code> | Default behavior is to infer settings from the mongoose instance set this property to true in order to pull settings from config file |
| options.configPath | <code>string</code> | If using configuration file this sets the path to that file |
| options.mongooseConnection | <code>Object</code> | Mongoose instance to be used in seed defaults to the current periodic instance |
| options.outputPath | <code>string</code> | Path for seed json file |
| options.partition | <code>Boolean</code> | Will create separate json seed file per collection if true |
| cb | <code>function</code> | Optional callback function |

<a name="exportSeed"></a>

## exportSeed(options, [cb]) ⇒ <code>Object</code>
Runs full create seed suite and formats response

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise if callback is not passed  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options object for create seed function |
| [options.useConfigurationFile] | <code>Boolean</code> | Default behavior is to infer settings from the mongoose instance set this property to true in order to pull settings from config file |
| [options.configPath] | <code>string</code> | If using configuration file this sets the path to that file |
| [options.mongooseConnection] | <code>Object</code> | Mongoose instance to be used in seed defaults to the current periodic instance |
| [options.outputPath] | <code>string</code> | Path for seed json file |
| [options.partition] | <code>Boolean</code> | Will create separate json seed file per collection if true |
| [cb] | <code>function</code> | Optional callback function will return a Promise if cb arugment is not passed |

<a name="readSeedFromFile"></a>

## readSeedFromFile(file) ⇒ <code>Object</code>
Handles resolving seed document data

**Kind**: global function  
**Returns**: <code>Object</code> - Return a Promise which resolves to the seed data or combined seed data in the case the file is a directory path  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> &#124; <code>Object</code> | Can be a file path, directory path, stringified object or regular json object |

<a name="transformDataForSeed"></a>

## transformDataForSeed(data, operation) ⇒ <code>Object</code>
Runs transform function on data or auto resolves data if there is an error or if operation argument is not a function

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Document from mongoose collection |
| operation | <code>function</code> | Transform function to be run on the given data object |

<a name="ensureDBConnection"></a>

## ensureDBConnection([mongooseConnection]) ⇒ <code>Object</code>
Ensures that correct mongo db instance is used and has properly connected

**Kind**: global function  
**Returns**: <code>Object</code> - Connected mongoose instance  

| Param | Type | Description |
| --- | --- | --- |
| [mongooseConnection] | <code>Object</code> | A connected mongoose instance if this argument is passed it will be assumed that this connection should be used |

<a name="setupInsertTask"></a>

## setupInsertTask(options) ⇒ <code>function</code>
Configures a queue task function that inserts data into database from the seed file

**Kind**: global function  
**Returns**: <code>function</code> - Returns a queue task function that will perform transform and insertion of data  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration options for the database seed |
| [options.mongooseConnection] | <code>Object</code> | A mongoose instance |
| [options.custom_model_names] | <code>Object</code> | Associates mongoose model name to it registered model name ie. { userdata: 'UserData' } |
| [options.capitalize_suffix] | <code>string</code> | Modifies the model name by replacing matching suffix with its capitalized version ie. 'data' -> 'userData' |
| options.transform_configuration | <code>Object</code> | An object with transform functions indexed by datatype. Transform is run on data prior to insertion into the database |

<a name="reorderDataByImportOrder"></a>

## reorderDataByImportOrder(datas, [order]) ⇒ <code>Array</code>
Orders data by the order in which they should be inserted into the database

**Kind**: global function  
**Returns**: <code>Array</code> - Returns ordered array of data or returns original array of order argument is not passed or is not an object  

| Param | Type | Description |
| --- | --- | --- |
| datas | <code>Array</code> | A set of data that should be ordered by priority |
| [order] | <code>Object</code> | An object indexed by datatype that describes the order in which the documents should be inserted |

<a name="handleParallelInsertQueue"></a>

## handleParallelInsertQueue(data, queue, [order]) ⇒ <code>Object</code>
Handles database inserts in parallel

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise which resolves once queue has cleared  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array</code> | An array of data to be inserted |
| queue | <code>Object</code> | Async queue or any other queue with a push method that accepts data and callback parameters |
| [order] | <code>Object</code> | An object indexed by datatype that describes the order in which the documents should be inserted |

<a name="handleSeriesInsertQueue"></a>

## handleSeriesInsertQueue(data, queue, [order]) ⇒ <code>Object</code>
Handles database inserts in series organized by document datatype

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise which resolves once queue has cleared  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array</code> | An array of arrays split by document datatype |
| queue | <code>Object</code> | Async queue or any other queue with a push method that accepts data and callback parameters |
| [order] | <code>Object</code> | An object indexed by datatype that describes the order in which the documents should be inserted |

<a name="configureCreateQueue"></a>

## configureCreateQueue(options, Returns)
Configures create queue which takes data from seed file and inserts into the database

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration options for the database seed |
| [options.use_series] | <code>Boolean</code> | If true database will be seeded with data in series by datatype |
| Returns | <code>Object</code> | a Promise which resolves once creation queue has cleared |

<a name="importSeed"></a>

## importSeed(options, [cb]) ⇒ <code>Object</code>
Method for importing seed data

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a Promise if cb argument is not passed  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the database import |
| options.file | <code>string</code> &#124; <code>Object</code> | Seed data which can either be a file path, stringified JSON object or a JSON object |
| [options.use_series] | <code>Boolean</code> | If true database will be seeded with data in series by datatype |
| [options.mongooseConnection] | <code>Object</code> | A mongoose instance |
| [options.custom_model_names] | <code>Object</code> | Associates mongoose model name to it registered model name ie. { userdata: 'UserData' } |
| [options.capitalize_suffix] | <code>string</code> | Modifies the model name by replacing matching suffix with its capitalized version ie. 'data' -> 'userData' |
| [cb] | <code>function</code> | Callback function |

