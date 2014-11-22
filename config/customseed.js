'use strict';
// var path = require('path');

module.exports = {
	exportseed:{
		tag:function(seed){
			var returnseed = seed;
			// returnseed.datadocument.title = seed.datadocument.title +' added customs';
			// console.log('custom tag export manipulation for',returnseed);
			return returnseed;
		}
	},
	importseed:{
		category:function(seed){
			var returnseed = seed;
			// returnseed.datadocument.title = seed.datadocument.title +' added import customs';
			// console.log('custom category import manipulation for',returnseed);
			return returnseed;
		}
	}
};
