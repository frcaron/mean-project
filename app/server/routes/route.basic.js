"use strict";

// Inject
var Path   = require('path');
var Logger = require(Path.join(global.__server, 'LoggerManager'));

module.exports = function (router) {

	// =========================================================================================
	// Public
	// =========================================================================================

	// =========================================================================================
	// Middleware
	// =========================================================================================

	router.use(function (req, res, next) {

		Logger.debug('[WSB - START] MiddleWare');

		if (req.isAuthenticated()) {
			next();
		} else {
			res.render('index');
		}

		Logger.debug('[WSB -   END] MiddleWare');
	});

	// =========================================================================================
	// Private
	// =========================================================================================

};