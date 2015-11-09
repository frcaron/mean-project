// Inject application
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

// Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');
var userPlugin = require(global.__plugin + '/UserPlugin');

// Inject models
var CountersModel = require(global.__model + '/CountersModel');

// Schema
var TransactionSchema = new Schema({
	id       : Number,
	date     : Date,
	sum      : {
		type     : Number,
		required : true,
		index    : true
	},
	comment  : String,
	_program : {
		type : Schema.Types.ObjectId,
		ref  : 'Program'
	}
});

// Plugin
TransactionSchema.plugin(datePlugin);
TransactionSchema.plugin(userPlugin);

// MiddleWare
TransactionSchema.pre('save', function(next) {
	if(this._id) {
		this._id = CountersModel.getNextSequence('transaction_id');
	}
	return next();
});

// Return
module.exports = mongoose.model('Transaction', TransactionSchema);
