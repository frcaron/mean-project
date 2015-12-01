"use strict";

// Inject
var Path       = require('path');
var BPromise   = require('bluebird');
var Mongoose   = BPromise.promisifyAll(require('mongoose'));
var DatePlugin = require(Path.join(global.__plugin, 'date'));
var UserPlugin = require(Path.join(global.__plugin, 'user'));

var Schema     = Mongoose.Schema;

// Schema
var CategorySchema = new Schema({
	_id       : Number,
	name      : {
		type     : String,
		required : true
	},
	_type      : {
		type     : Number,
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
CategorySchema.plugin(DatePlugin);
CategorySchema.plugin(UserPlugin);

// Return
module.exports = Mongoose.model('Category', CategorySchema);