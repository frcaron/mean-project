"use strict";

// Inject
var BPromise       = require('bluebird');
var Exception      = require(global.__server  + '/ExceptionManager');
var Logger         = require(global.__server  + '/LoggerManager');
var BudgetService  = require(global.__service + '/share/BudgetService');
var PlanDao        = require(global.__dao     + '/PlanDao');
var ProgramDao     = require(global.__dao     + '/ProgramDao');
var TransactionDao = require(global.__dao     + '/TransactionDao');

module.exports = {

	// Create one plan
	create (req, next, user_id) {

		Logger.debug('[SER - START] PlanService#create');
		Logger.debug('              -- user_id : ' + user_id);

		BudgetService.createPlan({
				month   : req.body.month,
				year    : req.body.year,
				user_id : user_id
			})
			.then(function (plan) {
				req.result = plan;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] PlanService#create');
	},

	// Delete plan user
	remove (req, next, user_id) {

		Logger.debug('[SER - START] PlanService#remove');
		Logger.debug('              -- user_id : ' + user_id);

		let msg = [];
		BPromise.map([[
				PlanDao, 'byIdU'],
				[ProgramDao, 'byPlanU'],
				[TransactionDao, 'byPlanU']
			], function(dao) {
				return dao[0].remove(dao[1], {
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
				if(msg.length) {
					throw new Error(msg);
				}
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] PlanService#remove');
	},

	// Get plans by user
	allByU (req, next, user_id) {

		Logger.debug('[SER - START] PlanService#allByU');
		Logger.debug('              -- user_id : ' + user_id);

		PlanDao.getAll('byU', { user_id : user_id })
			.then(function (plans) {
				req.result = plans;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] PlanService#allByU');
	},

	// Get one plan by id
	getById (req, next, user_id) {

		Logger.debug('[SER - START] PlanService#getById');
		Logger.debug('              -- user_id : ' + user_id);

		PlanDao.getOne('byIdU', {
				plan_id : req.params.plan_id,
				user_id : user_id
			})
			.then(function (plan) {
				req.result = plan;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] PlanService#getById');
	}
};