"use strict";

// Inject
var path           = require('path');
var BPromise       = require('bluebird');
var budgetService  = require(path.join(global.__service, 'share'));
var planDao        = require(path.join(global.__dao, 'plan'));
var programDao     = require(path.join(global.__dao, 'program'));
var transactionDao = require(path.join(global.__dao, 'transaction'));
var Exception      = require(path.join(global.__core, 'exception'));
var logger         = require(path.join(global.__core, 'logger'))('service', __filename);

module.exports = {

	// Create one plan
	create (req, next, user_id) {

		logger.debug({ method : 'create', point : logger.pt.start, params : { user_id : user_id } });

		budgetService.createPlan({
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

		logger.debug({ method : 'create', point : logger.pt.end });
	},

	// Delete plan user
	remove (req, next, user_id) {

		logger.debug({ method : 'remove', point : logger.pt.start, params : { user_id : user_id } });

		let msg = [];
		BPromise.map([[
				planDao, 'byIdU'],
				[programDao, 'byPlanU'],
				[transactionDao, 'byPlanU']
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

		logger.debug({ method : 'remove', point : logger.pt.end });
	},

	// Get plans by user
	allByU (req, next, user_id) {

		logger.debug({ method : 'allByU', point : logger.pt.start, params : { user_id : user_id } });

		planDao.getAll('byU', { user_id : user_id })
			.then(function (plans) {
				req.result = plans;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug({ method : 'allByU', point : logger.pt.end });
	},

	// Get one plan by id
	getById (req, next, user_id) {

		logger.debug({ method : 'getByIdU', point : logger.pt.start, params : { user_id : user_id } });

		planDao.getOne('byIdU', {
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

		logger.debug({ method : 'getByIdU', point : logger.pt.end });
	}
};