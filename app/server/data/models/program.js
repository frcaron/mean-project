"use strict";

// Inject
var Path       = require('path');
var BPromise   = require('bluebird');
var Mongoose   = BPromise.promisifyAll(require('mongoose'));
var DatePlugin = require(Path.join(global.__plugin, 'date'));
var UserPlugin = require(Path.join(global.__plugin, 'user'));
var Config     = require(Path.join(global.__core, 'system')).Config;

var Schema     = Mongoose.Schema;
var Types      = Schema.Types;

// Schema
var ProgramSchema = new Schema({
	_id       : Config.db.seq ? Number : Types.ObjectId,
	_category : {
		type     : Config.db.seq ? Number : Types.ObjectId,
		ref      : 'Category',
		required : true
	},
	budget       : Number,
	_plan     : {
		type     : Config.db.seq ? Number : Types.ObjectId,
		ref      : 'Plan',
		required : true
	}
});

// Plugin
ProgramSchema.plugin(DatePlugin);
ProgramSchema.plugin(UserPlugin);

// Index
ProgramSchema.index({
	_category : 1,
	_plan     : 1,
	_user     : 1
}, {
	unique : true
});

// Return
module.exports = Mongoose.model('Program', ProgramSchema);