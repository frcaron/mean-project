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
var Glob         = require('glob');
var Assets       = require(Path.join(global.__config, 'assets'));
var Config       = require(Path.join(global.__core, 'system')).Config;

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
	app.use('/dist', Express.static(Path.join(global.__client, 'dist')));
	app.use('/static', Express.static(Path.join(global.__client, 'assets', 'static')));

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Disable views cache
		app.set('view cache', false);

		// Expose views
		Assets.client.views.folders.forEach(function (pattern) {
			let folders = Glob.sync(pattern);
			folders.map(function (staticPath) {
				if(staticPath) {
					let dist = staticPath.replace(Assets.client.root, '');
					app.use(dist, Express.static(Path.resolve('./' + staticPath)));
				}
			});
		});
	}

	// Setting favicon
	app.use(Favicon(Path.join(global.__client, 'assets/img/favicon.ico')));

	// Active form extended
	app.use(BodyParser.urlencoded(Config.bodyParser.urlencoded));
	app.use(BodyParser.json(Config.bodyParser.json));

	// Active cookie parser
	app.use(CookieParser());

	// Active flash message
	app.use(Flash());

	// Add logging middleware
	require(Path.join(global.__config, 'middleware', 'logging'))(app, Config.logging.morgan);

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
		saveUninitialized : true,
		cookie            : {
			maxAge   : Config.session.cookie.maxAge,
			httpOnly : Config.session.cookie.httpOnly,
			secure   : Config.session.cookie.secure
		},
	}));
	app.use(passport.initialize());
	app.use(passport.session());
};