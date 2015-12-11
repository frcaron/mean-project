(function() {
	'use strict';

	var fs        = require('fs');
	var fsRotator = require('file-stream-rotator');
	var morgan    = require('morgan');
	var path      = require('path');
	var _         = require('lodash');

	module.exports = function(app, config) {
		let format, options, stream;
		if (config !== false) {
			config = config || {};

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
	};
})();