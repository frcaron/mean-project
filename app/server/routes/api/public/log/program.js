"use strict";

//Inject
var Path               = require('path');
var Exception          = require(Path.join(global.__server, 'ExceptionManager'));
var ResponseService    = require(Path.join(global.__service, 'response'));
var ProgramService     = require(Path.join(global.__service, 'program'));
var TransactionService = require(Path.join(global.__service, 'transaction'));
var Logger             = require(Path.join(global.__core, 'system')).Logger;

// Properties
var api_prefix = '/programs';

module.exports = function (router) {

	router.route(api_prefix)

		// Create one program
		.post(function (req, res, next) {

			let category_id = req.body.category_id || req.query.category_id;
			let plan_id     = req.body.plan_id || req.query.plan_id;

			Logger.debug('[WSP - VALID] ProgramRoute#post');
			Logger.debug('              -- req.query.category_id : ' + category_id);
			Logger.debug('              -- req.query.plan_id     : ' + plan_id);

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

			ProgramService.create(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:program_id')

		// Get one program
		.get(function (req, res, next) {
			ProgramService.getByIdU(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		})

		// Update one program
		.put(function (req, res, next) {
			ProgramService.update(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		})

		// Delete one program
		.delete(function (req, res, next) {
			ProgramService.remove(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res);
		});

	router.route(api_prefix + '/:program_id/transactions')

		// Get all transactions by program
		.get(function (req, res, next) {
			TransactionService.allByProgramU(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});
};