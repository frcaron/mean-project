"use strict";

//Inject
var Path            = require('path');
var ResponseService = require(Path.join(global.__service, 'response'));
var PlanService     = require(Path.join(global.__service, 'plan'));
var ProgramService  = require(Path.join(global.__service, 'program'));
var Exception       = require(Path.join(global.__core, 'exception'));
var Logger          = require(Path.join(global.__core, 'system')).Logger;

// Properties
var api_prefix = '/plans';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all plans
		.get(function (req, res, next) {
			PlanService.allByU(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		})

		// Create one plan
		.post(function (req, res, next) {

			Logger.debug('[WSP - VALID] PlanRoute#post');
			Logger.debug('              -- req.body.month : ' + req.body.month);
			Logger.debug('              -- req.body.year  : ' + req.body.year);

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

			PlanService.create(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:plan_id')

		// Get one program
		.get(function (req, res, next) {
			PlanService.getById(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		})

		// Delete one plan
		.delete(function (req , res, next) {
			PlanService.remove(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res);
		});

	router.route(api_prefix + '/:plan_id/programs')

		// Get all programs
		.get(function (req, res, next) {

			let plan_id          = req.body.plan_id || req.query.plan_id;
			let type_category_id = req.body.type_category_id || req.query.type_category_id;

			Logger.debug('[WSP - VALID] PlanRoute#get');
			Logger.debug('              -- plan_id          : ' + plan_id);
			Logger.debug('              -- type_category_id : ' + type_category_id);

			// Validation
			if(!type_category_id) {
				return next(new Exception.MetierEx('Param missing', [ 'type_category_id' ]));
			}
			next();

		}, function (req, res, next) {

			ProgramService.allByPlanTypeU(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});
};