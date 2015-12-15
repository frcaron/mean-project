"use strict";

//Inject
var path               = require('path');
var responseService    = require(path.join(global.__service, 'response'));
var programService     = require(path.join(global.__service, 'program'));
var transactionService = require(path.join(global.__service, 'transaction'));
var Exception          = require(path.join(global.__core, 'exception'));
var logger             = require(path.join(global.__core, 'logger'))('route', __filename);

// Properties
var api_prefix = '/programs';

module.exports = function (router, auth) {

	router.route(api_prefix)

		// Create one program
		.post(auth, function (req, res, next) {

			let category_id = req.body.category_id || req.query.category_id;
			let plan_id     = req.body.plan_id || req.query.plan_id;

			logger.debug({ method : 'programs@post', point : logger.pt.valid, params : {
				'category_id' : category_id,
				'plan_id'     : plan_id
			} });

			// Validation
			var msg = [];
			if (!plan_id) {
				msg.push('plan_id');
			}
			if (!category_id) {
				msg.push('category_id');
			}
			if(msg.length) {
				return next(new Exception.MetierEx('Param missing', msg));
			}
			next();

		}, function (req, res, next) {

			programService.create(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:program_id')

		// Get one program
		.get(auth, function (req, res, next) {
			programService.getByIdU(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		})

		// Update one program
		.put(auth, function (req, res, next) {
			programService.update(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		})

		// Delete one program
		.delete(auth, function (req, res, next) {
			programService.remove(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res);
		});

	router.route(api_prefix + '/:program_id/transactions')

		// Get all transactions by program
		.get(auth, function (req, res, next) {
			transactionService.allByProgramU(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});
};