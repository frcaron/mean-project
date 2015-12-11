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
var TransactionSchema = new Schema({
	_id      : config.db.seq ? Number : Types.ObjectId,
	date     : {
		type     : Date,
		required : true
	},
	sum      : {
		type     : Number,
		required : true
	},
	comment  : String,
	_program : {
		type     : config.db.seq ? Number : Types.ObjectId,
		ref      : 'Program',
		required : true
	}
});

// Plugin
TransactionSchema.plugin(datePlugin);
TransactionSchema.plugin(userPlugin);

// Return
module.exports = mongoose.model('Transaction', TransactionSchema);
