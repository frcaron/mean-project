"use strict";

// Inject
var Express      = require('express');

var adminRouter  = Express.Router();
var publicRouter = Express.Router();

module.exports = function (app, passport) {

	require('./route.api.admin')(adminRouter);
	require('./route.api.public')(publicRouter, passport);

	app.use('/api/admin', adminRouter);
	app.use('/api/public', publicRouter);
};