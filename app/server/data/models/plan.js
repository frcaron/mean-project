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
var PlanSchema = new Schema({
	_id   : config.db.seq ? Number : Types.ObjectId,
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
PlanSchema.plugin(datePlugin);
PlanSchema.plugin(userPlugin);

// Index
PlanSchema.index({
	month : 1,
	year  : 1,
	_user : 1
}, {
	unique : true
});

// Return
module.exports = mongoose.model('Plan', PlanSchema);