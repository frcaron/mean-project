// Inject 
var express  = require('express');

var adminRouter = express.Router();
var publicRouter   = express.Router();
var basicRouter = express.Router();

require('./route.api.admin')(adminRouter);
require('./route.api.public')(publicRouter);
require('./route.basic')(basicRouter);

module.exports = function (app) {
	app.use('/api/admin', adminRouter);
	app.use('/api/public', publicRouter);
	app.use('/', basicRouter);
};