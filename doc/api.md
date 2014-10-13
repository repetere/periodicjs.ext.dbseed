#Index

**Modules**

* [periodicjs.ext.dbseed](#periodicjs.ext.module_dbseed)
* [cliDBSeedController](#module_cliDBSeedController)
* [dbseedController](#module_dbseedController)

**Functions**

* [index(req, res)](#index)
 
<a name="periodicjs.ext.module_dbseed"></a>
#periodicjs.ext.dbseed
An extension to import json seeds into periodic mongodb.

**Params**

- periodic `object` - variable injection of resources from current periodic instance  

**Author**: Yaw Joseph Etse  
**License**: MIT  
**Copyright**: Copyright (c) 2014 Typesettin. All rights reserved.  
<a name="module_cliDBSeedController"></a>
#cliDBSeedController
cli dbseed controller

**Params**

- resources `object` - variable injection from current periodic instance with references to the active logger and mongo session  

**Returns**: `object` - dbseed cli  
**Author**: Yaw Joseph Etse  
**License**: MIT  
**Copyright**: Copyright (c) 2014 Typesettin. All rights reserved.  
<a name="module_dbseedController"></a>
#dbseedController
dbseed controller

**Params**

- resources `object` - variable injection from current periodic instance with references to the active logger and mongo session  

**Returns**: `object` - dbseed  
**Author**: Yaw Joseph Etse  
**License**: MIT  
**Copyright**: Copyright (c) 2014 Typesettin. All rights reserved.  
<a name="index"></a>
#index(req, res)
uploads seeds via admin interface

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - responds with dbseed page  
