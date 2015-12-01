"use strict";

// Inject
var Express  = require('express');
var Passport = require('passport');
var Path     = require('path');
var Mongoose = require('mongoose');

// =========================================================================
// Global variable =========================================================
// =========================================================================

global.__package = Path.join(__dirname, 'package');
global.__config  = Path.join(__dirname, 'config');
global.__server  = Path.join(__dirname, 'app/server');
global.__model   = Path.join(__dirname, 'app/server/data/models');
global.__plugin  = Path.join(__dirname, 'app/server/data/plugins');
global.__dao     = Path.join(__dirname, 'app/server/data/dao');
global.__route   = Path.join(__dirname, 'app/server/routes');
global.__service = Path.join(__dirname, 'app/server/services');
global.__views   = Path.join(__dirname, 'app/server/views');
global.__assets  = Path.join(__dirname, 'app/client/assets');
global.__dist    = Path.join(__dirname, 'app/client/dist');


// =========================================================================
// DataBase ================================================================
// =========================================================================

var config = require(Path.join(global.__package, '/system')).loadConfig();
Mongoose.connect(config.db);

// =========================================================================
// Server ==================================================================
// =========================================================================

var app = Express();

// Express
require(Path.join(global.__config, 'express'))(app, Passport);

// Passport
require(Path.join(global.__config, 'passport'))(Passport);

// Route
require(Path.join(global.__route, 'routes'))(app, Passport);

module.exports = app;
