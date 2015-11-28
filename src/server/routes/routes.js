"use strict";

// Inject
var Path            = require('path');
var Express         = require('express');
var Exception       = require(Path.join(global.__server, 'ExceptionManager'));
var Logger          = require(Path.join(global.__server, 'LoggerManager'));
var ResponseService = require(Path.join(global.__service, 'ResponseService'));

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
	app.use('/api/*', function(req, res) {
		ResponseService.fail(res, {
				reason : 'API unknow - ' + req.method + ' ' + req.originalUrl
			});
	});

	// Error handling
	app.use(function(err, req, res, next) {
		if(err instanceof Exception.MetierEx) {
			ResponseService.fail(res, {
				reason : err.message,
				detail : err.detail
			});
		} else {
			Logger.debug('[MID - ERROR] API#ErrorHandling');
			Logger.error('              -- message : ' + err.message);

			ResponseService.fail(res);
		}
	});

	// ================================================================
	// PAGES ==========================================================
	// ================================================================

	app.use('/', basicRouter);

	// API unknow response
	app.use('/*', function(req, res) {
		res.render('index');
	});

	// Error handling
	app.use(function(err, req, res, next) {
		Logger.debug('[MID - ERROR] PAGES#ErrorHandling');
		Logger.error('              -- message : ' + err.message);

		res.render('error');
	});
};