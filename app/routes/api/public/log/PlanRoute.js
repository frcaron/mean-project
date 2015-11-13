"use strict";

//Inject
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service + '/ResponseService');
var PlanService     = require(global.__service + '/PlanService');
var ProgramService  = require(global.__service + '/ProgramService');

// Inject properties
var api_prefix = '/plans';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all plans
		.get(function (req, res) {
			PlanService.allByU(req, res);
		})

		// Create one plan
		.post(function (req, res) {

			Logger.debug('Public#PlanRoute#post [validation]');
			Logger.debug('-- req.body.month : ' + req.body.month);
			Logger.debug('-- req.body.year  : ' + req.body.year);

			// Validation
			if (!req.body.month) {
				return ResponseService.fail(res, {
							message : 'Add', 
							reason  : 'Param "month" missing'
						});
			}
			if (!req.body.year) {
				return ResponseService.fail(res, {
							message : 'Add', 
							reason  : 'Param "year" missing'
						});
			}

			PlanService.create(req, res);
		});

	router.route(api_prefix + '/:plan_id')

		// Get one program
		.get(function (req, res) {
			PlanService.getById(req, res);
		});

	router.route(api_prefix + '/:plan_id/programs')

		// Get all programs by plan
		.get(function (req, res) {
			ProgramService.allByPlanU(req, res);
		});
};