"use strict";

// Inject application
var Path       = require('path');
var BPromise   = require('bluebird');
var Mongoose   = BPromise.promisifyAll(require('mongoose'));
var DatePlugin = require(Path.join(global.__plugin, 'date'));
var Config     = require(Path.join(global.__core, 'system')).Config;

var Schema     = Mongoose.Schema;
var Types      = Schema.Types;

// Schema
var TypeCategorySchema = new Schema({
	_id    : Config.db.seq ? Number : Types.ObjectId,
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
module.exports = Mongoose.model('TypeCategory', TypeCategorySchema);