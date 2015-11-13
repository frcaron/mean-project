"use strict";

// Inject application
var BPromise   = require('bluebird');
var mongoose   = BPromise.promisifyAll(require('mongoose'));
var DatePlugin = require(global.__plugin + '/DatePlugin');

var Schema     = mongoose.Schema;

// Schema
var TypeCategorySchema = new Schema({
	_id    : Number,
	type   : {
		type     : String,
		required : true
	},
	active : {
		type    : Boolean,
		default : true
	}
});

// Plugin
TypeCategorySchema.plugin(DatePlugin);

// Index
TypeCategorySchema.index({
	type   : 1
}, {
	unique : true
});

// Return
module.exports = mongoose.model('TypeCategory', TypeCategorySchema);