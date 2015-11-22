"use strict";

// Inject
var Express      = require('express');

var adminRouter  = Express.Router();
var publicRouter = Express.Router();

require('./route.api.admin')(adminRouter);
require('./route.api.public')(publicRouter);

module.exports = function (app) {
	app.use('/api/admin', adminRouter);
	app.use('/api/public', publicRouter);
};