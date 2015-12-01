"use strict";

// Inject
var Path       = require('path');
var BPromise   = require('bluebird');
var Mongoose   = BPromise.promisifyAll(require('mongoose'));
var DatePlugin = require(Path.join(global.__plugin, 'date'));
var UserPlugin = require(Path.join(global.__plugin, 'user'));

var Schema     = Mongoose.Schema;

// Schema
var TransactionSchema = new Schema({
	_id      : Number,
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
		type     : Number,
		ref      : 'Program',
		required : true
	}
});

// Plugin
TransactionSchema.plugin(DatePlugin);
TransactionSchema.plugin(UserPlugin);

// Return
module.exports = Mongoose.model('Transaction', TransactionSchema);
