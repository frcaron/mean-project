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
global.__src       = Path.join(__dirname, 'app/client/src');
global.__assets    = Path.join(__dirname, 'app/client/assets');
global.__views     = Path.join(__dirname, 'app/client/views');

// Inject ====================================================

var Fs             = require('fs');
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

// Configuration global ======================================

var app = Express();

app.use('/static', Express.static(global.__assets));
// app.use(Favicon(Path.join(__dirname,'client/assets/img/favicon.ico')));
app.use(Morgan(LoggerConfig.morganLevel));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended : true }));
app.use(BodyParser.json({ type : 'application/vnd.api+json' }));
app.use(CookieParser());

// Template engine html ========================================

app.engine('html', function (filePath, options, callback) {
  Fs.readFile(filePath, function (err, content) {
    if (err) {
    	return callback(new Error(err));
    }
    var rendered = content.toString();
    return callback(null, rendered);
  });
});
app.set('views', [ global.__views ]);
app.set('view engine', 'html');

// Auth Strategies ==============================================

app.use(Session({
	secret            : AuthConfig.sessionAuth.clientSecret,
	resave            : true,
	saveUninitialized : true
}));
app.use(Passport.initialize());
app.use(Passport.session());
app.use(Flash());

require(Path.join(global.__config, 'passport'))(Passport);

// Routers ======================================================

require(Path.join(global.__route, 'routes.js'))(app, Passport);

module.exports = app;
