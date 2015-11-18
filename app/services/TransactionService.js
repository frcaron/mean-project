"use strict";

// Inject
var BPromise        = require('bluebird');
var ErrorManager    = require(global.__app + '/ErrorManager');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_share + '/ResponseService');
var BudgetService   = require(global.__service_share + '/BudgetService');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var TransactionDao  = require(global.__dao + '/TransactionDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');

function fulfillProgram(input, category_id) {	
	
	let date_split = input.date.split('/');
	let inputPlan = {
		month   : date_split[ 1 ],
		year    : date_split[ 2 ],
		user_id : input.user_id
	};

	return PlanDao.getOne(inputPlan)
		.catch(ErrorManager.NoResultError, function () {			
			return BudgetService.createPlan(inputPlan);
		})
		.then(function (plan) {
			let inputProgram = {
				plan_id     : plan._id,
				category_id : category_id,
				user_id     : input.user_id
			};
			return ProgramDao.getOne(inputProgram)
				.catch(ErrorManager.NoResultError, function () {		
					return BudgetService.createProgram(inputProgram);
				});
			})		
		.then(function (program) {
			input.program_id = program._id;
			return BPromise.resolve(input);
		});
}

module.exports = {

	// Create one transaction
	create        : function (req, res) {

		Logger.debug('[SER - START] TransactionService#create');

		let input = {
			date    : req.body.date,
			sum     : req.body.sum,
			comment : req.body.comment,
			user_id : req.decoded.id
		};
		let category_id = req.body.category_id || req.query.category_id;

		fulfillProgram(input, category_id)
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
				Logger.debug('[SER - CATCH] TransactionService#create');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Add transaction'
				});
			});

		Logger.debug('[SER -   END] TransactionService#create');
	},

	// Update one transaction
	update        : function (req, res) {

		Logger.debug('[SER - START] TransactionService#update');

		let input = {
			id      : req.params.transaction_id,
			date    : req.body.date,
			sum     : req.body.sum,
			comment : req.body.comment,
			user_id : req.decoded.id
		};
		let category_id = req.body.category_id || req.query.category_id;
			
		fulfillProgram(input, category_id)
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
				Logger.debug('[SER - CATCH] TransactionService#update');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Update transaction'
				});
			});

		Logger.debug('[SER -   END] TransactionService#update');
	},

	// Remove one transaction
	remove        : function (req, res) {

		Logger.debug('[SER - START] TransactionService#remove');

		TransactionDao.remove({ 
				id      : req.params.transaction_id,
				user_id : req.decoded.id
			})
			.then(function () {
				ResponseService.success(res, {
					message : 'Remove transaction'
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TransactionService#remove');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Remove failed'
				});
			});

		Logger.debug('[SER -   END] TransactionService#remove');
	},

	// Get transactions by type category
	allByTypeCatU : function (req, res) {

		// TODO

		CategoryDao.getAll({
				type_id : req.params.type_category_id,
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
	allByProgramU : function (req, res) {

		Logger.debug('[SER - START] TransactionService#allByProgramU');

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
				Logger.debug('[SER - CATCH] TransactionService#allByProgramU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get all transactions by program'
					});
			});

		Logger.debug('[SER -   END] TransactionService#allByProgramU');
	},

	// Get one transaction by id
	getByIdU      : function (req, res) {

		Logger.debug('[SER - START] TransactionService#getByIdU');

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
				Logger.debug('[SER - CATCH] TransactionService#getByIdU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get transaction'
				});
			});

		Logger.debug('[SER -   END] TransactionService#getByIdU');
	}
};