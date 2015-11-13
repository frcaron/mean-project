"use strict";

// Inject
var Logger       = require('log');
var loggerConfig = require(global.__config + '/logger');

var logger;

module.exports = logger || new Logger(loggerConfig.level);