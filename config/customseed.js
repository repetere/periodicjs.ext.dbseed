'use strict';
const Promisie = require('promisie');
const async = Promisie.promisifyAll(require('async'));

module.exports = function (resources) {
	const mongoose = resources.mongoose;
	const UserPrivilege = mongoose.model('Userprivilege');
	const UserRole = mongoose.model('Userrole');
	const User = mongoose.model('User');
	const ContentType = mongoose.model('Contenttype');
	const Asset = mongoose.model('Asset');
	const Tag = mongoose.model('Tag');
	const Category = mongoose.model('Category');
	const Item = mongoose.model('Item');
	const Collection = mongoose.model('Collection');
	return {
		development:{
			exportseed:{
				tag:function(seed){
					var returnseed = seed;
					// returnseed.datadocument.title = seed.datadocument.title +' added customs';
					// console.log('custom tag export manipulation for',returnseed);
					return returnseed;
				}
			},
			importseed:{
				userrole: function (seed) {
					if (!Array.isArray(seed.privileges)) { return seed; }
					let privileges = seed.privileges.map(p => {
						return Promisie.promisify(UserPrivilege.findOne, UserPrivilege)({
							userprivilegeid: p
						})
							.then(privilege => (privilege && privilege._id) ? privilege._id : null)
							.catch(e => Promise.reject(e));
					});
					return Promise.all(privileges)
						.then(privilegeids => {
							seed.privileges = privilegeids.filter(id => id);
							return seed;
						}, e => Promise.reject(e));
				},
				user: function (seed) {
					if (!Array.isArray(seed.userroles)) { return seed; }
					let roles = seed.userroles.map(r => {
						return Promisie.promisify(UserRole.findOne, UserRole)({
							userroleid: r
						})
							.then(role => (role && role._id) ? role._id : null)
							.catch(e => Promise.reject(e));
					});
					return Promise.all(roles)
						.then(roleids => {
							seed.userroles = roleids.filter(id => id);
							return seed;
						}, e => Promise.reject(e));
				},
				tag: function (seed) {
					return Promisie.promisify(User.findOne, User)({ username: seed.author })
						.then(user => {
							seed.author = (user && user._id) ? user._id : null;
							if (Array.isArray(seed.contenttypes)) {
								let contenttypes = seed.contenttypes.map(type => {
									return Promisie.promisify(ContentType.findOne, ContentType)({
										name: type
									})
										.then(contenttype => (contenttype && contenttype._id) ? contenttype._id : null)
										.catch(e => Promise.reject(e));
								});
								return Promise.all(contenttypes);
							}
							else { return false; }
						})
						.then(typeids => {
							if (typeids) { seed.contenttypes = typeids.filter(id => id); }
							return seed;
						})
						.catch(e => Promise.reject(e));
				},
				category: function (seed) {
					return Promisie.promisify(User.findOne, User)({ username: seed.author })
						.then(user => {
							seed.author = (user && user._id) ? user._id : null;
							return seed;
						}, e => Promise.reject(e));
				},
				asset: function (seed) {
					return Promisie.promisify(User.findOne, User)({ username: seed.author })
						.then(user => {
							seed.author = (user && user._id) ? user._id : null;
							return seed;
						}, e => Promise.reject(e));
				},
				item: function (seed) {
					return async.parallelAsync({
						user: function (cb) {
							User.findOne({ username: seed.primaryauthor }, cb);
						},
						asset: function (cb) {
							Asset.findOne({ name: seed.primaryasset }, cb);
						},
						tags: function (cb) {
							Promise.all((Array.isArray(seed.tags)) ? seed.tags.map(t => {
								return Promisie.promisify(Tag.findOne, Tag)({ name: t })
									.then(tag => (tag && tag._id) ? tag._id : null)
									.catch(e => Promise.reject(e));
							}) : [])
								.then(cb.bind(null, null))
								.catch(cb);
						},
						authors: function (cb) {
							Promise.all((Array.isArray(seed.authors)) ? seed.authors.map(a => {
								return Promisie.promisify(User.findOne, User)({ username: a })
									.then(author => (author && author._id) ? author._id : null)
									.catch(e => Promise.reject(e));
							}) : [])
								.then(cb.bind(null, null))
								.catch(cb);
						},
						categories: function (cb) {
							Promise.all((Array.isArray(seed.categories)) ? seed.categories.map(c => {
								return Promisie.promisify(Category.findOne, Category)({ name: c })
									.then(category => (category && category._id) ? category._id : null)
									.catch(e => Promise.reject(e));
							}) : [])
								.then(cb.bind(null, null))
								.catch(cb);
						},
						assets: function (cb) {
							Promise.all((Array.isArray(seed.assets)) ? seed.assets.map(a => {
								return Promisie.promisify(Asset.findOne, Asset)({ name: a })
									.then(asset => (asset && asset._id) ? asset._id : null)
									.catch(e => Promise.reject(e));
							}) : [])
								.then(cb.bind(null, null))
								.catch(cb);
						}
					})
						.then(results => {
							let { user, asset, tags, authors, categories, assets } = results;
							if (user && user._id) { seed.primaryauthor = user._id }
							if (asset && asset._id) { seed.primaryasset = asset._id }
							if (Array.isArray(tags)) { seed.tags = tags.filter(id => id); }
							if (Array.isArray(categories)) { seed.categories = categories.filter(id => id); }
							if (Array.isArray(authors)) { seed.authors = authors.filter(id => id); }
							if (Array.isArray(assets)) { seed.assets = assets.filter(id => id); }
							return seed;
						}, e => Promise.reject(e));
				},
				collection: function (seed) {
					return async.parallelAsync({
						user: function (cb) {
							User.findOne({ username: seed.primaryauthor }, cb);
						},
						asset: function (cb) {
							Asset.findOne({ name: seed.primaryasset }, cb);
						},
						tags: function (cb) {
							Promise.all((Array.isArray(seed.tags)) ? seed.tags.map(t => {
								return Promisie.promisify(Tag.findOne, Tag)({ name: t })
									.then(tag => (tag && tag._id) ? tag._id : null)
									.catch(e => Promise.reject(e));
							}) : [])
								.then(cb.bind(null, null))
								.catch(cb);
						},
						authors: function (cb) {
							Promise.all((Array.isArray(seed.authors)) ? seed.authors.map(a => {
								return Promisie.promisify(User.findOne, User)({ username: a })
									.then(author => (author && author._id) ? author._id : null)
									.catch(e => Promise.reject(e));
							}) : [])
								.then(cb.bind(null, null))
								.catch(cb);
						},
						categories: function (cb) {
							Promise.all((Array.isArray(seed.categories)) ? seed.categories.map(c => {
								return Promisie.promisify(Category.findOne, Category)({ name: c })
									.then(category => (category && category._id) ? category._id : null)
									.catch(e => Promise.reject(e));
							}) : [])
								.then(cb.bind(null, null))
								.catch(cb);
						},
						assets: function (cb) {
							Promise.all((Array.isArray(seed.assets)) ? seed.assets.map(a => {
								return Promisie.promisify(Asset.findOne, Asset)({ name: a })
									.then(asset => (asset && asset._id) ? asset._id : null)
									.catch(e => Promise.reject(e));
							}) : [])
								.then(cb.bind(null, null))
								.catch(cb);
						},
						items: function (cb) {
							let item_order = {};
							let items = seed.items.map(data => {
								item_order[data.item] = data.order;
								return Promisie.promisify(Item.findOne, Item)({ name: data.item });
							});
							Promisie.all(items)
								.try(result => {
									result = result.filter(i => i).sort((a, b) => item_order[a.name] - item_order[b.name]);
									return result.map(i => {
										return {
											item: i._id,
											order: item_order[i.name]
										};
									});
								})
								.then(result => cb(null, result))
								.catch(cb);
						}
					})
						.then(results => {
							let { user, asset, tags, authors, categories, assets, items } = results;
							if (user && user._id) { seed.primaryauthor = user._id }
							if (asset && asset._id) { seed.primaryasset = asset._id }
							if (Array.isArray(tags)) { seed.tags = tags.filter(id => id); }
							if (Array.isArray(categories)) { seed.categories = categories.filter(id => id); }
							if (Array.isArray(authors)) { seed.authors = authors.filter(id => id); }
							if (Array.isArray(assets)) { seed.assets = assets.filter(id => id); }
							if (Array.isArray(items)) { seed.items = items.filter(data => data); }
							return seed;
						}, e => Promise.reject(e));
				},
				compilation: function (seed) {
					return async.parallelAsync({
						user: function (cb) {
							User.findOne({ username: seed.primaryauthor }, cb);
						},
						asset: function (cb) {
							Asset.findOne({ name: seed.primaryasset }, cb);
						},
						tags: function (cb) {
							Promise.all((Array.isArray(seed.tags)) ? seed.tags.map(t => {
								return Promisie.promisify(Tag.findOne, Tag)({ name: t })
									.then(tag => (tag && tag._id) ? tag._id : null)
									.catch(e => Promise.reject(e));
							}) : [])
								.then(cb.bind(null, null))
								.catch(cb);
						},
						authors: function (cb) {
							Promise.all((Array.isArray(seed.authors)) ? seed.authors.map(a => {
								return Promisie.promisify(User.findOne, User)({ username: a })
									.then(author => (author && author._id) ? author._id : null)
									.catch(e => Promise.reject(e));
							}) : [])
								.then(cb.bind(null, null))
								.catch(cb);
						},
						categories: function (cb) {
							Promise.all((Array.isArray(seed.categories)) ? seed.categories.map(c => {
								return Promisie.promisify(Category.findOne, Category)({ name: c })
									.then(category => (category && category._id) ? category._id : null)
									.catch(e => Promise.reject(e));
							}) : [])
								.then(cb.bind(null, null))
								.catch(cb);
						},
						assets: function (cb) {
							Promise.all((Array.isArray(seed.assets)) ? seed.assets.map(a => {
								return Promisie.promisify(Asset.findOne, Asset)({ name: a })
									.then(asset => (asset && asset._id) ? asset._id : null)
									.catch(e => Promise.reject(e));
							}) : [])
								.then(cb.bind(null, null))
								.catch(cb);
						},
						content_entities: function (cb) {
							let entity_order = {};
							let findOneItem = Promisie.promisify(Item.findOne, Item);
							let findOneCollection = Promisie.promisify(Collection.findOne, Collection);
							let retrieved = seed.content_entities.map(data => {
								entity_order[data.entity_item || data.entity_collection] = data.order;
								if (data.entitytype === 'item') { return Promise.all([findOneItem({ name: data.entity_item }), 'item']); }
								else if (data.entitytype === 'collection') { return Promise.all([findOneCollection({ name: data.entity_collection }), 'collection']); }
							});
							Promisie.all(retrieved)
								.try(results => {
									results.filter(i => i).sort((a, b) => entity_order[a[0].name] - entity_order[b[0].name]);
									return results.reduce((result, entity) => {
										let data = { entitytype: entity[1], order: entity_order[entity.name] };
										if (entity[1] === 'item') { data.entity_item = entity[0]._id; }
										else if (entity[1] === 'collection') { data.entity_collection = entity[0]._id; }
										result.push(data);
										return result;
									}, []);
								})
								.then(result => cb(null, result))
								.catch(cb);
						}
					})
						.then(results => {
							let { user, asset, tags, authors, categories, assets, content_entities } = results;
							if (user && user._id) { seed.primaryauthor = user._id }
							if (asset && asset._id) { seed.primaryasset = asset._id }
							if (Array.isArray(tags)) { seed.tags = tags.filter(id => id); }
							if (Array.isArray(categories)) { seed.categories = categories.filter(id => id); }
							if (Array.isArray(authors)) { seed.authors = authors.filter(id => id); }
							if (Array.isArray(assets)) { seed.assets = assets.filter(id => id); }
							if (Array.isArray(content_entities)) { seed.content_entities = content_entities.filter(data => data); }
							return seed;
						}, e => Promise.reject(e));
				}
			},
			importorder: {
				'userprivilege': 0,
				'userrole': 1,
				'usergroup': 2,
				'user': 3,
				'contenttype': 4,
				'tag': 5,
				'category': 6,
				'asset': 7,
				'item': 8,
				'collection': 9,
				'compilation': 10
			}
		}
	};
};
