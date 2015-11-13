"use strict";

// Inject
var ErrorManager    = require(global.__app + '/ErrorManager');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service + '/ResponseService');
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
			month   : req.body.month,
			year    : req.body.year,
			user_id : req.decoded.id
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

						var filtersCategory = {
							type  : typeCategory._id,
							user_id : req.decoded.id
						} ;

						return CategoryDao.getOne(filtersCategory);
					})
					.catch(ErrorManager.NoResultError, function () {
						var inputCategory = {
							name    : 'unknow',
							type_id : typeCategoryTmp._id,
							user_id : req.decoded.id,
							active  : false
						};

						return CategoryDao.create(inputCategory);
					})
					.then(function (category) {
						var inputProgram = {
							category_id : category._id,
							plan_id     : plan._id,
							user_id     : req.decoded.id
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

		var filters = {
			user_id : req.decoded.id
		};

		PlanDao.getAll(filters)
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

		Logger.debug('PlanService#getBy [start]');

		var filters = {
			id      : req.params.plan_id,
			user_id : req.decoded.id
		};

		PlanDao.getOne(filters)
			.then(function (plan) {
				ResponseService.success(res, {
					message : 'Get plan', 
					result  : plan
				});
			})
			.catch(function (err) {
                Logger.error('PlanService#getBy | ' + err.message);

                ResponseService.fail(res, {
                    message : 'Get plan'
                });
			});
				
		Logger.debug('PlanService#getBy [end]');
	}
};