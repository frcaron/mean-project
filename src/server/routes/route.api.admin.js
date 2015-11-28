"use strict";

// Inject
var Path            = require('path');
var Logger          = require(Path.join(global.__server, 'LoggerManager'));
var ResponseService = require(Path.join(global.__service, 'ResponseService'));

module.exports = function (router) {

	// =========================================================================================
	// Param validation
	// =========================================================================================

	// Validate param user_id
	router.param('user_id', function (req, res, next, user_id) {

		Logger.debug('[WSA - VALID] "user_id" : ' + user_id);

		if (!user_id) {
			return ResponseService.fail(res, {
				reason : 'Param missing',
				detail : [ 'user_id' ]
			});
		}
		next();
	});

	// Validate param type_category_id
	router.param('type_category_id', function (req, res, next, type_category_id) {

		Logger.debug('[WSA - VALID] "type_category_id" : ' + type_category_id);

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

	require('./api/admin/unlog/TypeCategoryRoute')(router);

	// =========================================================================================
	// Middleware
	// =========================================================================================

	router.use(function (req, res, next) {

		Logger.debug('[WSA - START] MiddleWare');

		if (req.isAuthenticated()) {
			// Admin access
			if (!req.user.admin) {
				ResponseService.fail(res, {
					reason    : 'Permission refused',
					code_http : 403
				});
			} else {
				next();
			}
		} else {
			ResponseService.fail(res, {
				reason    : 'No session',
				code_http : 403
			});
		}

		Logger.debug('[WSA -   END] MiddleWare');
	});

	// =========================================================================================
	// Private
	// =========================================================================================

	require('./api/admin/log/TypeCategoryRoute')(router);
	require('./api/admin/log/UserRoute')(router);
};