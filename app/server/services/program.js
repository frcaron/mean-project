"use strict";

// Inject
var Path           = require('path');
var BPromise       = require('bluebird');
var BudgetService  = require(Path.join(global.__service, 'share'));
var ProgramDao     = require(Path.join(global.__dao, 'program'));
var CategoryDao    = require(Path.join(global.__dao, 'category'));
var TransactionDao = require(Path.join(global.__dao, 'transaction'));
var Exception      = require(Path.join(global.__core, 'exception'));
var Logger         = require(Path.join(global.__core, 'system')).Logger;

module.exports = {

	// Create one program
	create (req, next, user_id) {

		Logger.debug('[SER - START] ProgramService#create');
		Logger.debug('              -- user_id : ' + user_id);

		BudgetService.createProgram({
				category_id : req.body.category_id || req.query.category_id,
				budget      : req.body.budget,
				plan_id     : req.body.plan_id || req.query.plan_id,
				user_id     : user_id
			})
			.then(function (program) {
				req.result = program;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] ProgramService#create');
	},

	// Update one program
	update (req, next, user_id) {

		Logger.debug('[SER - START] ProgramService#update');
		Logger.debug('              -- user_id : ' + user_id);

		let category_id = req.body.category_id || req.query.category_id;

		let input = {
			program_id  : req.params.program_id,
			category_id : category_id,
			budget      : req.body.budget,
			user_id     : user_id
		};

		let promise;
		if(category_id) {
			promise = CategoryDao.getOne('byIdU', {
					category_id : category_id,
					user_id     : user_id
				})
				.then(function (categoryNew) {
					return ProgramDao.getOne('byIdU', {
							program_id : req.params.program_id,
							user_id    : user_id
						})
						.then(function (program) {
							if(categoryNew._id === program._category) {
								return BPromise.resolve(categoryNew);

							} else {
								return CategoryDao.getOne('byIdU', {
									category_id : program._category,
									user_id     : user_id
								});
							}
						})
						.then(function (categoryOld) {
							if(categoryOld._type === categoryNew._type) {
								return ProgramDao.update(input);
							} else {
								throw new Exception.MetierEx('Category invalid');
							}
						});
				});
		} else {
			promise = ProgramDao.update(input);
		}

		promise
			.then(function (program) {
				req.result = program;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] ProgramService#update');
	},

	// Remove one program
	remove (req, next, user_id) {

		Logger.debug('[SER - START] ProgramService#remove');
		Logger.debug('              -- user_id : ' + user_id);

		ProgramDao.getOne('byIdU', {
				program_id : req.params.program_id,
				user_id    : user_id
			})
			.then(function (program) {
				return CategoryDao.getOne('byIdU', {
						category_id : program._category,
						user_id     : user_id
					})
					.then(function (category) {
						return CategoryDao.getOne('byNeutreTypeU', {
							neutre           : true,
							type_category_id : category._type,
							user_id          : user_id
						});
					})
					.then(function (categoryNeutre) {
						return ProgramDao.getOne('byCategoryPlanU', {
							plan_id     : program._plan,
							category_id : categoryNeutre._id,
							user_id     : user_id
						});
					})
					.then(function (programNeutre) {
						return TransactionDao.update({
							program_id : programNeutre._id
						}, 'byProgramU', {
							program_id : program._id,
							user_id    : user_id
						});
					});
			})
			.then(function () {
				return ProgramDao.remove('byIdU', {
					program_id : req.params.program_id,
					user_id    : user_id
				});
			})
			.then(function () {
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] ProgramService#remove');
	},

	// Get programs by plan
	allByPlanTypeU (req, next, user_id) {

		Logger.debug('[SER - START] ProgramService#allByPlanU');
		Logger.debug('              -- user_id : ' + user_id);

		let type_category_id = req.body.type_category_id || req.query.type_category_id;

		CategoryDao.getAll('byTypeU', {
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
						return ProgramDao.getAll('inCategoriesbyPlanU', {
							categories_id : categories_id,
							plan_id       : req.params.plan_id,
							user_id       : user_id
						});
					});
			})
			.then(function (programs) {
				req.result = programs;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] ProgramService#allByPlanU');
	},

	// Get one program by id
	getByIdU (req, next, user_id) {

		Logger.debug('[SER - START] ProgramService#getByIdU');
		Logger.debug('              -- user_id : ' + user_id);

		ProgramDao.getOne('byIdU', {
				program_id : req.params.program_id,
				user_id    : user_id
			})
			.then(function (program) {
				req.result = program;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] ProgramService#getByIdU');
	}
};