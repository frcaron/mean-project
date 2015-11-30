"use strict";

// Inject
var Path         = require('path');
var Fs           = require('fs');
var BodyParser   = require('body-parser');
var CookieParser = require('cookie-parser');
var Express      = require('express');
var Favicon      = require('serve-favicon');
var Flash        = require('connect-flash');
var Session      = require('express-session');

module.exports = function (app, passport, config) {

	// =========================================================================
	// Global ==================================================================
	// =========================================================================

	// Exposed ressources
	app.use('/static', Express.static(global.__assets));
	app.use('/public', Express.static(global.__dist));

	// Add logging middleware
	require(Path.join(global.__config, 'middleware/logging'))(app, config.logging);

	// Setting favicon
	app.use(Favicon(Path.join(global.__assets,'img/favicon.ico')));

	// Active form extended
 	app.use(BodyParser.urlencoded(config.bodyParser.urlencoded));
	app.use(BodyParser.json(config.bodyParser.json));

	// Other config
	app.use(CookieParser());
	app.use(Flash());

	// =========================================================================
	// Engine ==================================================================
	// =========================================================================

	// Setting path views public
	app.set('views', [ global.__views ]);

	app.engine('html', function (filePath, options, callback) {
	  Fs.readFile(filePath, function (err, content) {
	    if (err) {
	    	return callback(new Error(err));
	    }
	    var rendered = content.toString();
	    return callback(null, rendered);
	  });
	});
	app.set('view engine', 'html');

	// =========================================================================
	// Auth Strategies =========================================================
	// =========================================================================

	app.use(Session({
		name              : config.session.name,
		secret            : config.session.secret,
		resave            : true,
		saveUninitialized : true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
};