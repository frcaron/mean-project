"use strict";

// Inject
var Path       = require('path');
var BPromise   = require('bluebird');
var Mongoose   = BPromise.promisifyAll(require('mongoose'));
var DatePlugin = require(Path.join(global.__plugin, 'DatePlugin'));
var UserPlugin = require(Path.join(global.__plugin, 'UserPlugin'));

var Schema     = Mongoose.Schema;

// Schema
var PlanSchema = new Schema({
	_id   : Number,
	month : {
		type     : Number,
		required : true,
		min      : [ 1, 'The value of ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
		max      : [ 12, 'The value of ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ]
	},
	year  : {
		type     : Number,
		required : true,
		min      : [ 1900, 'The value of ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
		max      : [ 2100, 'The value of ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ]
	}
});

// Plugin
PlanSchema.plugin(DatePlugin);
PlanSchema.plugin(UserPlugin);

// Index
PlanSchema.index({
	month : 1,
	year  : 1,
	_user : 1
}, {
	unique : true
});

// Return
module.exports = Mongoose.model('Plan', PlanSchema);