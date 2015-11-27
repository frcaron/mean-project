"use strict";

// Inject
var Logger          = require(global.__server  + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');

module.exports = function (router) {

	// =========================================================================================
	// Public
	// =========================================================================================

	// =========================================================================================
	// Middleware
	// =========================================================================================

	// Token verification
	router.use(function (req, res, next) {

		Logger.debug('[WSB - START] MiddleWare');

		if (req.isAuthenticated()) {
			next();
		} else {
			ResponseService.fail(res, {
				reason    : 'No session',
				code_http : 403
			});
		}

		Logger.debug('[WSB -   END] MiddleWare');
	});

	// =========================================================================================
	// Private
	// =========================================================================================

};