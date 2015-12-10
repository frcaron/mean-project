"use strict";

// Inject
var Path   = require('path');
var Logger = require(Path.join(global.__core, 'system')).Logger;
var Config = require(Path.join(global.__core, 'system')).Config;

module.exports = function (router) {

	// =========================================================================================
	// Public
	// =========================================================================================

	// =========================================================================================
	// Middleware
	// =========================================================================================

	router.use(function (req, res, next) {

		Logger.debug('[WSB - MIDDL] route.basic#secure');

		if (req.isAuthenticated()) {
			next();
		} else {
			res.render('index');
		}
	});

	// =========================================================================================
	// Private
	// =========================================================================================

};