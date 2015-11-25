"use strict";

// Inject
var BPromise        = require('bluebird');
var Exception       = require(global.__server + '/ExceptionManager');
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var BudgetService   = require(global.__service + '/share/BudgetService');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var TransactionDao  = require(global.__dao + '/TransactionDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');

function fulfillProgram(input, category_id) {

	let inputPlan = {
		month   : input.date.month() + 1,
		year    : input.date.year(),
		user_id : input.user_id
	};

	return PlanDao.getOne(inputPlan)
		.catch(Exception.NoResultEx, function () {
			return BudgetService.createPlan(inputPlan);
		})
		.then(function (plan) {
			let inputProgram = {
				plan_id     : plan._id,
				category_id : category_id,
				user_id     : input.user_id
			};
			return ProgramDao.getOne(inputProgram)
				.catch(Exception.NoResultEx, function () {
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
	create        : function (req, res, user_id) {

		Logger.debug('[SER - START] TransactionService#create');
		Logger.debug('              -- user_id : ' + user_id);

		let category_id = req.body.category_id || req.query.category_id;

		fulfillProgram({
				date    : req.body.date,
				sum     : req.body.sum,
				comment : req.body.comment,
				user_id : user_id
			}, category_id)
			.then(function(transaction) {
				return TransactionDao.create(transaction);
			})
			.then(function (transaction) {
				ResponseService.success(res, {
					result  : transaction
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TransactionService#create');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] TransactionService#create');
	},

	// Update one transaction
	update        : function (req, res, user_id) {

		Logger.debug('[SER - START] TransactionService#update');
		Logger.debug('              -- user_id : ' + user_id);

		let category_id = req.body.category_id || req.query.category_id;

		fulfillProgram({
				transaction_id : req.params.transaction_id,
				date           : req.body.date,
				sum            : req.body.sum,
				comment        : req.body.comment,
				user_id        : user_id
			}, category_id)
			.then(function (transaction) {
				return TransactionDao.update(transaction);
			})
			.then(function (transaction) {
				ResponseService.success(res, {
					result  : transaction
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TransactionService#update');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] TransactionService#update');
	},

	// Remove one transaction
	remove        : function (req, res, user_id) {

		Logger.debug('[SER - START] TransactionService#remove');
		Logger.debug('              -- user_id : ' + user_id);

		TransactionDao.remove({
				transaction_id : req.params.transaction_id,
				user_id        : user_id
			})
			.then(function () {
				ResponseService.success(res);
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TransactionService#remove');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] TransactionService#remove');
	},

	// Get transactions by type category
	allByTypeU : function (req, res, user_id) {

		Logger.debug('[SER - START] TransactionService#allByTypeU');
		Logger.debug('              -- user_id : ' + user_id);

		CategoryDao.getAll({
				type_category_id : req.params.type_category_id,
				user_id          : user_id
			})
			.then(function (categories) {
				if (!categories.length) {
					throw new Exception.NoResultEx('Transactions not found');
				}

				var categories_id = [];
				categories.map(function (category) {
					categories_id.push(category._id);
				});

				return BPromise.all(categories_id)
					.then(function () {
						return ProgramDao.getAll({
							categories_id : categories_id,
							user_id       : user_id
						});
					})
					.then(function (programs) {
						if (!programs.length) {
							throw new Exception.NoResultEx('No transaction found');
						}

						var programs_id = [];
						programs.map(function(program){
							programs_id.push(program._id);
						}) ;

						return BPromise.all(programs_id)
							.then(function () {
								return TransactionDao.getAll({
									programs_id : programs_id,
									user_id     : user_id
								});
							});
					});
			})
			.then(function (transactions) {
				ResponseService.success(res, {
					result  : transactions
				});
			})
			.catch(Exception.NoResultEx, function () {
				ResponseService.success(res, {
					result  : []
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TransactionService#allByTypeU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] TransactionService#allByTypeU');
	},

	// Get transactions by program
	allByProgramU : function (req, res, user_id) {

		Logger.debug('[SER - START] TransactionService#allByProgramU');
		Logger.debug('              -- user_id : ' + user_id);

		TransactionDao.getAll({
				programs_id : [ req.params.program_id ],
				user_id     : user_id
			})
			.then(function (transactions) {
				ResponseService.success(res, {
					result  : transactions
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TransactionService#allByProgramU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] TransactionService#allByProgramU');
	},

	// Get one transaction by id
	getByIdU      : function (req, res, user_id) {

		Logger.debug('[SER - START] TransactionService#getByIdU');
		Logger.debug('              -- user_id : ' + user_id);

		TransactionDao.getOne({
				transaction_id : req.params.transaction_id,
				user_id        : user_id
			})
			.then(function (transaction) {
				ResponseService.success(res, {
					result  : transaction,
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TransactionService#getByIdU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] TransactionService#getByIdU');
	}
};