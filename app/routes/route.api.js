// Inject application
var jwt = require('jsonwebtoken');
var tokenConfig = require(global.__config + '/token');

// Inject service
var responseService = require(global.__service + '/ResponseService');

module.exports = function (router) {

	// =========================================================================================
	// Param validation
	// =========================================================================================

	// Validate param plan_id
	router.param('plan_id', function (req, res, next, plan_id) {
		if (!plan_id) {
			return res.json(responseService.fail('Request validation failed', 'Param "plan_id" missing'));
		}
		next();
	});

	// Validate param program_id
	router.param('program_id', function (req, res, next, program_id) {
		if (!program_id) {
			return res.json(responseService.fail('Request validation failed', 'Param "program_id" missing'));
		}
		next();
	});

	// Validate param transaction_id
	router.param('transaction_id', function (req, res, next, transaction_id) {
		if (!transaction_id) {
			return res.json(responseService.fail('Request validation failed', 'Param "transaction_id" missing'));
		}
		next();
	});

	// Validate param category_id
	router.param('category_id', function (req, res, next, category_id) {
		if (!category_id) {
			return res.json(responseService.fail('Request validation failed', 'Param "category_id" missing'));
		}
		next();
	});

	// Validate param type_category_id
	router.param('type_category_id', function (req, res, next, type_category_id) {
		if (!type_category_id) {
			return res.json(responseService.fail('Request validation failed', 'Param "type_category_id" missing'));
		}
		next();
	});

	// =========================================================================================
	// Public
	// =========================================================================================

	require('./api/session')(router);
	require('./api/user-unlog')(router);

	// =========================================================================================
	// Middleware
	// =========================================================================================

	// Token verification
	router.use(function (req, res, next) {

		var token = req.body.token || req.param('token') || req.headers[ 'x-access-token' ];

		if (token) {
			jwt.verify(token, tokenConfig.secret, function (err, decoded) {
				if (err) {
					return res.status(403).json(responseService.fail('Session error', 'Session expired'));
				}

				// Follow token
				req.decoded = decoded;

				next();
			});
		} else {
			return res.status(403).json(responseService.fail('Session error', 'No session'));
		}
	});

	// =========================================================================================
	// Private
	// =========================================================================================

	require('./api/user-log')(router);
	require('./api/plan')(router);
	require('./api/program')(router);
	require('./api/transaction')(router);
	require('./api/category')(router);
	require('./api/typecategory')(router);
	require('./api/me')(router);
};