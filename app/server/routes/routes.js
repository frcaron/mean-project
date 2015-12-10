"use strict";

// Inject
var Path            = require('path');
var Express         = require('express');
var ResponseService = require(Path.join(global.__service, 'response'));
var Config          = require(Path.join(global.__core, 'system')).Config;
var Exception       = require(Path.join(global.__core, 'exception'));
var Logger          = require(Path.join(global.__core, 'system')).Logger;

var adminRouter     = Express.Router();
var publicRouter    = Express.Router();
var basicRouter     = Express.Router();

module.exports = function (app, passport) {

	require('./route.api.admin')(adminRouter);
	require('./route.api.public')(publicRouter, passport);
	require('./route.basic')(basicRouter);

	// ================================================================
	// API ============================================================
	// ================================================================

	app.use('/api/admin', adminRouter);
	app.use('/api/public', publicRouter);

	// API unknow response
	app.use('/api/*', function(req, res, next) {
		next(new Exception.RouteEx('API unknow - ' + req.method + ' ' + req.originalUrl));
	});

	// Error handling
	app.use(function(err, req, res, next) {
		if(err instanceof Exception.MetierEx) {
			ResponseService.fail(res, {
				reason : err.message,
				detail : err.detail
			});

		} else if(err instanceof Exception.RouteEx) {
			ResponseService.fail(res, {
				reason    : err.message,
				detail    : err.detail,
				code_http : 403
			});

		} else {
			Logger.debug('[WSG - ERROR] API#ErrorHandling');
			Logger.error('              -- message : ' + err.message);

			ResponseService.fail(res);
		}
	});

	// ================================================================
	// PAGES ==========================================================
	// ================================================================

	// Aggregation
	app.use('/', function(req, res, next) {
		// Global
		res.locals.appName          = Config.app.name;
		res.locals.description      = Config.app.description;
		res.locals.keywords         = Config.app.keywords;

		// Assets
		res.locals.aggregatedassets = Config.aggregatedassets;

		next();
	}, basicRouter);

	// API unknow response
	app.use('/*', function(req, res) {
		res.render('index');
	});

	// Error handling
	app.use(function(err, req, res, next) {
		Logger.debug('[WSG - ERROR] PAGES#ErrorHandling');
		Logger.error('              -- message : ' + err.message);

		res.render('500');
	});
};