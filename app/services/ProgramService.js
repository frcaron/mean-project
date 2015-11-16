"use strict";

// Inject
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_trans + '/ResponseService');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');

module.exports = {

	// Create one program
	create     : function (req, res) {

		Logger.debug('ProgramService#create - [start]');

		var input = {
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
	update     : function (req, res) {

		Logger.debug('ProgramService#update - [start]');

		var input = {
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
	remove     : function (req, res) {

		Logger.debug('ProgramService#remove - [start]');

		ProgramDao.remove({
				_id   : req.params.program_id,
				_user : req.decoded.id
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
	allByPlanU : function (req, res) {

		Logger.debug('ProgramService#allByPlanU - [start]');

		ProgramDao.getAll({
				plan_id : req.params.plan_id,
				user_id : req.decoded.id
			})
			.then(function (programs) {
				ResponseService.success(res, {
					message : 'Find success',
					resutl  : programs
				});
			})
			.catch(function (err) {
				Logger.error('ProgramService#allByPlanU | ' + err.message);

				ResponseService.fail(res, {
					message : 'Get all programs'
				});
			});

		Logger.debug('ProgramService#allByPlanU - [end]');
	},

	// Get one program by id
	getByIdU   : function (req, res) {

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