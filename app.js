// Set up ====================================================

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));

var app = express();

// Configuration =============================================

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json({ type : 'application/vnd.api+json' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

global.__base = __dirname + '/';
global.__config = __dirname + '/config';
global.__model = __dirname + '/app/models';
global.__plugin = __dirname + '/app/plugins';
global.__route = __dirname + '/app/routes';
global.__service = __dirname + '/app/services';

// DataBase ==================================================

var database = require(global.__config + '/database');
mongoose.connect(database.url);

// Routers ===================================================

require(global.__route + '/routes.js')(app);

module.exports = app;
