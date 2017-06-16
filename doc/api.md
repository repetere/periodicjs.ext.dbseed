## Functions

<dl>
<dt><a href="#exportCoreData">exportCoreData(core_data_name)</a> ⇒ <code>Promise</code></dt>
<dd><p>exports data from a given core data database model</p>
</dd>
<dt><a href="#exportData">exportData(filepath)</a> ⇒ <code>Promise</code></dt>
<dd><p>exports all data from periodic into a seed file</p>
</dd>
<dt><a href="#formatSeed">formatSeed()</a> ⇒ <code>promise</code></dt>
<dd><p>formatSeed takes a tranform function that should resolve the transformed seed document</p>
</dd>
<dt><a href="#importCoreData">importCoreData(core_data_seeds)</a> ⇒ <code>Promise</code></dt>
<dd><p>this function will take an array object { [core_data_name]:[{array of documents}] } and insert them into the respective core data database</p>
</dd>
<dt><a href="#importData">importData(filepath)</a> ⇒ <code>Promise</code></dt>
<dd><p>imports a seedfile json file path into core data databases</p>
</dd>
</dl>

<a name="exportCoreData"></a>

## exportCoreData(core_data_name) ⇒ <code>Promise</code>
exports data from a given core data database model

**Kind**: global function  
**Returns**: <code>Promise</code> - contents of the core data model seed  

| Param | Type |
| --- | --- |
| core_data_name | <code>string</code> | 

<a name="exportData"></a>

## exportData(filepath) ⇒ <code>Promise</code>
exports all data from periodic into a seed file

**Kind**: global function  
**Returns**: <code>Promise</code> - resolved value from each export from exportCoreData  

| Param | Type |
| --- | --- |
| filepath | <code>string</code> | 

<a name="formatSeed"></a>

## formatSeed() ⇒ <code>promise</code>
formatSeed takes a tranform function that should resolve the transformed seed document

**Kind**: global function  
**Returns**: <code>promise</code> - resolved seed document  

| Param | Type | Description |
| --- | --- | --- |
| options.transform | <code>function</code> | transform function |
| options.seed | <code>function</code> | seed document |

<a name="importCoreData"></a>

## importCoreData(core_data_seeds) ⇒ <code>Promise</code>
this function will take an array object { [core_data_name]:[{array of documents}] } and insert them into the respective core data database

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| core_data_seeds | <code>Object</code> | a core data seed |

<a name="importData"></a>

## importData(filepath) ⇒ <code>Promise</code>
imports a seedfile json file path into core data databases

**Kind**: global function  

| Param | Type |
| --- | --- |
| filepath | <code>string</code> | 

