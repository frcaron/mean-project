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
					reason : 'Param missing',
					detail : msg
				});
			}

			ProgramService.create(req, res, req.decoded.user_id);
		});

	router.route(api_prefix + '/:program_id')

		// Get one program
		.get(function (req, res) {
			ProgramService.getByIdU(req, res, req.decoded.user_id);
		})

		// Update one program
		.put(function (req, res) {
			ProgramService.update(req, res, req.decoded.user_id);
		})

		// Delete one program
		.delete(function (req, res) {
			ProgramService.remove(req, res, req.decoded.user_id);
		});

	router.route(api_prefix + '/:program_id/transactions')

		// Get all transactions by program
		.get(function (req, res) {
			TransactionService.allByProgramU(req, res, req.decoded.user_id);
		});
};