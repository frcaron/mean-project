(function() {
	'use strict';

	var Fs        = require('fs');
	var FSRotator = require('file-stream-rotator');
	var Morgan    = require('morgan');
	var Path      = require('path');
	var _         = require('lodash');

	module.exports = function(app, config) {
		let format, options, stream;
		if (config !== false) {
			config = config || {};

			format  = config.format || 'dev';
			options = config.options || {};
			stream  = config.stream || {};

			if(stream.enabled) {

				let dirname = Path.dirname(stream.filename);
				let logDirectory = global.__root;
				dirname.split('/').map(function(dir) {
					logDirectory = Path.join(logDirectory, dir);

					// ensure log directory exists
					Fs.existsSync(logDirectory) || Fs.mkdirSync(logDirectory);
				});

				// create a rotating write stream
				var accessLogStream = FSRotator.getStream({
					filename    : Path.join(logDirectory, Path.basename(stream.filename)),
					frequency   : stream.frequency,
					verbose     : false,
					date_format : stream.date_format
				});

				options = _.extend(options, { 'stream' : accessLogStream });
			}

			app.use(Morgan(format, options));
		}
	};
})();