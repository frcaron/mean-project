"use strict";

// Inject
var Jwt             = require('jsonwebtoken');
var TokenConfig     = require(global.__config + '/token');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_share + '/ResponseService');

module.exports = function (router) {

	// =========================================================================================
	// Param validation
	// =========================================================================================

	// Validate param user_id
	router.param('user_id', function (req, res, next, user_id) {

		Logger.debug('[WSA - VALID] "user_id" : ' + user_id);

		if (!user_id) {
			return ResponseService.fail(res, {
						message : 'Bad URL',
						reason  : 'Param user id missing'
					});
		}
		return next();
	});

	// Validate param type_category_id
	router.param('type_category_id', function (req, res, next, type_category_id) {

		Logger.debug('[WSA - VALID] "type_category_id" : ' + type_category_id);

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

	require('./api/admin/unlog/TypeCategoryRoute')(router);

	// =========================================================================================
	// Middleware
	// =========================================================================================

	// Token verification
	router.use(function (req, res, next) {

		let token = req.body.token || req.params.token || req.query.token || req.headers[ 'x-access-token' ];

		Logger.debug('[WSA - START] MiddleWare');
		Logger.debug('              -- token : ' + token);

		if (token) {
			Jwt.verify(token, TokenConfig.secret, function (err, decoded) {
				if (err) {
					return ResponseService.fail(res, { 
								message   : 'Session',
								reason    : 'Expired',
								code_http : 403
							});
				}

				// Admin access
				if (!decoded.admin) {
					return ResponseService.fail(res, { 
								message   : 'Session',
								reason    : 'Permission refused',
								code_http : 403
							});
				}

				// Follow token
				req.decoded = decoded;

				Logger.debug('[WSA -   END] MiddleWare');	
				Logger.debug('              -- token : ' + JSON.stringify(decoded));

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

	require('./api/admin/log/TypeCategoryRoute')(router);
	require('./api/admin/log/UserRoute')(router);
};