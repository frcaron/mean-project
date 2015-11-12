"use strict";

// Inject
var Jwt             = require('jsonwebtoken');
var TokenConfig     = require(global.__config + '/token');
var ResponseService = require(global.__service + '/ResponseService');

module.exports = function (router) {

	// =========================================================================================
	// Param validation
	// =========================================================================================

	// Validate param user_id
	router.param('user_id', function (req, res, next, user_id) {
		if (!user_id) {
			return ResponseService.fail(res, 'Request validation failed', 'Param "user_id" missing');
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

	require('./api/admin/unlog/TypeCategoryRoute')(router);

	// =========================================================================================
	// Middleware
	// =========================================================================================

	// Token verification
	router.use(function (req, res, next) {

		var token = req.body.token || req.params.token || req.query.token || req.headers[ 'x-access-token' ];

		if (token) {
			Jwt.verify(token, TokenConfig.secret, function (err, decoded) {
				if (err) {
					return ResponseService.fail(res, 'Session error', 'Session expired', 403);
				}

				// Admin access
				if (!decoded.admin) {
					return ResponseService.fail(res, 'Session error', 'Permission refused', 403);
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

	require('./api/admin/log/TypeCategoryRoute')(router);
	require('./api/admin/log/UserRoute')(router);
};