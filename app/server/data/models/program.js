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
var ProgramSchema = new Schema({
	_id       : config.db.seq ? Number : Types.ObjectId,
	_category : {
		type     : config.db.seq ? Number : Types.ObjectId,
		ref      : 'Category',
		required : true
	},
	budget       : Number,
	_plan     : {
		type     : config.db.seq ? Number : Types.ObjectId,
		ref      : 'Plan',
		required : true
	}
});

// Plugin
ProgramSchema.plugin(datePlugin);
ProgramSchema.plugin(userPlugin);

// Index
ProgramSchema.index({
	_category : 1,
	_plan     : 1,
	_user     : 1
}, {
	unique : true
});

// Return
module.exports = mongoose.model('Program', ProgramSchema);