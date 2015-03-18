// Inject application
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

// Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');
var userPlugin = require(global.__plugin + '/UserPlugin');

// Schema
var TransactionSchema = new Schema({
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

TransactionSchema.plugin(datePlugin);
TransactionSchema.plugin(userPlugin);

TransactionSchema.methods.addLinkProgram = function () {

	this.populate('_program', function (err, transaction) {
		var program = transaction._program;

		program.transactions.push(transaction);
		program.save();
	});
};

TransactionSchema.methods.removeLinkProgram = function () {

	this.populate('_program', function (err, transaction) {
		var program = transaction._program;

		program.transactions.pull(transaction);
		program.save();
	});
};

// Return
module.exports = mongoose.model('Transaction', TransactionSchema);
