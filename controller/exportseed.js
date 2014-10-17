'use strict';
var async = require('async'),
	fs = require('fs-extra'),
	path = require('path'),
	Utilities = require('periodicjs.core.utilities'),
	ControllerHelper = require('periodicjs.core.controller'),
	CoreUtilities,
	CoreController,
	appSettings,
	mongoose,
	logger;

var UsersObj,
	User, // = mongoose.model('User')
	Users = [],
	Users_namehash = {},
	Users_namehash_array = [],
	ItemsObj,
	Item, // = mongoose.model('Item')
	Items = [],
	Items_namehash = {},
	Items_namehash_array = [],
	AssetsObj,
	Asset, //  = mongoose.model('Asset')
	Assets = [],
	Assets_namehash_array = [],
	Assets_namehash = {},
	ContenttypesObj,
	Contenttype, // = mongoose.model('Contenttype')
	Contenttypes = [],
	Contenttypes_namehash_array = [],
	Contenttypes_namehash = {},
	CategoriesObj,
	Category, // = mongoose.model('Category')
	Categories = [],
	Categories_namehash_array = [],
	Categories_namehash = {},
	TagsObj,
	Tag, // = mongoose.model('Tag')
	Tags = [],
	Tags_namehash_array = [],
	Tags_namehash = {},
	CollectionsObj,
	Collection, // = mongoose.model('Collection')
	Collections = [],
	Collections_namehash_array = [],
	Collections_namehash = {},
	UserprivilegesObj,
	Userprivilege, // = mongoose.model('Userprivilege')
	Userprivileges = [],
	Userprivileges_userprivilegeid_array = [],
	Userprivileges_namehash = {},
	UserrolesObj,
	Userrole, // = mongoose.model('Userrole')
	Userroles = [],
	Userroles_userroleid_array = [],
	Userroles_namehash = {},
	UsergroupsObj,
	Usergroup, // = mongoose.model('Usergroup')
	Usergroups = [],
	Usergroups_usergroupid_array = [],
	Usergroups_namehash = {},
	exportSeedDocumentErrors,
	validDocuments,
	invalidDocuments,
	exportSeedFilePath,
	exportSeedErrorsArray = [],
	exportSeedData={},	
	exportSeedDataArray=[],
	d = new Date(),
	defaultExportDir = 'content/backups/seeds/',
	defaultExportFileName = 'dbseed'+'-' + d.getUTCFullYear() + '-' + d.getUTCMonth() + '-' + d.getUTCDate()+'-' + d.getTime()+'.json';
/**
 * exports a seed data to seeds format
 * @param  {object} options - filepath,limits-tags,collections,etc
 * @param  {object} writeSeedToDiskCallback
 * @return {Function} async callback writeSeedToDiskCallback(err,results);
 */
var writeSeedToDisk = function(writeSeedToDiskCallback){
	console.log('writeSeedToDisk exportSeedFilePath',exportSeedFilePath);
	exportSeedData.data = exportSeedDataArray;
	fs.outputJson(exportSeedFilePath, exportSeedData, function (err) {
		if(err){
			exportSeedErrorsArray.push({
				error:err,
				errortype:'writeSeedToDisk'
			});
		}
		writeSeedToDiskCallback(null,'file written created');
	});
};

/**
 * return seed format for a tags object
 * @return {object}     tags[name]
 */
var getTagsFromDoc = function(tags){
	var tagsArray = [];
	if(tags.length>0){
		for(var ta=0 ; ta<tags.length; ta++){
			if(tags[ta].name){
				tagsArray.push(tags[ta].name);
			}
		}	
	}
	return tagsArray;
};

/**
 * return seed format for a authors object
 * @return {object}     authors[name]
 */
var getAuthorsFromDoc = function(authors){
	var authorsArray = [];
	if(authors.length>0){
		for(var gafd=0 ; gafd<authors.length; gafd++){
			if(authors[gafd].username){
				authorsArray.push(authors[gafd].username);
			}
		}	
	}
	return authorsArray;
};

/**
 * return seed format for a categories object
 * @return {object}     categories[name]
 */
var getCategoriesFromDoc = function(categories){
	var categoriesArray = [];
	if(categories.length>0){
		for(var gcfd=0 ; gcfd<categories.length; gcfd++){
			if(categories[gcfd] && categories[gcfd].name){
				categoriesArray.push(categories[gcfd].name);
			}
		}	
	}
	return categoriesArray;
};

/**
 * return seed format for a contenttypes object
 * @return {object}     contenttypes[name]
 */
var getContenttypesFromDoc = function(contenttypes){
	var contenttypesArray = [];
	if(contenttypes.length>0){
		for(var gctfd = 0; gctfd<contenttypes.length; gctfd++){
			if(contenttypes[gctfd].name){
				contenttypesArray.push(contenttypes[gctfd].name);
			}
		}	
	}
	return contenttypesArray;
};

/**
 * return seed format for a assets object
 * @return {object}     assets[name]
 */
var getAssetsFromDoc = function(assets){
	var assetsArray = [];
	if(assets.length>0){
		for(var gafd = 0; gafd<assets.length; gafd++){
			if(assets[gafd].name){
				assetsArray.push(assets[gafd].name);
			}
		}	
	}
	return assetsArray;
};

/**
 * return seed format for a primary author object
 * @return {object}     primaryauthor.name
 */
var getPrimaryAuthorFromDoc = function(primaryauthor){
	return (primaryauthor && primaryauthor.username)? primaryauthor.username : '';
};

/**
 * return seed format for a primary asset object
 * @return {object}     primaryasset.name
 */
var getPrimaryAssetFromDoc = function(primaryasset){
	return (primaryasset && primaryasset.name)? primaryasset.name : '';
};

/**
 * return seed format for an asset object
 * @param  {object} doc mongo document
 * @return {object}     seed object
 */
var getItemSeed = function(doc){
	var returnseed = {
		datatype:'item',
		datadocument:{}
	};
	returnseed.datadocument.random = doc.random;
	returnseed.datadocument.title = doc.title;
	returnseed.datadocument.name = doc.name;
	returnseed.datadocument.content = doc.content;
	returnseed.datadocument.collectionitemonly = doc.collectionitemonly;
	returnseed.datadocument.updatedat = doc.updatedat;
	returnseed.datadocument.createdat = doc.createdat;
	returnseed.datadocument.publishat = doc.publishat;
	returnseed.datadocument.entitytype = doc.entitytype;
	returnseed.datadocument.status = doc.status;

	if(typeof doc.contenttypeattributes!=='undefined'){
		returnseed.datadocument.contenttypeattributes = doc.contenttypeattributes;
	}
	if(typeof doc.itemauthorname!=='undefined'){
		returnseed.datadocument.itemauthorname = doc.itemauthorname;
	}
	if(doc.primaryauthor){
		returnseed.datadocument.primaryauthor = getPrimaryAuthorFromDoc(doc.primaryauthor);
	}
	if(doc.primaryasset){
		returnseed.datadocument.primaryasset = getPrimaryAssetFromDoc(doc.primaryasset);
	}
	if(doc.contenttypeattributes){
		returnseed.datadocument.contenttypeattributes = doc.contenttypeattributes;
	}
	if(doc.link){
		returnseed.datadocument.link = doc.link;
	}
	if(doc.changes){
		returnseed.datadocument.changes = doc.changes;
	}
	if(doc.tags){
		returnseed.datadocument.tags = getTagsFromDoc(doc.tags);
	}
	if(doc.categories){
		returnseed.datadocument.categories = getCategoriesFromDoc(doc.categories);
	}
	if(doc.contenttypes){
		returnseed.datadocument.contenttypes = getContenttypesFromDoc(doc.contenttypes);
	}
	if(doc.authors){
		returnseed.datadocument.authors = getAuthorsFromDoc(doc.authors);
	}
	if(doc.assets){
		returnseed.datadocument.assets = getAssetsFromDoc(doc.assets);
	}
	if(doc.visibility){
		returnseed.datadocument.visibility = doc.visibility;
	}
	if(doc.visibilitypassword){
		returnseed.datadocument.visibilitypassword = doc.visibilitypassword;
	}
	if(doc.extensionattributes){
		returnseed.datadocument.extensionattributes = doc.extensionattributes;
	}
	if(doc.originalitem){
		returnseed.datadocument.originalitem = doc.originalitem;
	}
			
	return returnseed;
};

/**
 * return seed format for an asset object
 * @param  {object} doc mongo document
 * @return {object}     seed object
 */
var getAssetSeed = function(doc){
	var returnseed = {
		datatype:'asset',
		datadocument:{
			random:doc.random,
			primaryauthor:getPrimaryAuthorFromDoc(doc.primaryauthor)
		}
	};
	// try{
	// 	seed.datadocument.primaryauthor = getPrimaryAuthorFromAuthorDoc(doc.primaryauthor);
	// }
	// catch(e){
	// 	exportSeedErrorsArray.push({
	// 		error:e,
	// 		errortype:'getAssetSeed'
	// 	});
	// 	seed.datadocument=e;
	// }
	console.log(returnseed);
	return returnseed;
};


/**
 * create item seeds from the database, if there are assets
 * @param  {object} err
 * @param  {Function} createAssetSeedsAsyncCallback
 * @return {Function} async callback createAssetSeedsAsyncCallback(err,results);
 */
var createItemSeeds = function(createItemSeedsAsyncCallback){
	Item.find({}).select('-_id status entitytype publishat createdat updatedat title name content contenttypes tags categories assets primaryasset authors primaryauthor source collectionitemonly itemauthorname originalitem changes link visibility visiblitypassword contenttypeattributes extentionattributes random').populate('tags categories assets primaryasset authors contenttypes primaryauthor').exec(function(err,Items){
		if(err){
			exportSeedErrorsArray.push({
				error:err,
				errortype:'createItemSeeds'
			});
		}
		if(Items){
			for(var i in Items){
				var itemdoc = Items[i];
				exportSeedDataArray.push(getItemSeed(itemdoc));
			}
		}
		createItemSeedsAsyncCallback(null,'created item seeds');
	});
};

/**
 * create asset seeds from the database, if there are assets
 * @param  {object} err
 * @param  {Function} createAssetSeedsAsyncCallback
 * @return {Function} async callback createAssetSeedsAsyncCallback(err,results);
 */
var createAssetSeeds = function(createAssetSeedsAsyncCallback){
	Asset.find({}).select('-_id title name status createdat author entitytype userid username assettype contenttypes fileurl locationtype description content filedata attributes contenttypeattributes extentionattributes random').populate('author contenttypes').exec(function(err,Assets){
		if(err){
			exportSeedErrorsArray.push({
				error:err,
				errortype:'createAssetSeeds'
			});
		}
		if(Assets){
			for(var a in Assets){
				var assetdoc = Assets[a];
				exportSeedDataArray.push(getAssetSeed(assetdoc));
			}
		}
		createAssetSeedsAsyncCallback(null,'created asset seeds');
	});
};

/**
 * exports a models to seeds format
 * @param  {object} options - filepath,limits-tags,collections,etc
 * @param  {object} createSeedsCallback
 * @return {Function} async callback createSeedsCallback(err,results);
 */
var createSeeds = function(seedoptions,createSeedsCallback){
	exportSeedData={
		data:seedoptions
	};

	async.series([
		createAssetSeeds,
		createItemSeeds
	],
	function(err){
		createSeedsCallback(err);
	});
};

/**
 * exports a database seed to disk
 * @param  {object} options - filepath,limits-tags,collections,etc
 * @param  {object} exportSeedCallback
 * @return {Function} async callback exportSeedCallback(err,results);
 */
var exportSeed = function(options,exportSeedCallback){
	try{
	exportSeedFilePath = (typeof options.filepath ==='string') ? path.join(options.filepath) : path.resolve(process.cwd(),defaultExportDir,defaultExportFileName);
	}
	catch(e){		
		exportSeedErrorsArray.push({
			error:e,
			errortype:'exportSeedFilePath'
		});
	}

	var setupSeedExport= function(setupSeedExportCallback){
		var dataforseeds=options;
		setupSeedExportCallback(null,dataforseeds);
	};
	async.waterfall([
		setupSeedExport,
		createSeeds,
		writeSeedToDisk
	],
	function (err, exportseedresult) {
		exportSeedCallback(err, {
			exportseedresult:exportseedresult,
			exportSeedFilePath: exportSeedFilePath,
			exportSeedErrorsArray:exportSeedErrorsArray
		});
	});
};

/**
 * exportseed module 
 * @module exportseed
 * @{@link https://github.com/typesettin/periodicjs.ext.dbseed}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @requires module:async
 * @requires module:periodicjs.core.utilities
 * @requires module:periodicjs.core.controller
 * @param  {object} resources variable injection from current periodic instance with references to the active logger and mongo session
 * @return {object}           dbseed
 */
var exportSeedModule = function(resources){
	logger = resources.logger;
	mongoose = resources.mongoose;
	appSettings = resources.settings;
	CoreController = new ControllerHelper(resources);
	CoreUtilities = new Utilities(resources);
	User = mongoose.model('User');
	Item = mongoose.model('Item');
	Asset = mongoose.model('Asset');
	Contenttype = mongoose.model('Contenttype');
	Category = mongoose.model('Category');
	Tag = mongoose.model('Tag');
	Collection = mongoose.model('Collection');
	Userprivilege = mongoose.model('Userprivilege');
	Userrole = mongoose.model('Userrole');
	Usergroup = mongoose.model('Usergroup');
	return{
		exportSeed:exportSeed,
		createSeeds:createSeeds,
		writeSeedToDisk:writeSeedToDisk
	};
};

module.exports = exportSeedModule;