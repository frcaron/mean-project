"use strict";

// Inject
var BPromise        = require('bluebird');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_trans + '/ResponseService');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');

module.exports = {

	// Create one plan
	create  : function (req, res) {

		Logger.debug('PlanService#create - [start]');

		let inputPlan = {
			month : req.body.month,
			year  : req.body.year,
			_user : req.decoded.id
		};

		PlanDao.create(inputPlan)
			.then(function (plan) {
				return CategoryDao.getAll({ 
						active  : false,
						user_id : req.decoded.id
					})
					.then(function (categories) {
						return BPromise.map(categories, function (category) {
							
							let inputProgram = {
								_category : category._id,
								_plan     : plan._id
							};

							return ProgramDao.create(inputProgram);
						});
					})
					.then(function () {
						return BPromise.resolve(plan);
					})
					.catch(function (err) {
						PlanDao.remove({ id : plan._id });
						throw err;
					});
			})
			.then(function (plan) {
				ResponseService.success(res, { 
					message : 'Add plan', 
					result  : plan
				});
			})
			.catch(function (err) {
                Logger.error('PlanService#create | ' + err.message);

                ResponseService.fail(res, {
                    message : 'Add plan'
                });
			});

		Logger.debug('PlanService#create - [end]');
	},

	// Get plans by user
	allByU  : function (req, res) {

		Logger.debug('PlanService#allByU - [start]');

		PlanDao.getAll({ user_id : req.decoded.id })
			.then(function (plans) {
				ResponseService.success(res, {
					message : 'Get all plans',
					result  : plans
				});
			})
			.catch(function (err) {
                Logger.error('PlanService#allByU | ' + err.message);

                ResponseService.fail(res, {
                    message : 'Get all plans'
                });
			});

		Logger.debug('PlanService#allByU - [end]');
	},

	// Get one plan by id
	getById : function (req, res) {

		Logger.debug('PlanService#getById [start]');

		PlanDao.getOne({
				id      : req.params.plan_id,
				user_id : req.decoded.id
			})
			.then(function (plan) {
				ResponseService.success(res, {
					message : 'Get plan', 
					result  : plan
				});
			})
			.catch(function (err) {
                Logger.error('PlanService#getById | ' + err.message);

                ResponseService.fail(res, {
                    message : 'Get plan'
                });
			});
				
		Logger.debug('PlanService#getById [end]');
	}
};