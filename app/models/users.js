'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	user: {
		id: String,
		displayName: String
	},
   places: Object,
   lastSearch: Object
});

module.exports = mongoose.model('User', User);
