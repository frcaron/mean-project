"use strict";

// Inject 
var Jwt             = require('jsonwebtoken');
var TokenConfig     = require(global.__config + '/token');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service + '/ResponseService');

module.exports = function (router) {

	// =========================================================================================
	// Param validation
	// =========================================================================================

	// Validate param plan_id
	router.param('plan_id', function (req, res, next, plan_id) {

		Logger.debug('ExpressValidation Public "plan_id" : ' + plan_id);

		if (!plan_id) {
			return ResponseService.fail(res, {
						message : 'Bad URL',
						reason  : 'Param plan id missing'
					});
		}
		return next();
	});

	// Validate param program_id
	router.param('program_id', function (req, res, next, program_id) {

		Logger.debug('ExpressValidation Public "program_id" : ' + program_id);

		if (!program_id) {
			return ResponseService.fail(res, {
						message : 'Bad URL',
						reason  : 'Param program id missing'
					});
		}
		return next();
	});

	// Validate param transaction_id
	router.param('transaction_id', function (req, res, next, transaction_id) {

		Logger.debug('ExpressValidation Public "transaction_id" : ' + transaction_id);

		if (!transaction_id) {
			return ResponseService.fail(res, {
						message : 'Bad URL',
						reason  : 'Param transaction id missing'
					});
		}
		return next();
	});

	// Validate param category_id
	router.param('category_id', function (req, res, next, category_id) {

		Logger.debug('ExpressValidation Public "category_id" : ' + category_id);

		if (!category_id) {
			return ResponseService.fail(res, {
						message : 'Bad URL',
						reason  : 'Param category id missing'
					});
		}
		return next();
	});

	// Validate param type_category_id
	router.param('type_category_id', function (req, res, next, type_category_id) {

		Logger.debug('ExpressValidation Public "type_category_id" : ' + type_category_id);

		if (!type_category_id) {
			return ResponseService.fail(res, {
						message : 'Bad URL',
						reason  : 'Param type category id missing'
					});
		}
		return next();
	});

	// =========================================================================================
	// Public
	// =========================================================================================

	require('./api/public/unlog/SessionRoute')(router);
	require('./api/public/unlog/UserRoute')(router);

	// =========================================================================================
	// Middleware
	// =========================================================================================

	// Token verification
	router.use(function (req, res, next) {

		var token = req.body.token || req.params.token ||  req.query.token || req.headers[ 'x-access-token' ];

		Logger.debug('ExpressMiddleWare Public [start] | token : ' + token);

		if (token) {
			Jwt.verify(token, TokenConfig.secret, function (err, decoded) {
				if (err) {
					return ResponseService.fail(res, { 
								message   : 'Session',
								reason    : 'Expired',
								code_http : 403
							});
				}

				// Follow token
				req.decoded = decoded;

				Logger.debug('ExpressMiddleWare Public [end] | token : ' + decoded);	

				return next();
			});
		} else {
			return ResponseService.fail(res, { 
						message   : 'Session',
						reason    : 'No authicate',
						code_http : 403
					});
		}
	});

	// =========================================================================================
	// Private
	// =========================================================================================

	require('./api/public/log/UserRoute')(router);
	require('./api/public/log/PlanRoute')(router);
	require('./api/public/log/ProgramRoute')(router);
	require('./api/public/log/TransactionRoute')(router);
	require('./api/public/log/CategoryRoute')(router);
	require('./api/public/log/TypeCategoryRoute')(router);
	require('./api/public/log/MeRoute')(router);
};