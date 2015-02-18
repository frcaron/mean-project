
// Set up ====================================================

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

// Configuration =============================================

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// DataBase ==================================================

var database = require('./config/database');
mongoose.connect(database.url);

// Routers ===================================================

require('./app/routes/routes.js')(app);

module.exports = app;
