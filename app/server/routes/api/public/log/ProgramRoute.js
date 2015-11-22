"use strict";

//Inject
var Logger             = require(global.__server + '/LoggerManager');
var ResponseService    = require(global.__service + '/share/ResponseService');
var ProgramService     = require(global.__service + '/ProgramService');
var TransactionService = require(global.__service + '/TransactionService');

// Properties
var api_prefix = '/programs';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all programs
		.get(function (req, res) {

			let plan_id          = req.body.plan_id || req.query.plan_id;
			let type_category_id = req.body.type_category_id || req.query.type_category_id;

			Logger.debug('[WSP - VALID] PlanRoute#get');
			Logger.debug('              -- plan_id          : ' + plan_id);
			Logger.debug('              -- type_category_id : ' + type_category_id);

			// Validation
			var msg = [];
			if (!plan_id) {
				msg.push('plan_id');
			}
			if (!type_category_id) {
				msg.push('type_category_id');
			}
			if(msg.length) {
				return ResponseService.fail(res, {
					message : 'Get programs by plan and type category',
					reason  : 'Param missing : ' + msg.toString()
				});
			}

			ProgramService.allByPlanTypeU(req, res);
		})

		// Create one program
		.post(function (req, res) {

			let category_id = req.body.category_id || req.query.category_id;
			let plan_id     = req.body.plan_id || req.query.plan_id;

			Logger.debug('[WSP - VALID] ProgramRoute#post');
			Logger.debug('              -- req.query.category_id 	: ' + category_id);
			Logger.debug('              -- req.query.plan_id 		: ' + plan_id);

			// Validation
			var msg = [];
			if (!plan_id) {
				msg.push('plan_id');
			}
			if (!category_id) {
				msg.push('category_id');
			}
			if(msg.length) {
				return ResponseService.fail(res, {
					message : 'Add',
					reason  : 'Param missing : ' + msg.toString()
				});
			}

			ProgramService.create(req, res);
		});

	router.route(api_prefix + '/:program_id')

		// Get one program
		.get(function (req, res) {
			ProgramService.getByIdU(req, res);
		})

		// Update one program
		.put(function (req, res) {
			ProgramService.update(req, res);
		})

		// Delete one program
		.delete(function (req, res) {
			ProgramService.remove(req, res);
		});

	router.route(api_prefix + '/:program_id/transactions')

		// Get all transactions by program
		.get(function (req, res) {
			TransactionService.allByProgramU(req, res);
		});
};