"use strict";

var Path           = require('path');

// Global variable = ==========================================

global.__config    = Path.join(__dirname, 'config');
global.__server    = Path.join(__dirname, 'app/server');
global.__model     = Path.join(__dirname, 'app/server/data/models');
global.__plugin    = Path.join(__dirname, 'app/server/data/plugins');
global.__dao       = Path.join(__dirname, 'app/server/data/dao');
global.__route     = Path.join(__dirname, 'app/server/routes');
global.__service   = Path.join(__dirname, 'app/server/services');
global.__client    = Path.join(__dirname, 'client');

// Set up ====================================================

var BodyParser     = require('body-parser');
var BPromise       = require('bluebird');
var CookieParser   = require('cookie-parser');
var Express        = require('express');
var Favicon        = require('serve-favicon');
var Flash          = require('connect-flash');
var Morgan         = require('morgan');
var Passport       = require('passport');
var Session        = require('express-session');
var Mongoose       = BPromise.promisifyAll(require('mongoose'));
var DatabaseConfig = require(Path.join(global.__config, 'database'));
var LoggerConfig   = require(Path.join(global.__config, 'logger'));
var SecretConfig   = require(Path.join(global.__config, 'secret'));

// DataBase ==================================================

Mongoose.connect(DatabaseConfig.url);

// Configuration =============================================

var app = Express();

// app.use(Favicon(Path.join(__dirname,'client/assets/img/favicon.ico')));
app.use(Morgan(LoggerConfig.morganLevel)); // Logger middleware
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended : true }));
app.use(BodyParser.json({ type : 'application/vnd.api+json' }));
app.use(CookieParser());
// app.use(Express.static(Path.join(__dirname, 'app/client/views')));

// Auth Strategies ===========================================

app.use(Session({
	secret            : SecretConfig.secret,
	resave            : true,
	saveUninitialized : true
}));
app.use(Passport.initialize());
app.use(Passport.session());
app.use(Flash());

require(Path.join(global.__config, 'passport'))(Passport);

// Routers ===================================================

require(Path.join(global.__route, 'routes.js'))(app, Passport);

module.exports = app;
