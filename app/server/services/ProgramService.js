"use strict";

// Inject
var BPromise        = require('bluebird');
var ExManager       = require(global.__server + '/ExceptionManager');
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var BudgetService   = require(global.__service + '/share/BudgetService');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TransactionDao  = require(global.__dao + '/TransactionDao');

module.exports = {

	// Create one program
	create         : function (req, res, user_id) {

		Logger.debug('[SER - START] ProgramService#create');
		Logger.debug('              -- user_id : ' + user_id);

		BudgetService.createProgram({
				category_id : req.body.category_id || req.query.category_id,
				budget      : req.body.budget,
				plan_id     : req.body.plan_id || req.query.plan_id,
				user_id     : user_id
			})
			.then(function (program) {
				ResponseService.success(res, {
					result  : program
				});
			})
			.catch(ExManager.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] ProgramService#create');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] ProgramService#create');
	},

	// Update one program
	update         : function (req, res, user_id) {

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
			promise = CategoryDao.getOne({
					category_id : category_id,
					user_id     : user_id
				})
				.then(function (categoryNew) {
					return ProgramDao.getOne({
							program_id : req.params.program_id,
							user_id    : user_id
						})
						.then(function (program) {
							if(categoryNew._id === program._category) {
								return BPromise.resolve(categoryNew);

							} else {
								return CategoryDao.getOne({
									category_id : program._category,
									user_id     : user_id
								});
							}
						})
						.then(function (categoryOld) {
							if(categoryOld._type === categoryNew._type) {
								return ProgramDao.update(input);
							} else {
								throw new ExManager.MetierEx('Category invalid');
							}
						});
				});
		} else {
			promise = ProgramDao.update(input);
		}

		promise
			.then(function (program) {
				ResponseService.success(res, {
					result  : program
				});
			})
			.catch(ExManager.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] ProgramService#update');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] ProgramService#update');
	},

	// Remove one program
	remove         : function (req, res, user_id) {

		Logger.debug('[SER - START] ProgramService#remove');
		Logger.debug('              -- user_id : ' + user_id);

		ProgramDao.getOne({
				program_id : req.params.program_id,
				user_id    : user_id
			})
			.then(function (program) {
				return CategoryDao.getOne({
						category_id : program._category,
						user_id     : user_id
					})
					.then(function (category) {
						return CategoryDao.getOne({
							neutre           : true,
							type_category_id : category._type,
							user_id          : user_id
						});
					})
					.then(function (categoryNeutre) {
						return ProgramDao.getOne({
							plan_id     : program._plan,
							category_id : categoryNeutre._id,
							user_id     : user_id
						});
					})
					.then(function (programNeutre) {
						return TransactionDao.update({
							program_id : programNeutre._id
						}, {
							program_id : program._id,
							user_id    : user_id
						});
					});
			})
			.then(function () {
				return ProgramDao.remove({
					program_id : req.params.program_id,
					user_id    : user_id
				});
			})
			.then(function () {
				ResponseService.success(res);
			})
			.catch(ExManager.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] ProgramService#update');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] ProgramService#remove');
	},

	// Get programs by plan
	allByPlanTypeU : function (req, res, user_id) {

		Logger.debug('[SER - START] ProgramService#allByPlanU');
		Logger.debug('              -- user_id : ' + user_id);

		let type_category_id = req.body.type_category_id || req.query.type_category_id;

		CategoryDao.getAll({
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
						return ProgramDao.getAll({
							categories_id : categories_id,
							plan_id       : req.params.plan_id,
							user_id       : user_id
						});
					});
			})
			.then(function (programs) {
				ResponseService.success(res, {
					result  : programs
				});
			})
			.catch(ExManager.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] ProgramService#allByPlanU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] ProgramService#allByPlanU');
	},

	// Get one program by id
	getByIdU       : function (req, res, user_id) {

		Logger.debug('[SER - START] ProgramService#getByIdU');
		Logger.debug('              -- user_id : ' + user_id);

		ProgramDao.getOne({
				program_id : req.params.program_id,
				user_id    : user_id
			})
			.then(function (program) {
				ResponseService.success(res, {
					result  : program
				});
			})
			.catch(ExManager.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] ProgramService#getByIdU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] ProgramService#getByIdU');
	}
};