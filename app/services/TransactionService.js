"use strict";

// Inject application
var BPromise = require('bluebird');
var moment   = require('moment');

// Inject models
var PlanModel = require(global.__model + '/PlanModel');
var ProgramModel = require(global.__model + '/ProgramModel');
var TransactionModel = require(global.__model + '/TransactionModel');
var CategoryModel = require(global.__model + '/CategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

// Save transaction and update link
function changeProgram(transaction, user_id, category_id, date) {

	console.log(transaction)
	console.log(user_id)
	console.log(category_id)
	console.log(date)


	var promise = CategoryModel.findOneAsync({
		_id   : category_id,
		_user : user_id
	});

	return promise
		.then(function (category) {

			if (!category) {
				throw new Error('Category not found'); // TODO create category
			}

			var date_split = date.split('/');

			return PlanModel.findOne({
				_user : user_id,
				month : date_split[ 1 ],
				year  : date_split[ 2 ]
			}).populate('programs', '_id category').execAsync();
		})

		.then(function (plan) {

			if (!plan) {
				throw new Error('Plan not found'); // TOTO create plan
			}

			return ProgramModel.findOneAsync({
				_plan    : plan._id,
				category : category_id
			});
		})

		.then(function (program) {

			if (!program) {
				throw new Error('Program not found'); //TODO create program
			}

			transaction._program = program._id;

			return transaction.saveAsync();
		})

		.then(function () {

			transaction.addLinkProgram();

			return transaction._id;
		});
}

module.exports = {

	// Create one transaction
	create             : function (req, res) {

		var transaction = new TransactionModel();

		
		var m = moment(req.body.date, "DD/MM/YYYY");
		if(m.isValid()) {
			transaction.date = m.toDate();
		} else {
			throw new Error('Date is not valid');
		}
		transaction.sum = req.body.sum;
		if (req.body.comment) {
		transaction.comment = req.body.comment;
		}
		transaction._user = req.decoded.id;

		console.log(transaction);

		var promise = changeProgram(
			transaction,
			req.decoded.id,
			req.query.category_id,
			m.toDate());

		promise
			.then(function (id) {
				responseService.success(res, 'Add success', id);
			})

			.catch(function (err) {

				if(transaction._id) {
					transaction.removeLinkProgram();
					TransactionModel.remove({ _id : transaction._id }).execAsync();
				}

				responseService.fail(res, 'Add failed', err.message);
			});
	},

	// Update one transaction
	update             : function (req, res) {

		var promise = TransactionModel.findOne({
			_id   : req.params.transaction_id,
			_user : req.decoded.id
		}).populate('_program', 'category').execAsync();

		promise
			.then(function (transaction) {

				if (!transaction) {
					throw new Error('Transaction not found');
				}

				var newDate = moment(req.body.date, "DD/MM/YYYY");
				var lastDate = moment(transaction.date, "DD/MM/YYYY");
				if(newDate.isValid()) {
					if (!newDate.equals(lastDate)) {
						transaction.date = newDate.toDate();
					}
				} else {
					throw new Error('Date is not valid');
				}
				console.log('1')
				if (req.body.sum) {
					transaction.sum = req.body.sum;
				}
				console.log('2')
				if (req.body.comment) {
					transaction.comment = req.body.comment;
				}
				console.log('3')
				if (!req.query.category_id.equals(transaction._program.category) ||
					!newDate.equals(lastDate)) {
					transaction.removeLinkProgram();
				}

				console.log('pre save');
				transaction.save();
				console.log('post save');

				if (transaction.isModified('_program')) {
					return changeProgram(
						transaction,
						req.decoded.id,
						req.query.category_id,
						m.toDate());
				}
			})

			.then(function () {
				responseService.success(res, 'Update success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Update failed', err.message);
			});
	},

	// Remove one transaction
	remove             : function (req, res) {

		var promise = TransactionModel.findOneAndRemoveAsync({
			_id   : req.params.transaction_id,
			_user : req.decoded.id
		});

		promise
			.then(function (transaction) {

				if (!transaction) {
					throw new Error('Transaction not found');
				}

				transaction.removeLinkProgram();

				responseService.success(res, 'Remove success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Remove failed', err.message);
			});
	},

	// Get transactions by type category
	allByTypeCategoryU : function (req, res) {

		var promise = CategoryModel
			.findAsync({ type : req.params.type_category_id })
			.populate('_programs', 'transactions');

		promise
			.then(function (categories) {

				if (!categories) {
					throw new Error('Transaction not found');
				}

				var result = [];
				categories.map(function (category) {
					category._programs.map(function (program) {
						program.transactions.map(function (transaction) {
							result.push(transaction);
						});
					});
				});

				BPromise.all(result)
					.then(function (transactions) {
						return TransactionModel.findAsync({ _id : { $in : transactions } });
					})

					.then(function (transaction) {

						if (!transaction) {
							throw new Error('Transaction not found');
						}

						responseService.success(res, 'Find success', transaction);
					})

					.catch(function (err) {
						responseService.fail(res, 'Find failed', err.message);
					});
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get transactions by program
	allByProgramU      : function (req, res) {

		var promise = TransactionModel.findAsync({
			_user    : req.decoded.id,
			_program : req.params.program_id
		});

		promise
			.then(function (transactions) {
				responseService.success(res, 'Find success', transactions);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get one transaction by id
	getByIdU           : function (req, res) {

		var promise = TransactionModel.findOneAsync({
			_id   : req.params.transaction_id,
			_user : req.decoded.id
		});

		promise
			.then(function (transaction) {
				responseService.success(res, 'Find success', transaction);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	}
};