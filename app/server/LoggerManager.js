"use strict";

// Inject
var Path    = require('path');
var Winston = require('winston');
var Moment  = require('moment');
var config  = require(Path.join(global.__package, 'system')).loadConfig();

var logger = new Winston.Logger({
		levels     : {
			error : 0,
			warn  : 1,
			info  : 2,
			debug : 3
		},
		level      : config.logging.level,
		transports : [
			new (Winston.transports.Console)({
				name      : 'console',
				timestamp : function() {
					return Moment().format('[HH:mm:ss]');
				},
				formatter : function(options) {
					return options.timestamp() + ' ' +
						options.level.toUpperCase() + ' ' +
						(undefined !== options.message ? options.message : '') +
						(options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
				}
			}),
			new (Winston.transports.File)({
				name      : 'file',
				filename  : 'app.log',
				timestamp : function() {
					return Moment().format('[DD-MM-YY HH:mm:ss]');
				},
				formatter : function(options) {
					return options.timestamp() + ' ' +
						options.level.toUpperCase() + ' ' +
						(undefined !== options.message ? options.message : '') +
						(options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
				}
			})
		]
	});

logger.remove('file');

module.exports = logger;