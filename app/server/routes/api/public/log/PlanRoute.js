"use strict";

//Inject
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var PlanService     = require(global.__service + '/PlanService');
var ProgramService  = require(global.__service + '/ProgramService');

// Properties
var api_prefix = '/plans';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all plans
		.get(function (req, res) {
			PlanService.allByU(req, res, req.user.id);
		})

		// Create one plan
		.post(function (req, res) {

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
				return ResponseService.fail(res, {
					reason : 'Param missing',
					detail : msg
				});
			}

			PlanService.create(req, res, req.user.id);
		});

	router.route(api_prefix + '/:plan_id')

		// Get one program
		.get(function (req, res) {
			PlanService.getById(req, res, req.user.id);
		})

		// Delete one plan
		.delete(function (req , res) {
			PlanService.remove(req, res, req.user.id);
		});

	router.route(api_prefix + '/:plan_id/programs')

		// Get all programs
		.get(function (req, res) {

			let plan_id          = req.body.plan_id || req.query.plan_id;
			let type_category_id = req.body.type_category_id || req.query.type_category_id;

			Logger.debug('[WSP - VALID] PlanRoute#get');
			Logger.debug('              -- plan_id          : ' + plan_id);
			Logger.debug('              -- type_category_id : ' + type_category_id);

			// Validation
			if(!type_category_id) {
				return ResponseService.fail(res, {
					reason : 'Param missing',
					detail : [ 'type_category_id' ]
				});
			}

			ProgramService.allByPlanTypeU(req, res, req.user.id);
		});
};