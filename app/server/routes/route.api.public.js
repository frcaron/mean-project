"use strict";

// Inject
var Path            = require('path');
var Jwt             = require('jsonwebtoken');
var UserService     = require(Path.join(global.__service, 'user'));
var Exception       = require(Path.join(global.__core, 'exception'));
var Config          = require(Path.join(global.__core, 'system')).Config;
var Logger          = require(Path.join(global.__core, 'system')).Logger;

module.exports = function (router, passport) {

	// =========================================================================================
	// Param validation
	// =========================================================================================

	// Validate param plan_id
	router.param('plan_id', function (req, res, next, plan_id) {

		Logger.debug('[WSP - VALID] "plan_id" : ' + plan_id);

		if (!plan_id) {
			next(new Exception.RouteEx('Param missing', [ 'plan_id' ]));
		}
		next();
	});

	// Validate param program_id
	router.param('program_id', function (req, res, next, program_id) {

		Logger.debug('[WSP - VALID] "program_id" : ' + program_id);

		if (!program_id) {
			next(new Exception.RouteEx('Param missing', [ 'program_id' ]));
		}
		next();
	});

	// Validate param transaction_id
	router.param('transaction_id', function (req, res, next, transaction_id) {

		Logger.debug('[WSP - VALID] "transaction_id" : ' + transaction_id);

		if (!transaction_id) {
			next(new Exception.RouteEx('Param missing', [ 'transaction_id' ]));
		}
		next();
	});

	// Validate param category_id
	router.param('category_id', function (req, res, next, category_id) {

		Logger.debug('[WSP - VALID] "category_id" : ' + category_id);

		if (!category_id) {
			next(new Exception.RouteEx('Param missing', [ 'category_id' ]));
		}
		next();
	});

	// Validate param type_category_id
	router.param('type_category_id', function (req, res, next, type_category_id) {

		Logger.debug('[WSP - VALID] "type_category_id" : ' + type_category_id);

		if (!type_category_id) {
			next(new Exception.RouteEx('Param missing', [ 'type_category_id' ]));
		}
		next();
	});

	// =========================================================================================
	// Public
	// =========================================================================================

	require('./api/public/unlog/session')(router, passport);

	// =========================================================================================
	// Middleware
	// =========================================================================================

	router.use(function (req, res, next) {

		let token = req.body.token || req.params.token || req.query.token || req.headers[ 'x-access-token' ];

		Logger.debug('[WSP - MIDDL] route.api.public#secure');
		Logger.debug('              -- token : ' + token);

		if (req.isAuthenticated()) {
			next('route');

		} else if (token) {
			Jwt.verify(token, Config.session.secret, function (err, decoded) {
				if (err) {
					next(new Exception.RouteEx('Session Expired'));

				} else {
					Logger.debug('              -- token : ' + JSON.stringify(decoded));
					UserService.getById(req, next, decoded.id);
				}
			});

		} else {
			next(new Exception.RouteEx('No session'));
		}

	}, function (req, res, next) {
		let user = req.resultat;
		req.user = {
			id       : user._id,
			name     : user.displayname || user.firstname + ' ' + user.surname,
			email    : user.local ? user.local.email || user.facebook ? user.facebook.email : undefined : undefined,
			verified : user.verified,
			admin    : user.admin
		};

		next();
	});

	// =========================================================================================
	// Private
	// =========================================================================================

	require('./api/public/log/user')(router);
	require('./api/public/log/plan')(router);
	require('./api/public/log/program')(router);
	require('./api/public/log/transaction')(router);
	require('./api/public/log/category')(router);
	require('./api/public/log/type-category')(router);
	require('./api/public/log/me')(router);
	require('./api/public/log/session')(router, passport);
};