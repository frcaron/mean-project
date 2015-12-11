"use strict";

//Inject
var path            = require('path');
var responseService = require(path.join(global.__service, 'response'));
var planService     = require(path.join(global.__service, 'plan'));
var programService  = require(path.join(global.__service, 'program'));
var Exception       = require(path.join(global.__core, 'exception'));
var logger          = require(path.join(global.__core, 'system')).Logger;

// Properties
var api_prefix = '/plans';

module.exports = function (router, auth) {

	router.route(api_prefix)

		// Get all plans
		.get(auth, function (req, res, next) {
			planService.allByU(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		})

		// Create one plan
		.post(auth, function (req, res, next) {

			logger.debug('[WSP - VALID] PlanRoute#post');
			logger.debug('              -- req.body.month : ' + req.body.month);
			logger.debug('              -- req.body.year  : ' + req.body.year);

			// Validation
			let msg = [];
			if (!req.body.month) {
				msg.push('month');
			}
			if (!req.body.year) {
				msg.push('year');
			}
			if(msg.length) {
				return next(new Exception.MetierEx('Param missing', msg));
			}
			next();

		}, function (req, res, next) {

			planService.create(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:plan_id')

		// Get one program
		.get(auth, function (req, res, next) {
			planService.getById(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		})

		// Delete one plan
		.delete(auth, function (req , res, next) {
			planService.remove(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res);
		});

	router.route(api_prefix + '/:plan_id/programs')

		// Get all programs
		.get(auth, function (req, res, next) {

			let plan_id          = req.body.plan_id || req.query.plan_id;
			let type_category_id = req.body.type_category_id || req.query.type_category_id;

			logger.debug('[WSP - VALID] PlanRoute#get');
			logger.debug('              -- plan_id          : ' + plan_id);
			logger.debug('              -- type_category_id : ' + type_category_id);

			// Validation
			if(!type_category_id) {
				return next(new Exception.MetierEx('Param missing', [ 'type_category_id' ]));
			}
			next();

		}, function (req, res, next) {

			programService.allByPlanTypeU(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});
};