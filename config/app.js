"use strict";

// Inject
var Express  = require('express');
var Passport = require('passport');
var Path     = require('path');
var Mongoose = require('mongoose');

// =========================================================================
// DataBase ================================================================
// =========================================================================

let Config = require(Path.join(global.__core, 'system')).Config;
Mongoose.connect(Config.db.url);

// =========================================================================
// Server ==================================================================
// =========================================================================

let app = Express();

// Express
require(Path.join(global.__config, 'express'))(app, Passport);

// Passport
require(Path.join(global.__config, 'passport'))(Passport);

// Route
require(Path.join(global.__route, 'routes'))(app, Passport);

module.exports = app;
