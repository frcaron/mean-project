"use strict";

// Inject
var path           = require('path');
var BPromise       = require('bluebird');
var shareService   = require(path.join(global.__service, 'share'));
var programDao     = require(path.join(global.__dao, 'program'));
var categoryDao    = require(path.join(global.__dao, 'category'));
var transactionDao = require(path.join(global.__dao, 'transaction'));
var Exception      = require(path.join(global.__core, 'exception'));
var logger         = require(path.join(global.__core, 'logger'))('service', __filename);

module.exports = {

	// Create one program
	create (req, next, user_id) {

		logger.debug({ method : 'create', point : logger.pt.start, params : { user_id : user_id } });

		shareService.createProgram({
				category_id : req.body.category_id || req.query.category_id,
				budget      : req.body.budget,
				plan_id     : req.body.plan_id || req.query.plan_id,
				user_id     : user_id
			})
			.then(function (program) {
				req.result = program;

				logger.debug({ method : 'create', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'create', point : logger.pt.catch });
				next(err);
			});
	},

	// Update one program
	update (req, next, user_id) {

		logger.debug({ method : 'update', point : logger.pt.start, params : { user_id : user_id } });

		let category_id = req.body.category_id || req.query.category_id;

		let input = {
			program_id  : req.params.program_id,
			category_id : category_id,
			budget      : req.body.budget,
			user_id     : user_id
		};

		let promise;
		if(category_id) {
			promise = categoryDao.getOne('byIdU', {
					category_id : category_id,
					user_id     : user_id
				})
				.then(function (categoryNew) {
					return programDao.getOne('byIdU', {
							program_id : req.params.program_id,
							user_id    : user_id
						})
						.then(function (program) {
							if(categoryNew._id === program._category) {
								return BPromise.resolve(categoryNew);

							} else {
								return categoryDao.getOne('byIdU', {
									category_id : program._category,
									user_id     : user_id
								});
							}
						})
						.then(function (categoryOld) {
							if(categoryOld._type === categoryNew._type) {
								return programDao.update(input);
							} else {
								throw new Exception.MetierEx('Category invalid');
							}
						});
				});
		} else {
			promise = programDao.update(input);
		}

		promise
			.then(function (program) {
				req.result = program;

				logger.debug({ method : 'update', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'update', point : logger.pt.catch });
				next(err);
			});
	},

	// Remove one program
	remove (req, next, user_id) {

		logger.debug({ method : 'remove', point : logger.pt.start, params : { user_id : user_id } });

		programDao.getOne('byIdU', {
				program_id : req.params.program_id,
				user_id    : user_id
			})
			.then(function (program) {
				return categoryDao.getOne('byIdU', {
						category_id : program._category,
						user_id     : user_id
					})
					.then(function (category) {
						return categoryDao.getOne('byNeutreTypeU', {
							neutre           : true,
							type_category_id : category._type,
							user_id          : user_id
						});
					})
					.then(function (categoryNeutre) {
						return programDao.getOne('byCategoryPlanU', {
							plan_id     : program._plan,
							category_id : categoryNeutre._id,
							user_id     : user_id
						});
					})
					.then(function (programNeutre) {
						return transactionDao.update({
							program_id : programNeutre._id
						}, 'byProgramU', {
							program_id : program._id,
							user_id    : user_id
						});
					});
			})
			.then(function () {
				return programDao.remove('byIdU', {
					program_id : req.params.program_id,
					user_id    : user_id
				});
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

	// Get programs by plan
	allByPlanTypeU (req, next, user_id) {

		logger.debug({ method : 'allByPlanTypeU', point : logger.pt.start, params : { user_id : user_id } });

		let type_category_id = req.body.type_category_id || req.query.type_category_id;

		categoryDao.getAll('byTypeU', {
				type_category_id : type_category_id,
				user_id          : user_id
			})
			.then(function (categories) {

				if(!categories.length) {
					return BPromise.resolve([]);
				}

				let categories_id = [];
				categories.map(function (category) {
					categories_id.push(category._id);
				});

				return BPromise.all(categories)
					.then(function () {
						return programDao.getAll('inCategoriesbyPlanU', {
							categories_id : categories_id,
							plan_id       : req.params.plan_id,
							user_id       : user_id
						});
					});
			})
			.then(function (programs) {
				req.result = programs;

				logger.debug({ method : 'allByPlanTypeU', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'allByPlanTypeU', point : logger.pt.catch });
				next(err);
			});
	},

	// Get one program by id
	getByIdU (req, next, user_id) {

		logger.debug({ method : 'getByIdU', point : logger.pt.start, params : { user_id : user_id } });

		programDao.getOne('byIdU', {
				program_id : req.params.program_id,
				user_id    : user_id
			})
			.then(function (program) {
				req.result = program;

				logger.debug({ method : 'getByIdU', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'getByIdU', point : logger.pt.catch });
				next(err);
			});
	}
};