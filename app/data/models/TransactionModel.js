"use strict";

// Inject application
var BPromise   = require('bluebird');
var Mongoose   = BPromise.promisifyAll(require('mongoose'));
var Schema     = Mongoose.Schema;
var datePlugin = require(global.__plugin + '/DatePlugin');
var userPlugin = require(global.__plugin + '/UserPlugin');

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
TransactionSchema.plugin(datePlugin);
TransactionSchema.plugin(userPlugin);

// Return
module.exports = Mongoose.model('Transaction', TransactionSchema);
