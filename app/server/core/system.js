"use strict";

// Inject
var Path              = require('path');
var Fs                = require('fs');
var Moment            = require('moment');
var Winston           = require('winston');
var WinstonRotateFile = require('winston-daily-rotate-file');
var  _                = require('lodash');

// =========================================================================
// Config ==================================================================
// =========================================================================

// Generate conf with env
var defaultconfig = (function() {
	var configPath = Path.join(process.cwd(), 'config/env');
	var load = ~Fs.readdirSync(configPath).map(function(file) {
			return file.slice(0, -3);
	}).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

	// Extend the base configuration in all.js with environment
	// specific configuration
	return _.extend(
		require(configPath + '/all'),
		require(configPath + '/' + load) || {}
	);
})();

// =========================================================================
// Logger ==================================================================
// =========================================================================

var customLevels = {
	levels : {
		error : 0,
		warn  : 1,
		info  : 2,
		debug : 3
	},
	colors: {
		error : 'red',
		warn  : 'yellow',
		info  : 'cyan',
		debug : 'green'
	}
};

// Instance logger
var defaultLogger = new Winston.Logger({
	levels : customLevels.levels,
	colors : customLevels.colors
});

// Formatter
var formatter = function(options, timestamp) {
	return  (timestamp ? (options.timestamp() + '\t') : '') + options.level.toUpperCase() + ' ' +
		(undefined !== options.message ? options.message : '') +
		(options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
};

// Activate log console
let consoleConf = defaultconfig.logging.winston.console;
if(consoleConf.enabled) {
	defaultLogger.add(Winston.transports.Console, ({
		name      : 'console',
		level     : consoleConf.level,
		timestamp : function() {
			return Moment().format(consoleConf.timestamp.format);
		},
		formatter : function(options) {
			return formatter(options, consoleConf.timestamp.enabled);
		},
		colorize  : true
	}));
}

// Activate log file
let fileConf = defaultconfig.logging.winston.file;
if(fileConf.enabled) {

	let dirname = Path.dirname(fileConf.filename);
	let logDirectory = global.__root;
	dirname.split('/').map(function(dir) {
		logDirectory = Path.join(logDirectory, dir);

		// ensure log directory exists
		Fs.existsSync(logDirectory) || Fs.mkdirSync(logDirectory);
	});

	defaultLogger.add(WinstonRotateFile, ({
		name        : 'file',
		level       : fileConf.level,
		filename    : fileConf.filename,
  		datePattern : fileConf.date_format,
		timestamp   : function() {
			return Moment().format(fileConf.timestamp.format);
		},
		formatter   : function(options) {
			return formatter(options, fileConf.timestamp.enabled);
		}
	}));
}

module.exports = {
	Config : defaultconfig,
	Logger : defaultLogger
};