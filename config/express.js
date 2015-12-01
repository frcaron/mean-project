"use strict";

// Inject
var Path         = require('path');
var BodyParser   = require('body-parser');
var compression  = require('compression');
var CookieParser = require('cookie-parser');
var Consolidate  = require('consolidate');
var Express      = require('express');
var Favicon      = require('serve-favicon');
var Flash        = require('connect-flash');
var Session      = require('express-session');
var Config       = require(Path.join(global.__core, 'system')).Config;

module.exports = function (app, passport) {

	// =========================================================================
	// Global ==================================================================
	// =========================================================================

	// Should be placed before express.static
	app.use(compression({
		level: 9
	}));

	// Expose ressources
	app.use('/libs', Express.static(global.__libs));
	app.use('/static', Express.static(Path.join(global.__assets, 'static')));

	// Setting favicon
	app.use(Favicon(Path.join(global.__assets,'img/favicon.ico')));

	// Active form extended
 	app.use(BodyParser.urlencoded(Config.bodyParser.urlencoded));
	app.use(BodyParser.json(Config.bodyParser.json));

	// Active cookie parser
	app.use(CookieParser());

	// Active flash message
	app.use(Flash());

	// Add logging middleware
	require(Path.join(global.__config, 'middleware/logging'))(app, Config.logging);

	// =========================================================================
	// Engine ==================================================================
	// =========================================================================

	// Setting path views public
	app.set('views', [ global.__views ]);
	app.engine('html', Consolidate[Config.templateEngine]);
	app.set('view engine', 'html');

	// =========================================================================
	// Auth Strategies =========================================================
	// =========================================================================

	app.use(Session({
		name              : Config.session.name,
		secret            : Config.session.secret,
		resave            : true,
		saveUninitialized : true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
};