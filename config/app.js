"use strict";

// Inject
var express  = require('express');
var passport = require('passport');
var path     = require('path');
var mongoose = require('mongoose');

// =========================================================================
// DataBase ================================================================
// =========================================================================

let Config = require(path.join(global.__core, 'system')).Config;
mongoose.connect(Config.db.url);

// =========================================================================
// Server ==================================================================
// =========================================================================

let app = express();

// express
require(path.join(global.__config, 'express'))(app, passport);

// Passport
require(path.join(global.__config, 'passport'))(passport);

// Route
require(path.join(global.__route, 'routes'))(app, passport);

module.exports = app;
