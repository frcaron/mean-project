"use strict";

// Inject
var path       = require('path');
var BPromise   = require('bluebird');
var mongoose   = BPromise.promisifyAll(require('mongoose'));
var datePlugin = require(path.join(global.__plugin, 'date'));
var userPlugin = require(path.join(global.__plugin, 'user'));
var config     = require(path.join(global.__core, 'system')).Config;

var Schema     = mongoose.Schema;
var Types      = Schema.Types;

// Schema
var CategorySchema = new Schema({
	_id       : config.db.seq ? Number : Types.ObjectId,
	name      : {
		type     : String,
		required : true
	},
	_type      : {
		type     : config.db.seq ? Number : Types.ObjectId,
		ref      : 'TypeCategory',
		required : true
	},
	active    : {
		type    : Boolean,
		default : true
	},
	neutre    : {
		type    : Boolean,
		default : false
	}
});

// Index
CategorySchema.index({
	name   : 1,
	_type  : 1,
	neutre : 1,
	_user  : 1
}, {
	unique : true
});

// Plugin
CategorySchema.plugin(datePlugin);
CategorySchema.plugin(userPlugin);

// Return
module.exports = mongoose.model('Category', CategorySchema);