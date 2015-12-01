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
var TransactionSchema = new Schema({
	_id      : Config.db.seq ? Number : Types.ObjectId,
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
		type     : Config.db.seq ? Number : Types.ObjectId,
		ref      : 'Program',
		required : true
	}
});

// Plugin
TransactionSchema.plugin(DatePlugin);
TransactionSchema.plugin(UserPlugin);

// Return
module.exports = Mongoose.model('Transaction', TransactionSchema);
