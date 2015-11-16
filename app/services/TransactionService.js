"use strict";

// Inject
var BPromise        = require('bluebird');
var ErrorManager    = require(global.__app + '/ErrorManager');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_trans + '/ResponseService');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var TransactionDao  = require(global.__dao + '/TransactionDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');

function findProgramForTransaction(transaction, category_id) {	
	var date_split = transaction.date.split('/');

	return PlanDao.getOne({
			user_id : transaction._user,
			month   : date_split[ 1 ],
			year    : date_split[ 2 ]
		})
		.catch(ErrorManager.NoResultError, function (err) {
			// TODO reflexion api ou user ?
			// si api use service transversal
			throw err;
		})
		.then(function (plan) {
			return  ProgramDao.getOne({
						_plan     : plan._id,
						_category : category_id,
						_user     : transaction._user
					});
		})
		.catch(ErrorManager.NoResultError, function (err) {
			// TODO reflexion api ou user ?
			throw err;
		})
		.then(function (program) {
			transaction._program = program._id;
			return BPromise.resolve(transaction);
		});
}

module.exports = {

	// Create one transaction
	create             : function (req, res) {

		Logger.debug('TransactionService#create - [start]');

		var input = {
			date     : req.body.date,
			sum      : req.body.sum,
			comment  : req.body.comment,
			_program : req.body.category_id || req.query.category_id,
			_user    : req.decoded.id
		};
		var category_id = req.body.category_id ||req.query.category_id;

		findProgramForTransaction(input, category_id)
			.then(function(transaction) {
				return TransactionDao.create(transaction);
			})		
			.then(function (transaction) {
				ResponseService.success(res, {
					message : 'Add transaction', 
					result  : transaction
				});
			})
			.catch(function (err) {
				Logger.error('TransactionService#create | ' + err.message);

				ResponseService.fail(res, {
					message : 'Add transaction'
				});
			});

		Logger.debug('TransactionService#create - [end]');
	},

	// Update one transaction
	update             : function (req, res) {

		Logger.debug('TransactionService#update - [start]');

		TransactionDao.getOne({
				id      : req.params.transaction_id,
				user_id : req.decoded.id
			})
			.then(function (transaction) {

				if (req.body.date) {
					transaction.date    = req.body.date;
				}
				if (req.body.sum) {
					transaction.sum     = req.body.sum;
				}
				if (req.body.comment) {
					transaction.comment = req.body.comment;
				}
				var category_id = req.body.category_id || req.query.category_id;
			
				return  findProgramForTransaction(transaction, category_id);
			})
			.then(function (transaction) {
				return TransactionDao.update(transaction);
			})
			.then(function (transaction) {
				ResponseService.success(res, {
					message : 'Update transaction', 
					result  : transaction
				});
			})
			.catch(function (err) {
				Logger.error('TransactionService#update | ' + err.message);

				ResponseService.fail(res, {
					message : 'Update transaction'
				});
			});

		Logger.debug('TransactionService#update - [end]');
	},

	// Remove one transaction
	remove             : function (req, res) {

		Logger.debug('TransactionService#remove - [start]');

		TransactionDao({ 
				id      : req.params.transaction_id,
				user_id : req.decoded.id
			})
			.then(function () {
				ResponseService.success(res, {
					message : 'Remove transaction'
				});
			})
			.catch(function (err) {
				Logger.error('TransactionService#remove | ' + err.message);

				ResponseService.fail(res, {
					message : 'Remove failed'
				});
			});

		Logger.debug('TransactionService#remove - [end]');
	},

	// Get transactions by type category
	allByTypeCategoryU : function (req, res) {

		// TODO

		CategoryDao.getAll({
				type    : req.params.type_category_id,
				user_id : req.decoded.id
			})
			.then(function (categories) {
				if (categories.length === 0) {
					throw new Error('Transactions not found');
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
				ResponseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get transactions by program
	allByProgramU      : function (req, res) {

		Logger.debug('TransactionService#allByProgramU - [start]');

		TransactionDao.getAll({
				program_id : req.params.program_id,
				user_id    : req.decoded.id
			})
			.then(function (transactions) {
				ResponseService.success(res, {
					message : 'Get all transactions by program', 
					result  : transactions
				});
			})
			.catch(function (err) {
				Logger.error('TransactionService#allByProgramU | ' + err.message);

				ResponseService.fail(res, {
					message : 'Get all transactions by program'
					});
			});

		Logger.debug('TransactionService#allByProgramU - [end]');
	},

	// Get one transaction by id
	getByIdU           : function (req, res) {

		Logger.debug('TransactionService#getByIdU - [start]');

		TransactionDao.getOne({
				id    : req.params.transaction_id,
				_user : req.decoded.id
			})
			.then(function (transaction) {
				ResponseService.success(res, {
					message : 'Get transaction', 
					result  : transaction,
				});
			})
			.catch(function (err) {
				Logger.error('TransactionService#getByIdU | ' + err.message);

				ResponseService.fail(res, {
					message : 'Get transaction'
				});
			});

		Logger.debug('TransactionService#getByIdU - [end]');
	}
};