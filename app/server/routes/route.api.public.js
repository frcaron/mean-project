"use strict";

// Inject
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');

module.exports = function (router, passport) {

	// =========================================================================================
	// Param validation
	// =========================================================================================

	// Validate param plan_id
	router.param('plan_id', function (req, res, next, plan_id) {

		Logger.debug('[WSP - VALID] "plan_id" : ' + plan_id);

		if (!plan_id) {
			return ResponseService.fail(res, {
				reason : 'Param missing',
				detail : [ 'plan_id' ]
			});
		}
		next();
	});

	// Validate param program_id
	router.param('program_id', function (req, res, next, program_id) {

		Logger.debug('[WSP - VALID] "program_id" : ' + program_id);

		if (!program_id) {
			return ResponseService.fail(res, {
				reason : 'Param missing',
				detail : [ 'program_id' ]
			});
		}
		next();
	});

	// Validate param transaction_id
	router.param('transaction_id', function (req, res, next, transaction_id) {

		Logger.debug('[WSP - VALID] "transaction_id" : ' + transaction_id);

		if (!transaction_id) {
			return ResponseService.fail(res, {
				reason : 'Param missing',
				detail : [ 'transaction_id' ]
			});
		}
		next();
	});

	// Validate param category_id
	router.param('category_id', function (req, res, next, category_id) {

		Logger.debug('[WSP - VALID] "category_id" : ' + category_id);

		if (!category_id) {
			return ResponseService.fail(res, {
				reason : 'Param missing',
				detail : [ 'category_id' ]
			});
		}
		next();
	});

	// Validate param type_category_id
	router.param('type_category_id', function (req, res, next, type_category_id) {

		Logger.debug('[WSP - VALID] "type_category_id" : ' + type_category_id);

		if (!type_category_id) {
			return ResponseService.fail(res, {
				reason : 'Param missing',
				detail : [ 'type_category_id' ]
			});
		}
		next();
	});

	// =========================================================================================
	// Public
	// =========================================================================================

	require('./api/public/unlog/SessionRoute')(router, passport);

	// =========================================================================================
	// Middleware
	// =========================================================================================

	// Token verification
	router.use(function (req, res, next) {

		Logger.debug('[WSP - START] MiddleWare');

		if (req.isAuthenticated()) {
			next();
		} else {
			ResponseService.fail(res, {
				reason    : 'No session',
				code_http : 403
			});
		}

		Logger.debug('[WSP -   END] MiddleWare');
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
	require('./api/public/log/SessionRoute')(router, passport);
};