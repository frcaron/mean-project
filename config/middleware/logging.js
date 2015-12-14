(function() {
	'use strict';

	var fs         = require('fs');
	var fsRotator  = require('file-stream-rotator');
	var morgan     = require('morgan');
	var path       = require('path');
	var _          = require('lodash');
	var onFinished = require('on-finished');
	var logger     = require(path.join(global.__core, 'logger'))('route', __filename);

	module.exports = function(app, config) {

		// =========================================================================
		// Morgan ==================================================================
		// =========================================================================

		if (config !== false) {
			config = config || {};

			if(config.enabled) {
				let format, options, stream;
				format  = config.format || 'dev';
				options = config.options || {};
				stream  = config.stream || {};

				if(stream.enabled) {

					let dirname = path.dirname(stream.filename);
					let logDirectory = global.__root;
					dirname.split('/').map(function(dir) {
						logDirectory = path.join(logDirectory, dir);

						// ensure log directory exists
						fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
					});

					// create a rotating write stream
					var accessLogStream = fsRotator.getStream({
						filename    : path.join(logDirectory, path.basename(stream.filename)),
						frequency   : stream.frequency,
						verbose     : false,
						date_format : stream.date_format
					});

					options = _.extend(options, { 'stream' : accessLogStream });
				}
				app.use(morgan(format, options));
			}
		}

		// =========================================================================
		// Winston =================================================================
		// =========================================================================

		// Log start in debug
		app.use(function (req, res, next) {
			logger.start({
				params : {
					'req.method' : req.method,
					'req.path'   : req.path,
					'req.body'   : req.body,
					'req.query'  : req.query
				}
			});
			onFinished(res, function () {
				logger.end({
					params : {
						'res.statusCode' : res.statusCode
					}
				});
			}) ;
			next();
		});
	};
})();