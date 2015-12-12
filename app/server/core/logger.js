"use strict";

var path      = require('path');
var fs        = require('fs');
var moment    = require('moment');
var _         = require('lodash');
var util      = require('util');
var winston   = require('winston');
var winstonRF = require('winston-daily-rotate-file');
var config    = require(path.join(global.__core, 'system')).Config;

let logging = {
	point : {
		'err'   : 'error',
		'valid' : 'valid',
		'start' : 'start',
		'end'   : 'end',
		'in'    : 'in'
	},
	colors : {
		// Tier
		'model'   : 'brown',
		'dao'     : 'blue',
		'service' : 'green',
		'route'   : 'red',
		'session' : 'orange',

		// Other
		'param'   : 'cyan',
		'time'    : 'grey'
	}
};

// =========================================================================
// Logger ==================================================================
// =========================================================================

// Add colors custom
winston.config.addColors(logging.colors);

// Instance logger
let defaultLogger = new winston.Logger();

// Formatter
let formatter = function(options, timestamp) {
	let output = '';

	if(timestamp) {
		output += '[' + winston.config.colorize('time', options.timestamp()) + '] ';
	}

	if(options.meta && Object.keys(options.meta).length) {

		let meta = '';
		meta += '[';
		meta += options.meta.tier;
		meta += ':';
		meta += options.meta.point;
		meta += '] ';

		output += winston.config.colorize(options.meta.tier, meta);

		output += options.meta.clazz;
		if(options.meta.method) {
			output += winston.config.colorize(options.meta.tier, '#');
			output += options.meta.method;
		}

		if(options.message) {
			output += '\n';
			if(timestamp) {
				output += '[' + winston.config.colorize('time', options.timestamp()) + '] ';
			}
			output += winston.config.colorize(options.meta.tier, '\t\t** ');
			output += options.message;
		}

		if(options.meta.params) {
			_.forEach(options.meta.params, function (n, key) {
				output += '\n';
				if(timestamp) {
					output += '[' + winston.config.colorize('time', options.timestamp()) + '] ';
				}
				output += winston.config.colorize(options.meta.tier, '\t\t-- ');
				output += '\'';
				output += winston.config.colorize('param', key);
				output += '\' ';
				if(util.isArray(n)) {
					output += n.toString();
				} else if(util.isObject(n)) {
					output += JSON.stringify(n);
				} else {
					output += n;
				}
			});
		}
	}
	return output;
};

// Activate log console
let consoleConf = config.logging.winston.console;
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
		colorize: true
	}));
}

// Activate log file
let fileConf = config.logging.winston.file;
if(fileConf.enabled) {

	let dirname = path.dirname(fileConf.filename);
	let logDirectory = global.__root;
	dirname.split('/').map(function(dir) {
		logDirectory = path.join(logDirectory, dir);

		// ensure log directory exists
		fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
	});

	defaultLogger.add(winstonRF, ({
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

// Verify meta value
function checkMeta(meta) {
	if(!meta || !Object.keys(meta).length) {
		throw new Error('Meta incorrect');
	}
	if(!meta.point){
		throw new Error('Param meta "point" required');
	}
	if(!_.some(logging.point, chr => chr === meta.point)) {
		throw new Error('Param "point" incorrect : ' + meta.point);
	}
	if(meta.params && !Object.keys(meta.params).length) {
		throw new Error('Param meta "params" incorrect');
	}
}

// Logger constructor
var Logger = function (tier, clazz) {
	if(!tier || !clazz) {
		throw new Error('Param "tier" and "clazz" required');
	}
	if(!_.some(['model', 'dao', 'service', 'route', 'session'], chr => chr === tier)) {
		throw new Error('Param "tier" incorrect : ' + tier);
	}
	this.tier = tier;
	this.clazz = path.basename(clazz);
};

// Log with given level
Logger.prototype.log = function(lvl, msg, meta) {
	if(!meta) {
		meta = msg;
		msg  = '';
	}
	checkMeta(meta);
	defaultLogger.log(lvl, msg, _.extend(meta, { tier : this.tier, clazz : this.clazz}));
};

// Info level
Logger.prototype.info = function(msg, meta) {
	this.log('info', msg, meta);
};

// Debug level
Logger.prototype.debug = function(msg, meta) {
	this.log('debug', msg, meta);
};

// Warn level
Logger.prototype.warn = function(msg, meta) {
	this.log('warn', msg, meta);
};

// Error level
Logger.prototype.error = function(msg, meta) {
	this.log('error', msg, meta);
};

Logger.prototype.pt = logging.point;

module.exports = function (tier, clazz) {
	return new Logger(tier, clazz);
};











