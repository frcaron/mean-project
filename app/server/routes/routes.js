"use strict";

// Inject
var Express         = require('express');
var Exception       = require(global.__server + '/ExceptionManager');
var ResponseService = require(global.__service + '/share/ResponseService');

var adminRouter     = Express.Router();
var publicRouter    = Express.Router();

module.exports = function (app, passport) {

	require('./route.api.admin')(adminRouter);
	require('./route.api.public')(publicRouter, passport);

	app.use('/api/admin', adminRouter);
	app.use('/api/public', publicRouter);

	// API unknow response
	app.use('/*', function(req, res) {
		ResponseService.fail(res, {
				reason : 'API unknow'
			});
	});

	// Error handling
	app.use(function(err, req, res, next) {
		if(err instanceof Exception.MetierEx) {
			ResponseService.fail(res, {
				reason : err.message
			});
		} else {
			ResponseService.fail(res);
		}
	});
};