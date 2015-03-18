// Inject application
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

// Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');
var userPlugin = require(global.__plugin + '/UserPlugin');

// Inject models
var TransactionModel = require(global.__model + '/TransactionModel');

// Schema
var ProgramSchema = new Schema({
	category     : {
		type     : Schema.Types.ObjectId,
		ref      : 'Category',
		required : true
	},
	sum          : Number,
	transactions : [{
		type : Schema.Types.ObjectId,
		ref  : 'Transaction'
	}],
	_plan        : {
		type     : Schema.Types.ObjectId,
		ref      : 'Plan',
		required : true
	}
});

ProgramSchema.plugin(datePlugin);
ProgramSchema.plugin(userPlugin);

ProgramSchema.index({
	category : 1,
	_plan    : 1,
	_user    : 1
}, {
	unique : true
});

ProgramSchema.methods.addLinkPlan = function () {

	this.populate('_plan', function (err, program) {
		var plan = program._plan;

		plan.programs.push(program);
		plan.save();
	});
};

ProgramSchema.methods.removeLinkPlan = function () {

	this.populate('_plan', function (err, program) {
		var plan = program._plan;

		plan.programs.pull(program);
		plan.save();
	});
};

ProgramSchema.methods.addLinkCategory = function () {

	this.populate('category', function (err, program) {
		var category = program.category;

		category._programs.push(program);
		category.save();
	});
};

ProgramSchema.methods.removeLinkCategory = function () {

	this.populate('category', function (err, program) {
		var category = program.category;

		category._programs.pull(program);
		category.save();
	});
};

ProgramSchema.methods.resetLinkTransaction = function () {

	this.populate({
		path   : '_plan',
		select : 'programUnknow'
	}, function (err, program) {
		var transactions = program.transactions;
		var programUId = program._plan.programUnknow;

		if (transactions) {

			TransactionModel.update({
				_id : {
					$in : transactions
				}
			}, {
				_program : programUId
			}, {
				multi : true
			}).exec(function () {

				program._plan.populate('programUnknow', function (e1, plan) {
					plan.programUnknow.populate('transactions', function (e2, programU) {
						transactions.forEach(function (transaction) {
							programU.transactions.push(transaction);
						});
						programU.save();
					});
				});
			});
		}
	});
};

// Return
module.exports = mongoose.model('Program', ProgramSchema);