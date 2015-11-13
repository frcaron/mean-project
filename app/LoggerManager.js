"use strict";

// Inject
var Logger       = require('log');
var loggerConfig = require(global.__config + '/logger');

module.exports = new Logger(loggerConfig.level);