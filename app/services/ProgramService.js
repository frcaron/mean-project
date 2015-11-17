"use strict";

// Inject
var BPromise        = require('bluebird');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_trans + '/ResponseService');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');

module.exports = {

	// Create one program
	create         : function (req, res) {

		Logger.debug('ProgramService#create - [start]');

		let input = {
			_category : req.body.category_id || req.query.category_id,
			budget    : req.body.budget,
			_plan     : req.body.plan_id || req.query.plan_id,
			_user     : req.decoded.id
		};

		CategoryDao.getOne({ 
				id      : input._category,
				user_id : input._user
			})
			.then(function () {
				return PlanDao.getOne({ 
							id      : input._plan,
							user_id : input._user
						});
			})
			.then(function () {
				return ProgramDao.create(input);
			})
			.then(function (program) {
				ResponseService.success(res, {
					message : 'Add program',
					result  : program
				});
			})
			.catch(function (err) {
                Logger.error('ProgramService#create | ' + err.message);

				ResponseService.fail(res, {
					message : 'Add program',
				});
			});

		Logger.debug('ProgramService#create - [end]');
	},

	// Update one program
	update         : function (req, res) {

		Logger.debug('ProgramService#update - [start]');

		// TODO update avec category du même type obligatoire !

		let input = {
			_id       : req.params.program_id,
			_category : req.body.category_id || req.query.category_id,
			budget    : req.body.budget,
			_user     : req.decoded.id
		};

		CategoryDao.getOne({ 
				id      : input._category,
				user_id : input._user
			})
			.then(function () {
				return ProgramDao.update(input);
			})
			.then(function (program) {
				ResponseService.success(res, {
					message : 'Update program',
					result  : program 
				});
			})
			.catch(function (err) {
                Logger.error('ProgramService#update | ' + err.message);

				ResponseService.fail(res, {
					message : 'Update program',
				});
			});

		Logger.debug('ProgramService#update - [end]');
	},

	// Remove one program
	remove         : function (req, res) {

		Logger.debug('ProgramService#remove - [start]');

		// TODO impact

		ProgramDao.remove({
				id      : req.params.program_id,
				user_id : req.decoded.id
			})
			.then(function () {
				ResponseService.success(res, {
					message : 'Remove program'
				});
			})
			.catch(function (err) {
                Logger.error('ProgramService#update | ' + err.message);

				ResponseService.fail(res, {
					message : 'Remove program'
				});
			});

		Logger.debug('ProgramService#remove - [end]');
	},

	// Get programs by plan
	allByPlanTypeU : function (req, res) {

		Logger.debug('ProgramService#allByPlanU - [start]');

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
			Logger.error('ProgramService#allByPlanU | ' + err.message);

			ResponseService.fail(res, {
				message : 'Get all programs by plan and type category'
			});
		});

		Logger.debug('ProgramService#allByPlanU - [end]');
	},

	// Get one program by id
	getByIdU       : function (req, res) {

		Logger.debug('ProgramService#getByIdU - [start]');

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
				Logger.error('ProgramService#getByIdU | ' + err.message);

				ResponseService.fail(res, {
					message : 'Get program'
				});
			});

		Logger.debug('ProgramService#getByIdU - [end]');
	}
};