"use strict";

// Inject
var path   = require('path');
var logger = require(path.join(global.__core, 'logger'))('route', __filename);

let auth = function (req, res, next) {

	logger.debug({ method : 'auth', point : logger.pt.start });

	if (req.isAuthenticated()) {
		next();
	} else {
		res.render('index', {
			message : 'Error session'
		});
	}

	logger.debug({ method : 'auth', point : logger.pt.end });
};

module.exports = function (router) {

	// ================================================================
	//  Public ========================================================
	// ================================================================

	router.use(function (req, res) {
		res.render('index', {
			user  : req.user || null,
			title : 'Titre'
		});
	});

	// ================================================================
	//  Private =======================================================
	// ================================================================
};