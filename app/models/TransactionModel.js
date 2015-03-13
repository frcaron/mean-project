// Inject application
var mongoose = require('mongoose');
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
			transaction._program.transactions.push(transaction);
			transaction._program.save();
		});
};

TransactionSchema.methods.removeLinkProgram = function () {

	this.populate('_program',function (err, transaction) {
			transaction._program.transactions.pull(transaction);
			transaction._program.save();
		});
};

// Return
module.exports = mongoose.model('Transaction', TransactionSchema);