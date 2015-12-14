"use strict";

var path      = require('path');
var fs        = require('fs');
var moment    = require('moment');
var _         = require('lodash');
var winston   = require('winston');
var winstonRF = require('winston-daily-rotate-file');
var config    = require(path.join(global.__core, 'system')).Config;

let logging = {
	point : {
		'err'   : 'error',
		'valid' : 'valid',
		'catch' : 'catch',
		'start' : 'start',
		'end'   : 'end',
		'in'    : 'in'
	},
	colors : {
		// Tier
		'model'   : 'blue',
		'dao'     : 'yellow',
		'service' : 'green',
		'route'   : 'red',
		'session' : 'magenta',

		// Tier background
		'bg-model'   : 'bgYellow',
		'bg-dao'     : 'bgBlue',
		'bg-service' : 'bgGreen',
		'bg-route'   : 'bgRed',
		'bg-session' : 'bgMagenta',
		'bg-white'   : 'bgWhite',

		// Point
		'p-error' : 'dim',
		'p-valid' : 'dim',
		'p-catch' : 'dim',
		'p-start' : 'dim',
		'p-end'   : 'dim',
		'p-in'    : 'dim',

		// Other
		'param' : 'cyan',
		'time'  : 'grey',

		// Style
		'b' : 'bold',
		'r' : 'inverse',
		'i' : 'italic'
	}
};

function colorize (str, styles) {
	if(_.isArray(styles)) {
		_.forEach(styles, function (n) {
			str = winston.config.colorize(n, str);
		});
	} else{
		str = winston.config.colorize(styles, str);
	}
	return str;
}

function newLine (options, timestamp) {
	let output = '\n';
	if(timestamp) {
		output += '[' + colorize(options.timestamp(), ['time']) + '] ';
	}
	return output;
}

// =========================================================================
// Logger ==================================================================
// =========================================================================

// Add colors custom
winston.config.addColors(logging.colors);

// Formatter
let formatter = function(options, timestamp) {

	let output = '';

	if(timestamp) {
		output += '[' + colorize(options.timestamp(), ['time']) + ']\t';
	}

	if(options.meta && _.keys(options.meta).length) {
		if(options.meta.start || options.meta.end) {

			// Start mode
			if(options.meta.start) {
				output += newLine(options, timestamp);
				output += '\t-----------------------------------------------------------';
				output += newLine(options, timestamp);
				output += colorize('\tSTART', ['b']);
			}

			// Show params
			if(options.meta.params) {
				_.forEach(options.meta.params, function (n, key) {
					if(n && (_.isString(n) || _.isNumber(n) || (_.isObject(n) && _.keys(n).length))) {
						output += newLine(options, timestamp);
						output += '\t\t';
						output += colorize('>>', ['param']);
						output += ' \'';
						output += colorize(key, ['param']);
						output += '\'\t';
						if(_.isArray(n)) {
							output += n.toString();
						} else if(_.isObject(n)) {
							let first = true;
							_.forEach(n, function (n1, key) {
								if(!first) {
									output += '\t\t\t\t';
								}
								output += '- \'';
								output += key;
								output += '\'\t';
								output += n1;

								output += newLine(options, timestamp);
								first = false;
							});
						} else {
							output += (n && n.length > 10) ? _.trunc(n, 30) : n;
						}
					}
				});

				if(options.meta.start) {
					output += newLine(options, timestamp);
				}
			}

			// End mode
			if(options.meta.end) {
				output += newLine(options, timestamp);
				output += colorize('\tEND', ['b']);
				output += newLine(options, timestamp);
				output += '\t-----------------------------------------------------------';
			}

		} else {
			let tmp = '';
			tmp += '[';
			tmp += colorize(options.meta.tier, ['bg-white']);
			tmp += colorize(':', ['b']);
			tmp += colorize(options.meta.clazz, []);
			tmp += colorize(' ## ', ['b']);
			tmp += colorize(options.meta.point, ['bg-white']);
			if(options.meta.method) {
				tmp += colorize(':', ['b']);
				tmp += colorize(options.meta.method, []);
			}
			tmp += ']';

			output += colorize(tmp, [options.meta.tier]);

			if(options.message) {
				output += newLine(options, timestamp);
				output += colorize('\t\t** ', [options.meta.tier]);
				output += options.message;
			}

			if(options.meta.params) {
				_.forEach(options.meta.params, function (n, key) {
					output += newLine(options, timestamp);
					output += '\t\t';
					output += colorize('--', [options.meta.tier]);
					output += ' \'';
					output += colorize(key, [options.meta.tier]);
					output += '\'\t';
					if(_.isArray(n)) {
						output += n.toString();
					} else if(_.isObject(n)) {
						output += JSON.stringify(n);
					} else {
						output += (n && n.length > 10) ? _.trunc(n, 30) : n;
					}
				});
			}

			output = colorize(output, 'p-' + options.meta.point);
		}
	}
	return output;
};

// Instance logger
let defaultLogger = new winston.Logger();

// Activate log console
let consoleConf = config.logging.winston.console;
if(consoleConf.enabled) {
	defaultLogger.add(winston.transports.Console, ({
		name        : 'console',
		level       : consoleConf.level,
		timestamp   : function() {
			return moment().format(consoleConf.timestamp.format);
		},
		formatter   : function(options) {
			return formatter(options, consoleConf.timestamp.enabled);
		},
		colorize    : true,
		prettyPrint : true
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
	if(meta && !_.keys(meta).length) {
		throw new Error('Meta incorrect');
	}
	if(!meta.point){
		throw new Error('Param meta "point" required');
	}
	if(!_.some(logging.point, chr => chr === meta.point)) {
		throw new Error('Param "point" incorrect : ' + meta.point);
	}
	if(meta.params && !_.keys(meta.params).length) {
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
var log = function(lvl, msg, meta, extend) {
	if(!meta) {
		meta   = msg || {};
		msg    = '';
	}
	if(!extend.start && !extend.end) {
		checkMeta(meta);
	}
	defaultLogger.log(lvl, msg, _.extend(meta, extend));
};

// Start request
Logger.prototype.start = function(msg, meta) {
	log('debug', msg, meta, { start : 'true' });
};

// End request
Logger.prototype.end = function(msg, meta) {
	log('debug', msg, meta, { end : 'true' });
};

// Info level
Logger.prototype.info = function(msg, meta) {
	log('info', msg, meta, { tier : this.tier, clazz : this.clazz });
};

// Debug level
Logger.prototype.debug = function(msg, meta) {
	log('debug', msg, meta, { tier : this.tier, clazz : this.clazz });
};

// Warn level
Logger.prototype.warn = function(msg, meta) {
	log('warn', msg, meta, { tier : this.tier, clazz : this.clazz });
};

// Error level
Logger.prototype.error = function(msg, meta) {
	log('error', msg, meta, { tier : this.tier, clazz : this.clazz });
};

Logger.prototype.pt = logging.point;

module.exports = function (tier, clazz) {
	return new Logger(tier, clazz);
};











