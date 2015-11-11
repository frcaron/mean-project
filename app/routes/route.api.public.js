// Inject 
var Jwt             = require('jsonwebtoken');
var TokenConfig     = require(global.__config + '/token');
var ResponseService = require(global.__service + '/ResponseService');

module.exports = function (router) {

	// =========================================================================================
	// Param validation
	// =========================================================================================

	// Validate param plan_id
	router.param('plan_id', function (req, res, next, plan_id) {
		if (!plan_id) {
			return ResponseService.fail(res, 'Request validation failed', 'Param "plan_id" missing');
		}
		next();
	});

	// Validate param program_id
	router.param('program_id', function (req, res, next, program_id) {
		if (!program_id) {
			return ResponseService.fail(res, 'Request validation failed', 'Param "program_id" missing');
		}
		next();
	});

	// Validate param transaction_id
	router.param('transaction_id', function (req, res, next, transaction_id) {
		if (!transaction_id) {
			return ResponseService.fail(res, 'Request validation failed', 'Param "transaction_id" missing');
		}
		next();
	});

	// Validate param category_id
	router.param('category_id', function (req, res, next, category_id) {
		if (!category_id) {
			return ResponseService.fail(res, 'Request validation failed', 'Param "category_id" missing');
		}
		next();
	});

	// Validate param type_category_id
	router.param('type_category_id', function (req, res, next, type_category_id) {
		if (!type_category_id) {
			return ResponseService.fail(res, 'Request validation failed', 'Param "type_category_id" missing');
		}
		next();
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

		var token = req.body.token || req.params.token || req.headers[ 'x-access-token' ];

		if (token) {
			Jwt.verify(token, TokenConfig.secret, function (err, decoded) {
				if (err) {
					return ResponseService.fail(res, 'Session error', 'Session expired', 403);
				}

				// Follow token
				req.decoded = decoded;

				next();
			});
		} else {
			return ResponseService.fail(res, 'Session error', 'No session', 403);
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