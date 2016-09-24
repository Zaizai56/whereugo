'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Places = new Schema({
	placeID: String,
	going: Array
});

module.exports = mongoose.model('Places', Places);
