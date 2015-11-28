"use strict";

// Inject application
var Path       = require('path');
var BPromise   = require('bluebird');
var mongoose   = BPromise.promisifyAll(require('mongoose'));
var DatePlugin = require(Path.join(global.__plugin, 'DatePlugin'));

var Schema     = mongoose.Schema;

// Schema
var TypeCategorySchema = new Schema({
	_id    : Number,
	name   : {
		type     : String,
		required : true
	}
});

// Plugin
TypeCategorySchema.plugin(DatePlugin);

// Index
TypeCategorySchema.index({
	name   : 1
}, {
	unique : true
});

// Return
module.exports = mongoose.model('TypeCategory', TypeCategorySchema);