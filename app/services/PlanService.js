"use strict";

// Inject
var BPromise        = require('bluebird');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_share + '/ResponseService');
var BudgetService   = require(global.__service_share + '/BudgetService');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var TransactionDao  = require(global.__dao + '/TransactionDao');

module.exports = {

	// Create one plan
	create  : function (req, res) {

		Logger.debug('[SER - START] PlanService#create');

		BudgetService.createPlan({
				month   : req.body.month,
				year    : req.body.year,
				user_id : req.decoded.id
			})
			.then(function (plan) {
				ResponseService.success(res, {
					message : 'Add plan',
					result  : plan
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] PlanService#create');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Add plan'
				});
			});

		Logger.debug('[SER -   END] PlanService#create');
	},

	// Delete plan user
	remove  : function (req, res) {

		Logger.debug('[SER - START] PlanService#remove');

		let msg = [];
		BPromise.map([PlanDao, ProgramDao, TransactionDao],
			function(dao) {
				return dao.remove({
						plan_id : req.params.plan_id,
						user_id : req.decoded.id
					 })
					.then(function () {
					   msg.push(' [Success]' + dao.name);
					})
					.catch(function (err) {
					   msg.push(' [Failed]' + dao.name + ' / ' + err.message);
					});
			})
		.then(function() {
			ResponseService.success(res, {
					message : 'Remove plan',
					result  : msg.toString()
				});
		})
		.catch(function (err) {
			Logger.debug('[SER - CATCH] PlanService#remove');
			Logger.error('              -- message : ' + err.message);

			ResponseService.fail(res, {
				message : 'Remove plan'
			});
		});

		Logger.debug('[SER -   END] PlanService#remove');
	},

	// Get plans by user
	allByU  : function (req, res) {

		Logger.debug('[SER - START] PlanService#allByU');

		PlanDao.getAll({ user_id : req.decoded.id })
			.then(function (plans) {
				ResponseService.success(res, {
					message : 'Get all plans',
					result  : plans
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] PlanService#allByU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get all plans'
				});
			});

		Logger.debug('[SER -   END] PlanService#allByU');
	},

	// Get one plan by id
	getById : function (req, res) {

		Logger.debug('[SER - START] PlanService#getById');

		PlanDao.getOne({
				plan_id : req.params.plan_id,
				user_id : req.decoded.id
			})
			.then(function (plan) {
				ResponseService.success(res, {
					message : 'Get plan',
					result  : plan
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] PlanService#getById');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get plan'
				});
			});

		Logger.debug('[SER -   END] PlanService#getById');
	}
};