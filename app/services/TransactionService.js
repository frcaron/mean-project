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

		let category_id = req.body.category_id || req.query.category_id;

		fulfillProgram({
				date    : req.body.date,
				sum     : req.body.sum,
				comment : req.body.comment,
				user_id : req.decoded.id
			}, category_id)
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

		let category_id = req.body.category_id || req.query.category_id;

		fulfillProgram({
				transaction_id : req.params.transaction_id,
				date           : req.body.date,
				sum            : req.body.sum,
				comment        : req.body.comment,
				user_id        : req.decoded.id
			}, category_id)
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
				transaction_id : req.params.transaction_id,
				user_id        : req.decoded.id
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

		Logger.debug('[SER - START] TransactionService#allByTypeCatU');

		CategoryDao.getAll({
				type_category_id : req.params.type_category_id,
				user_id          : req.decoded.id
			})
			.then(function (categories) {
				if (!categories.length) {
					throw new ErrorManager.NoResultError('Transactions not found');
				}

				var categories_id = [];
				categories.map(function (category) {
					categories_id.push(category._id);
				});

				return BPromise.all(categories_id)
					.then(function () {
						return ProgramDao.getAll({
							categories_id : categories_id,
							user_id       : req.decoded.id
						});
					})
					.then(function (programs) {
						if (!programs.length) {
							throw new ErrorManager.NoResultError('Transaction not found');
						}

						var programs_id = [];
						programs.map(function(program){
							programs_id.push(program._id);
						}) ;

						return BPromise.all(programs_id)
							.then(function () {
								return TransactionDao.getAll({
									programs_id : programs_id,
									user_id     : req.decoded.id
								});
							});
					});
			})
			.then(function (transactions) {
				ResponseService.success(res, {
					message : 'Get all transactions by type category',
					result  : transactions
				});
			})
			.catch(ErrorManager.NoResultError, function () {
				ResponseService.success(res, {
					message : 'Get all transactions by type category',
					result  : []
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TransactionService#allByTypeCatU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get all transactions by type category'
				});
			});

		Logger.debug('[SER -   END] TransactionService#allByTypeCatU');
	},

	// Get transactions by program
	allByProgramU : function (req, res) {

		Logger.debug('[SER - START] TransactionService#allByProgramU');

		TransactionDao.getAll({
				programs_id : [ req.params.programs_id ],
				user_id     : req.decoded.id
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
				transaction_id : req.params.transaction_id,
				_user          : req.decoded.id
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