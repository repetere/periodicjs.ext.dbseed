'use strict';

/**
 * it's a json file, with an array of objects name spaced by the core data name
 * @example seedfile.json
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
 */

/**
 * formatSeed takes a tranform function that should resolve the transformed seed document
 * 
 * @param {function} options.transform transform function 
 * @param {function} options.seed seed document 
 * @returns {promise} resolved seed document
 */
function formatSeed(options = {}) {
  if (options.transform) {
    return new Promise((resolve, reject) => {
      try {
        resolve(options.transform(options.seed));
      } catch (e) {
        reject(e);
      }
    });
  } else {
    return (options.seed);
  }
}

module.exports = {
  formatSeed,
};