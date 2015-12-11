"use strict";

// Inject
var path   = require('path');
var logger = require(path.join(global.__core, 'system')).Logger;

let auth = function (req, res, next) {

	logger.debug('[WSB - MIDDL] route.basic#secure');

	if (req.isAuthenticated()) {
		next();
	} else {
		res.render('index', {
			message : 'Error session'
		});
	}
};

module.exports = function (router) {

	// ================================================================
	//  Public ========================================================
	// ================================================================

	// ================================================================
	//  Private =======================================================
	// ================================================================
};