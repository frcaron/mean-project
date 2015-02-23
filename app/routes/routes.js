var express = require('express');

var adminRouter = express.Router();
var apiRouter = express.Router();
var basicRouter = express.Router();

require('./route.admin')(adminRouter);
require('./route.api')(apiRouter);
require('./route.basic')(basicRouter);

module.exports = function(app) {
	app.use('/admin', adminRouter);
	app.use('/api', apiRouter);
	app.use('/', basicRouter);
};