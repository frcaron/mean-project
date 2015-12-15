"use strict";

// Inject
var path           = require('path');
var BPromise       = require('bluebird');
var shareService   = require(path.join(global.__service, 'share'));
var planDao        = require(path.join(global.__dao, 'plan'));
var programDao     = require(path.join(global.__dao, 'program'));
var transactionDao = require(path.join(global.__dao, 'transaction'));
var categoryDao    = require(path.join(global.__dao, 'category'));
var Exception      = require(path.join(global.__core, 'exception'));
var logger         = require(path.join(global.__core, 'logger'))('service', __filename);

function fulfillProgram (input, category_id) {

	let inputPlan = {
		month   : input.date.month() + 1,
		year    : input.date.year(),
		user_id : input.user_id
	};

	return planDao.getOne('byMonthYearU', inputPlan)
		.catch(Exception.NoResultEx, function () {
			return shareService.createPlan(inputPlan);
		})
		.then(function (plan) {
			let inputProgram = {
				plan_id     : plan._id,
				category_id : category_id,
				user_id     : input.user_id
			};
			return programDao.getOne('byCategoryPlanU', inputProgram)
				.catch(Exception.NoResultEx, function () {
					return shareService.createProgram(inputProgram);
				});
			})
		.then(function (program) {
			input.program_id = program._id;
			return BPromise.resolve(input);
		});
}

module.exports = {

	// Create one transaction
	create (req, next, user_id) {

		logger.debug({ method : 'create', point : logger.pt.start, params : { user_id : user_id } });

		let category_id = req.body.category_id || req.query.category_id;

		fulfillProgram({
				date    : req.body.date,
				sum     : req.body.sum,
				comment : req.body.comment,
				user_id : user_id
			}, category_id)
			.then(function(transaction) {
				return transactionDao.create(transaction);
			})
			.then(function (transaction) {
				req.result = transaction;

				logger.debug({ method : 'create', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'create', point : logger.pt.catch });
				next(err);
			});
	},

	// Update one transaction
	update (req, next, user_id) {

		logger.debug({ method : 'update', point : logger.pt.start, params : { user_id : user_id } });

		let category_id = req.body.category_id || req.query.category_id;

		fulfillProgram({
				transaction_id : req.params.transaction_id,
				date           : req.body.date,
				sum            : req.body.sum,
				comment        : req.body.comment,
				user_id        : user_id
			}, category_id)
			.then(function (transaction) {
				return transactionDao.update(transaction);
			})
			.then(function (transaction) {
				req.result = transaction;

				logger.debug({ method : 'update', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'update', point : logger.pt.catch });
				next(err);
			});
	},

	// Remove one transaction
	remove (req, next, user_id) {

		logger.debug({ method : 'remove', point : logger.pt.start, params : { user_id : user_id } });

		transactionDao.remove('byIdU', {
				transaction_id : req.params.transaction_id,
				user_id        : user_id
			})
			.then(function () {
				logger.debug({ method : 'remove', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'remove', point : logger.pt.catch });
				next(err);
			});
	},

	// Get transactions by type category
	allByTypeU (req, next, user_id) {

		logger.debug({ method : 'allByTypeU', point : logger.pt.start, params : { user_id : user_id } });

		categoryDao.getAll('byTypeU', {
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
						return programDao.getAll('inCategoriesByU', {
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
								return transactionDao.getAll('byProgramsU', {
									programs_id : programs_id,
									user_id     : user_id
								});
							});
					});
			})
			.then(function (transactions) {
				req.result = transactions;

				logger.debug({ method : 'allByTypeU', point : logger.pt.end });
				next();
			})
			.catch(Exception.NoResultEx, function () {
				req.result = [];
				logger.debug({ method : 'allByTypeU', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'allByTypeU', point : logger.pt.catch });
				next(err);
			});
	},

	// Get transactions by program
	allByProgramU (req, next, user_id) {

		logger.debug({ method : 'allByProgramU', point : logger.pt.start, params : { user_id : user_id } });

		transactionDao.getAll('byProgramsU', {
				programs_id : [ req.params.program_id ],
				user_id     : user_id
			})
			.then(function (transactions) {
				req.result = transactions;

				logger.debug({ method : 'allByProgramU', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'allByProgramU', point : logger.pt.catch });
				next(err);
			});
	},

	// Get one transaction by id
	getByIdU (req, next, user_id) {

		logger.debug({ method : 'getByIdU', point : logger.pt.start, params : { user_id : user_id } });

		transactionDao.getOne('byIdU', {
				transaction_id : req.params.transaction_id,
				user_id        : user_id
			})
			.then(function (transaction) {
				req.result = transaction;

				logger.debug({ method : 'getByIdU', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'getByIdU', point : logger.pt.catch });
				next(err);
			});
	}
};