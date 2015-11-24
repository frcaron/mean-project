"use strict";

//Inject
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var PlanService     = require(global.__service + '/PlanService');

// Properties
var api_prefix = '/plans';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all plans
		.get(function (req, res) {
			PlanService.allByU(req, res, req.decoded.user_id);
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

			PlanService.create(req, res, req.decoded.user_id);
		});

	router.route(api_prefix + '/:plan_id')

		// Get one program
		.get(function (req, res) {
			PlanService.getById(req, res, req.decoded.user_id);
		})

		// Delete one plan
		.delete(function (req , res) {
			PlanService.remove(req, res, req.decoded.user_id);
		});
};