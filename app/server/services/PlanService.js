"use strict";

// Inject
var BPromise        = require('bluebird');
var Exception       = require(global.__server + '/ExceptionManager');
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var BudgetService   = require(global.__service + '/share/BudgetService');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var TransactionDao  = require(global.__dao + '/TransactionDao');

module.exports = {

	// Create one plan
	create (req, res, user_id) {

		Logger.debug('[SER - START] PlanService#create');
		Logger.debug('              -- user_id : ' + user_id);

		BudgetService.createPlan({
				month   : req.body.month,
				year    : req.body.year,
				user_id : user_id
			})
			.then(function (plan) {
				ResponseService.success(res, {
					result  : plan
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] PlanService#create');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] PlanService#create');
	},

	// Delete plan user
	remove (req, res, user_id) {

		Logger.debug('[SER - START] PlanService#remove');
		Logger.debug('              -- user_id : ' + user_id);

		let msg = [];
		BPromise.map([PlanDao, ProgramDao, TransactionDao],
			function(dao) {
				return dao.remove({
						plan_id : req.params.plan_id,
						user_id : user_id
					 })
					.catch(Exception.NoResultEx, function () {
					})
					.catch(function (err) {
					   msg.push(err.message);
					});
			})
			.then(function() {
				console.log(msg);
				if(msg.length) {
					throw new Error();
				}
				ResponseService.success(res);
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] PlanService#remove');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] PlanService#remove');
	},

	// Get plans by user
	allByU (req, res, user_id) {

		Logger.debug('[SER - START] PlanService#allByU');
		Logger.debug('              -- user_id : ' + user_id);

		PlanDao.getAll({ user_id : user_id })
			.then(function (plans) {
				ResponseService.success(res, {
					result  : plans
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] PlanService#allByU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] PlanService#allByU');
	},

	// Get one plan by id
	getById (req, res, user_id) {

		Logger.debug('[SER - START] PlanService#getById');
		Logger.debug('              -- user_id : ' + user_id);

		PlanDao.getOne({
				plan_id : req.params.plan_id,
				user_id : user_id
			})
			.then(function (plan) {
				ResponseService.success(res, {
					result  : plan
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] PlanService#getById');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] PlanService#getById');
	}
};