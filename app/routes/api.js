var express = require('express');

var UserModel = require('../models/UserModel');

var apiRouter = express.Router();

	// ============================
	// Middleware =================
	// ============================

	apiRouter.use(function(req, res, next) {
		next();
	});

	require('./apiRouters/UserRouter')(apiRouter);

module.exports = function(app) {
	app.use('/api', apiRouter);
};