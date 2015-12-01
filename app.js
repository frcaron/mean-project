"use strict";

// Inject
var Express  = require('express');
var Passport = require('passport');
var Path     = require('path');
var Mongoose = require('mongoose');

// =========================================================================
// Global variable =========================================================
// =========================================================================

global.__config  = Path.join(__dirname, 'config');
global.__server  = Path.join(__dirname, 'app/server');
global.__core    = Path.join(__dirname, 'app/server/core');
global.__model   = Path.join(__dirname, 'app/server/data/models');
global.__plugin  = Path.join(__dirname, 'app/server/data/plugins');
global.__dao     = Path.join(__dirname, 'app/server/data/dao');
global.__route   = Path.join(__dirname, 'app/server/routes');
global.__service = Path.join(__dirname, 'app/server/services');
global.__views   = Path.join(__dirname, 'app/server/views');
global.__assets  = Path.join(__dirname, 'app/client/assets');
global.__dist    = Path.join(__dirname, 'app/client/dist');
global.__libs    = Path.join(__dirname, 'app/client/libs');


// =========================================================================
// DataBase ================================================================
// =========================================================================

var Config = require(Path.join(global.__core, 'system')).Config;
Mongoose.connect(Config.db.url);

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
