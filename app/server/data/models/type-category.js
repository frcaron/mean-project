"use strict";

// Inject application
var path       = require('path');
var BPromise   = require('bluebird');
var mongoose   = BPromise.promisifyAll(require('mongoose'));
var datePlugin = require(path.join(global.__plugin, 'date'));
var config     = require(path.join(global.__core, 'system')).Config;

var Schema     = mongoose.Schema;
var Types      = Schema.Types;

// Schema
var TypeCategorySchema = new Schema({
	_id    : config.db.seq ? Number : Types.ObjectId,
	name   : {
		type     : String,
		required : true
	}
});

// Plugin
TypeCategorySchema.plugin(datePlugin);

// Index
TypeCategorySchema.index({
	name   : 1
}, {
	unique : true
});

// Return
module.exports = mongoose.model('TypeCategory', TypeCategorySchema);