"use strict";

// Inject application
var BPromise = require('bluebird');
var Mongoose = BPromise.promisifyAll(require('mongoose'));
var Schema = Mongoose.Schema;
var DatePlugin = require(global.__plugin + '/DatePlugin');
var UserPlugin = require(global.__plugin + '/UserPlugin');

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
	}
});

// Plugin
CategorySchema.plugin(DatePlugin);
CategorySchema.plugin(UserPlugin);

// Index
CategorySchema.index({
	name   : 1,
	_type  : 1,
	_user  : 1,
	active : 1
}, {
	unique : true
});

// Return
module.exports = Mongoose.model('Category', CategorySchema);