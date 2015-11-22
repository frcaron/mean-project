"use strict";

// Inject
var BPromise   = require('bluebird');
var Mongoose   = BPromise.promisifyAll(require('mongoose'));
var DatePlugin = require(global.__plugin + '/DatePlugin');
var UserPlugin = require(global.__plugin + '/UserPlugin');

var Schema     = Mongoose.Schema;

// Schema
var ProgramSchema = new Schema({
	_id       : Number,
	_category : {
		type     : Number,
		ref      : 'Category',
		required : true
	},
	budget       : Number,
	_plan     : {
		type     : Number,
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