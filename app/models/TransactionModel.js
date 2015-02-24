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

	this.populate('_program', function (transaction) {
		;
			var program = transaction._program;
			if (!program) {
				throw new Error('Program not found');
			}

			program.transactions.push(this);
			program.save();
		});
};

TransactionSchema.methods.removeLinkProgram = function () {

	return this.populate('_program')
		.then(function (transaction) {
			var program = transaction._program;
			if (!program) {
				throw new Error('Program not found');
			}

			program.transactions.pull(this);
			return program.save().exec();
		});
};

// Return
module.exports = mongoose.model('Transaction', TransactionSchema);