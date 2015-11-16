"use strict";

// Inject
var ErrorManager    = require(global.__app + '/ErrorManager');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_trans + '/ResponseService');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TypeCategoryDao = require(global.__dao + '/TypeCategoryDao');

module.exports = {

	// Create one plan
	create  : function (req, res) {

		Logger.debug('PlanService#create - [start]');

		var planTmp, typeCategoryTmp;
		var inputPlan = {
			month : req.body.month,
			year  : req.body.year,
			_user : req.decoded.id
		};

		PlanDao.create(inputPlan)
			.then(function (plan) {
				planTmp = plan;

				return TypeCategoryDao.getOne({ type : 'unknow' })
					.catch(ErrorManager.NoResultError, function () {
						var inputTypeCategory = {					
							type   : 'unknow',
							active : false
						};

						return TypeCategoryDao.create(inputTypeCategory);
					})
					.then(function (typeCategory) {
						typeCategoryTmp = typeCategory;
						return CategoryDao.getOne({
									type    : typeCategory._id,
									user_id : req.decoded.id
								});
					})
					.catch(ErrorManager.NoResultError, function () {
						var inputCategory = {
							name   : 'unknow',
							_type  : typeCategoryTmp._id,
							_user  : req.decoded.id,
							active : false
						};
						return CategoryDao.create(inputCategory);
					})
					.then(function (category) {
						var inputProgram = {
							_category : category._id,
							_plan     : plan._id,
							_user     : req.decoded.id
						};
						return ProgramDao.create(inputProgram);
					})
					.catch(function (err) {
						PlanDao.remove({ id : planTmp._id });
						throw err;
					});
			})
			.then(function () {
				ResponseService.success(res, { 
					message : 'Add plan', 
					result  : planTmp
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