"use strict";

// Inject
var path              = require('path');
var fs                = require('fs');
var moment            = require('moment');
var winston           = require('winston');
var winstonRotateFile = require('winston-daily-rotate-file');
var util              = require('util');
var  _                = require('lodash');

// =========================================================================
// Config ==================================================================
// =========================================================================

// Generate conf with env
let defaultconfig = (function() {

	// Config app
	let configPath = path.join(process.cwd(), 'config/env');
	let load = ~fs.readdirSync(configPath).map(function(file) {
			return file.slice(0, -3);
	}).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

	// Assets env
	let dist = require(path.join(process.cwd(), 'config/assets')).dist || {};
	let aggregatedassets = { js : [], css : [] };
	_.mapKeys(dist.output[process.env.NODE_ENV], function (value) {
		if(_.endsWith(value, '.js')) {
			aggregatedassets.js.push(path.join('dist/js', value));
		} else if(_.endsWith(value, '.css')) {
			aggregatedassets.css.push(path.join('dist/css', value));
		}
	});

	// Assets all
	_.mapKeys(dist.output.all, function (value) {
		if(util.isArray(value)) {
			value.map(function (v) {
				if(_.endsWith(v, '.js')) {
					aggregatedassets.js.push(path.join(v));
				} else if(_.endsWith(v, '.css')) {
					aggregatedassets.css.push(path.join(v));
				}
			});
		} else {
			if(_.endsWith(value, '.js')) {
				aggregatedassets.js.push(path.join('dist/js', value));
			} else if(_.endsWith(value, '.css')) {
				aggregatedassets.css.push(path.join('dist/css', value));
			}
		}
	});

	// Extend the base configuration i nall.js with specific environnment
	return _.extend(
		require(configPath + '/all'),
		require(configPath + '/' + load) || {},
		{ 'aggregatedassets' : aggregatedassets }
	);
})();

// =========================================================================
// Logger ==================================================================
// =========================================================================

let customLevels = {
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
let defaultLogger = new winston.Logger({
	levels : customLevels.levels,
	colors : customLevels.colors
});

// Formatter
let formatter = function(options, timestamp) {
	return  (timestamp ? (options.timestamp() + '\t') : '') + options.level.toUpperCase() + ' ' +
		(undefined !== options.message ? options.message : '') +
		(options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
};

// Activate log console
let consoleConf = defaultconfig.logging.winston.console;
if(consoleConf.enabled) {
	defaultLogger.add(winston.transports.Console, ({
		name      : 'console',
		level     : consoleConf.level,
		timestamp : function() {
			return moment().format(consoleConf.timestamp.format);
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

	let dirname = path.dirname(fileConf.filename);
	let logDirectory = global.__root;
	dirname.split('/').map(function(dir) {
		logDirectory = path.join(logDirectory, dir);

		// ensure log directory exists
		fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
	});

	defaultLogger.add(winstonRotateFile, ({
		name        : 'file',
		level       : fileConf.level,
		filename    : fileConf.filename,
  		datePattern : fileConf.date_format,
		timestamp   : function() {
			return moment().format(fileConf.timestamp.format);
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