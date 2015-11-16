"use strict";

// Inject
var ErrorManager    = require(global.__app + '/ErrorManager');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service + '/ResponseService');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');

module.exports = {

	// Create one program
	create     : function (req, res) {

		Logger.debug('ProgramService#create - [start]');

		let input = {
			_category : req.body.category_id || req.query.category_id,
			budget    : req.body.budget,
			_plan     : req.body.plan_id || req.query.plan_id,
			_user     : req.decoded.id
		};

		CategoryDao.getOne({ id : input._category, user_id : input._user })
			.then(function () {
				return PlanDao.getOne({ id : input._plan, user_id : input._user });
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

		let input = {
			_id       : req.params.program_id,
			_category : req.body.category_id || req.query.category_id,
			budget    : req.body.budget,
			_user     : req.decoded.id
		};

		CategoryDao.getOne({ id : input._category, user_id : input._user })
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

		var filters = {
			_id   : req.params.program_id,
			_user : req.decoded.id
		};

		ProgramDao.remove(filters)
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

		var promise = ProgramModel.findAsync({
			_user : req.decoded.id,
			_plan : req.params.plan_id
		});

		promise
			.then(function (programs) {
				responseService.success(res, 'Find success', programs);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get one program by id
	getByIdU   : function (req, res) {

		var promise = ProgramModel.findOneAsync({
			_id   : req.params.program_id,
			_user : req.decoded.id
		});

		promise
			.then(function (program) {

				if (!program) {
					throw new Error('Program not found');
				}
				responseService.success(res, 'Find success', program);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	}
};