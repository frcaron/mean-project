"use strict";

// Inject
var path         = require('path');
var bodyParser   = require('body-parser');
var compression  = require('compression');
var cookieParser = require('cookie-parser');
var consolidate  = require('consolidate');
var express      = require('express');
var favicon      = require('serve-favicon');
var flash        = require('connect-flash');
var session      = require('express-session');
var glob         = require('glob');
var assets       = require(path.join(global.__config, 'assets'));
var config       = require(path.join(global.__core, 'system')).Config;

module.exports = function (app, passport) {

	// =========================================================================
	// Global ==================================================================
	// =========================================================================

	// Should be placed before express.static
	app.use(compression({
		filter : function (req, res) {
			return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Expose ressource
	app.use('/dist', express.static(path.resolve('./', assets.dist.root)));
	app.use('/static', express.static(path.join(global.__client, 'assets/static')));

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Disable views cache
		app.set('view cache', false);

		// Expose views
		assets.client.views.folders.forEach(function (pattern) {
			let folders = glob.sync(pattern);
			folders.map(function (staticPath) {
				if(staticPath) {
					let dist = staticPath.replace(assets.client.root, '');
					app.use(dist, express.static(path.resolve('./' + staticPath)));
				}
			});
		});
	}

	// Setting favicon
	app.use(favicon(path.join(global.__client, 'assets/img/favicon.ico')));

	// Active form extended
	app.use(bodyParser.urlencoded(config.bodyParser.urlencoded));
	app.use(bodyParser.json(config.bodyParser.json));

	// Active cookie parser
	app.use(cookieParser());

	// Active flash message
	app.use(flash());

	// Add logging middleware
	require(path.join(global.__config, 'middleware/logging'))(app, config.logging);

	// =========================================================================
	// Engine ==================================================================
	// =========================================================================

	// Setting path views public
	app.set('views', [ global.__views ]);
	app.engine('html', consolidate[config.templateEngine]);
	app.set('view engine', 'html');

	// =========================================================================
	// Auth Strategies =========================================================
	// =========================================================================

	app.use(session({
		name              : config.session.name,
		secret            : config.session.secret,
		resave            : true,
		saveUninitialized : true,
		cookie            : {
			maxAge   : config.session.cookie.maxAge,
			httpOnly : config.session.cookie.httpOnly,
			secure   : config.session.cookie.secure
		},
	}));
	app.use(passport.initialize());
	app.use(passport.session());
};