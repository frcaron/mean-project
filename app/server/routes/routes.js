"use strict";

// Inject
var path            = require('path');
var express         = require('express');
var responseService = require(path.join(global.__service, 'response'));
var Exception       = require(path.join(global.__core, 'exception'));
var config          = require(path.join(global.__core, 'system')).Config;
var logger          = require(path.join(global.__core, 'logger'))('route', __filename);

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
			logger.debug(err.message, { method : 'handlingWS', point : logger.pt.err });

			responseService.fail(res, {
				reason : err.message,
				detail : err.detail
			});

		} else if(err instanceof Exception.RouteEx) {
			logger.debug(err.message, { method : 'handlingWS', point : logger.pt.err });

			responseService.fail(res, {
				reason    : err.message,
				detail    : err.detail,
				code_http : 403
			});

		} else {
			logger.error(err.message, { method : 'handlingWS', point : logger.pt.err, params : { stack : err } });

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

		// Assets
		res.locals.aggregatedassets = config.aggregatedassets;

		next();

	}, basicRouter);

	// Error handling
	app.use(function (err, req, res, next) {
		logger.error(err.message, { method : 'handlingPages', point : logger.pt.err, params : { stack : err } });

		res.status(500).render('500', {
			error : err.message
		});
	});
};