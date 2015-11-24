var Path           = require('path');

// Global variable = ==========================================

global.__config    = Path.join(__dirname, '/config');
global.__server    = Path.join(__dirname, '/app/server');
global.__model     = Path.join(__dirname, '/app/server/data/models');
global.__plugin    = Path.join(__dirname, '/app/server/data/plugins');
global.__dao       = Path.join(__dirname, '/app/server/data/dao');
global.__route     = Path.join(__dirname, '/app/server/routes');
global.__service   = Path.join(__dirname, '/app/server/services');
global.__client    = Path.join(__dirname, '/client');

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
var DatabaseConfig = require(Path.join(global.__config, '/database'));
var PassportConfig = require(Path.join(global.__config, '/passport'));
var SecretConfig   = require(Path.join(global.__config, '/token'));

// DataBase ==================================================

Mongoose.connect(process.env.BDD_URL || DatabaseConfig.url);

// Configuration =============================================

var app = Express();

// app.use(Favicon(Path.join(__dirname,'/public/favicon.ico')));
app.use(Morgan('dev'));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended : true }));
app.use(BodyParser.json({ type : 'application/vnd.api+json' }));
app.use(CookieParser());
app.use(Express.static(Path.join(__dirname, 'public')));

app.use(Session({
	secret            : process.env.SECRET || SecretConfig.secret,
	resave            : true,
	saveUninitialized : true
}));
app.use(Passport.initialize());
app.use(Passport.session());
app.use(Flash());

// Routers ===================================================

require(global.__route + '/routes.js')(app, PassportConfig);

module.exports = app;
