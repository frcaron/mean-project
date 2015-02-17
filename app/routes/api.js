var express = require('express');

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