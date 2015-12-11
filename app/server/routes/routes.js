"use strict";

// Inject
var path            = require('path');
var express         = require('express');
var responseService = require(path.join(global.__service, 'response'));
var Exception       = require(path.join(global.__core, 'exception'));
var config          = require(path.join(global.__core, 'system')).Config;
var logger          = require(path.join(global.__core, 'system')).Logger;

var adminRouter     = express.Router();
var publicRouter    = express.Router();
var basicRouter     = express.Router();

module.exports = function (app, passport) {

	// ================================================================
	// API ============================================================
	// ================================================================

	require('./route.api.admin')(adminRouter);
	require('./route.api.public')(publicRouter, passport);

	app.use('/api/admin', adminRouter);
	app.use('/api/public', publicRouter);

	// API unknow response
	app.use('/api/*', function (req, res, next) {
		next(new Exception.RouteEx('API unknow - ' + req.method + ' ' + req.originalUrl));
	});

	// Error handling
	app.use('/api/*', function (err, req, res, next) {
		if(err instanceof Exception.MetierEx) {
			responseService.fail(res, {
				reason : err.message,
				detail : err.detail
			});

		} else if(err instanceof Exception.RouteEx) {
			responseService.fail(res, {
				reason    : err.message,
				detail    : err.detail,
				code_http : 403
			});

		} else {
			logger.debug('[WSG - ERROR] API#ErrorHandling');
			logger.error('              -- message : ' + err.message);

			responseService.fail(res);
		}
	});

	// ================================================================
	// Pages ==========================================================
	// ================================================================
	//
	require('./route.basic')(basicRouter);

	// Global variable layout + aggregation assets
	app.use(function (req, res, next) {
		// Global
		res.locals.appName     = config.app.name;
		res.locals.description = config.app.description;
		res.locals.keywords    = config.app.keywords;

		// Todo
		res.locals.title = 'Tite';

		// Assets
		res.locals.aggregatedassets = config.aggregatedassets;

		next();

	} // Basic routing
	//, basicRouter
	);

	// Home page or 404
	app.use(function (req, res, next) {
		if(req.path && req.path !== '/') {
			return next();
		}
		res.render('index');

	}, function (req, res) {
		res.render('404', {
			error : 'Page inexistante'
		});
	});

	// Error handling
	app.use(function (err, req, res, next) {
		logger.debug('[WSG - ERROR] PAGES#ErrorHandling');
		logger.error('              -- message : ' + err.message);

		res.render('500', {
			error : 'Erreur inconnue'
		});
	});
};