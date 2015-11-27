"use strict";

var Path           = require('path');

// Global variable = ==========================================

global.__config    = Path.join(__dirname, 'config');
global.__server    = Path.join(__dirname, 'src/server');
global.__model     = Path.join(__dirname, 'src/server/data/models');
global.__plugin    = Path.join(__dirname, 'src/server/data/plugins');
global.__dao       = Path.join(__dirname, 'src/server/data/dao');
global.__route     = Path.join(__dirname, 'src/server/routes');
global.__service   = Path.join(__dirname, 'src/server/services');
global.__app       = Path.join(__dirname, 'src/client/app');
global.__assets    = Path.join(__dirname, 'src/client/assets');

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
var AuthConfig     = require(Path.join(global.__config, 'auth'));

// DataBase ==================================================

Mongoose.connect(DatabaseConfig.url);

// Configuration =============================================

var app = Express();

app.use('/static', Express.static(global.__assets));
// app.use(Favicon(Path.join(__dirname,'client/assets/img/favicon.ico')));
app.use(Morgan(LoggerConfig.morganLevel)); // Logger middleware
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended : true }));
app.use(BodyParser.json({ type : 'application/vnd.api+json' }));
app.use(CookieParser());

// Auth Strategies ===========================================

app.use(Session({
	secret            : AuthConfig.sessionAuth.clientSecret,
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
