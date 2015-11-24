// Set up ====================================================

var Express      = require('express');
var Path         = require('path');
// var Favicon      = require('serve-favicon');
var Morgan       = require('morgan');
var CookieParser = require('cookie-parser');
var BodyParser   = require('body-parser');
var BPromise     = require('bluebird');
var Mongoose     = BPromise.promisifyAll(require('mongoose'));

var app = Express();

// Configuration =============================================

// app.use(Favicon(__dirname + '/public/favicon.ico'));
app.use(Morgan('dev'));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended : true }));
app.use(BodyParser.json({ type : 'application/vnd.api+json' }));
app.use(CookieParser());
app.use(Express.static(Path.join(__dirname, 'public')));

// Global variable ===========================================

global.__base    = __dirname + '/';
global.__app     = __dirname + '/app';
global.__config  = __dirname + '/config';
global.__server  = __dirname + '/app/server';
global.__model   = __dirname + '/app/server/data/models';
global.__plugin  = __dirname + '/app/server/data/plugins';
global.__dao     = __dirname + '/app/server/data/dao';
global.__route   = __dirname + '/app/server/routes';
global.__service = __dirname + '/app/server/services';
global.__client  = __dirname + '/client';

// DataBase ==================================================

var database = require(global.__config + '/database');
Mongoose.connect(database.url);

// Routers ===================================================

require(global.__route + '/routes.js')(app);

module.exports = app;
