"use strict";

// Inject
var Path         = require('path');
var BodyParser   = require('body-parser');
var CookieParser = require('cookie-parser');
var Consolidate  = require('consolidate');
var Express      = require('express');
var Favicon      = require('serve-favicon');
var Flash        = require('connect-flash');
var Session      = require('express-session');
var config       = require(Path.join(global.__package, 'system')).loadConfig();

module.exports = function (app, passport) {

	// =========================================================================
	// Global ==================================================================
	// =========================================================================

	// Exposed ressources
	app.use('/static', Express.static(global.__assets));
	app.use('/public', Express.static(global.__libs));

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
	app.engine('html', Consolidate[config.templateEngine]);
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