"use strict";

// Inject
var Express      = require('express');

var basicRouter  = Express.Router();

require('./route.basic')(basicRouter);

module.exports = function (app) {
	app.use('/', basicRouter);
};