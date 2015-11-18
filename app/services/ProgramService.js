"use strict";

// Inject
var BPromise        = require('bluebird');
var ErrorManager    = require(global.__app + '/ErrorManager');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_share + '/ResponseService');
var BudgetService   = require(global.__service_share + '/BudgetService');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TransactionDao  = require(global.__dao + '/TransactionDao');

module.exports = {

	// Create one program
	create         : function (req, res) {

		Logger.debug('[SER-START] ProgramService#create');

		let input = {
			category_id : req.body.category_id || req.query.category_id,
			budget      : req.body.budget,
			plan_id     : req.body.plan_id || req.query.plan_id,
			user_id     : req.decoded.id
		};

		BudgetService.createProgram(input)
			.then(function (program) {
				ResponseService.success(res, {
					message : 'Add program',
					result  : program
				});
			})
			.catch(function (err) {
				Logger.debug('[SER-CATCH] ProgramService#create');
				Logger.error('-- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Add program',
				});
			});

		Logger.debug('[SER - END] ProgramService#create');
	},

	// Update one program
	update         : function (req, res) {

		Logger.debug('[SER-START] ProgramService#update');

		let category_id = req.body.category_id || req.query.category_id;

		let input = {
			id          : req.params.program_id,
			category_id : category_id,
			budget      : req.body.budget,
			user_id     : req.decoded.id
		};

		let promise;
		if(category_id) {
			promise = CategoryDao.getOne({ 
					id      : category_id,
					user_id : req.decoded.id
				})
				.then(function (categoryNew) {
					return ProgramDao.getOne({ 
							id      : req.params.program_id,
							user_id : req.decoded.id
						})
						.then(function (program) {
							if(categoryNew._id === program._category) {
								return BPromise.resolve(categoryNew);

							} else {
								return CategoryDao.getOne({
									id      : program._category,
									user_id : req.decoded.id
								});
							}
						})
						.then(function (categoryOld) {
							if(categoryOld._type === categoryNew._type) {
								return ProgramDao.update(input);
							} else {
								throw new ErrorManager.MetierError('Category invalid');
							}
						});
				});
		} else {
			promise = ProgramDao.update(input);
		}		

		promise
			.then(function (program) {
				ResponseService.success(res, {
					message : 'Update program',
					result  : program 
				});
			})
			.catch(function (err) {
				Logger.debug('[SER-CATCH] ProgramService#update');
				Logger.error('-- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Update program',
				});
			});

		Logger.debug('[SER - END] ProgramService#update');
	},

	// Remove one program
	remove         : function (req, res) {

		Logger.debug('[SER-START] ProgramService#remove');
		
		ProgramDao.getOne({ 
				id : req.params.program_id,
				user_id : req.decoded.id
			})
			.then(function (program) {
				return CategoryDao.getOne({
						id      : program._category,
						user_id : req.decoded.id
					})
					.then(function (category) {
						return CategoryDao.getOne({ 
								neutre  : true,
								type_id : category._type,
								user_id : req.decoded.id
							});
					})
					.then(function (categoryNeutre) {
						return ProgramDao.getOne({ 
								plan_id     : program._plan,
								category_id : categoryNeutre._id,
								user_id     : req.decoded.id
							});
					})
					.then(function (programNeutre) {
						return TransactionDao.update({
								program_id : programNeutre._id
							}, {
								program_id : program._id,
								user_id    : req.decoded.id
							});
					});
			})
			.then(function () {
				return ProgramDao.remove({
						id      : req.params.program_id,
						user_id : req.decoded.id
					});
			})
			.then(function () {
				ResponseService.success(res, {
					message : 'Remove program'
				});
			})
			.catch(function (err) {
				Logger.debug('[SER-CATCH] ProgramService#update');
				Logger.error('-- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Remove program'
				});
			});

		Logger.debug('[SER - END] ProgramService#remove');
	},

	// Get programs by plan
	allByPlanTypeU : function (req, res) {

		Logger.debug('[SER-START] ProgramService#allByPlanU');

		let plan_id          = req.body.plan_id || req.query.plan_id;
		let type_category_id = req.body.type_category_id || req.query.type_category_id;

		CategoryDao.getAll({
			type_id : type_category_id,
			user_id : req.decoded.id
		})
		.then(function (categories) {			
			let categories_id = {};
			return BPromise.map(categories, function (category) {
					categories_id.push(category._id);
				}) 
				.then(function () {
					return ProgramDao.getAll({
								categories_id : categories_id,
								plan_id       : plan_id,
								user_id       : req.decoded.id
							});
				});
		})
		.then(function (programs) {
			ResponseService.success(res, {
				message : 'Get all programs by plan and type category',
				resutl  : programs
			});
		})
		.catch(function (err) {
			Logger.debug('[SER-CATCH] ProgramService#allByPlanU');
			Logger.error('-- message : ' + err.message);

			ResponseService.fail(res, {
				message : 'Get all programs by plan and type category'
			});
		});

		Logger.debug('[SER - END] ProgramService#allByPlanU');
	},

	// Get one program by id
	getByIdU       : function (req, res) {

		Logger.debug('[SER-START] ProgramService#getByIdU');

		ProgramDao.getOne({
				id      : req.params.program_id,
				user_id : req.decoded.id
			})
			.then(function (program) {
				ResponseService.success(res, {
					message : 'Get program', 
					result  : program
				});
			})
			.catch(function (err) {
				Logger.debug('[SER-CATCH] ProgramService#getByIdU');
				Logger.error('-- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get program'
				});
			});

		Logger.debug('[SER - END] ProgramService#getByIdU');
	}
};