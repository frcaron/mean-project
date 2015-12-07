"use strict";

// Inject
var Path            = require('path');
var Jwt             = require('jsonwebtoken');
var UserService     = require(Path.join(global.__service, 'user'));
var Exception       = require(Path.join(global.__core, 'exception'));
var Config          = require(Path.join(global.__core, 'system')).Config;
var Logger          = require(Path.join(global.__core, 'system')).Logger;

module.exports = function (router) {

	// =========================================================================================
	// Param validation
	// =========================================================================================

	// Validate param user_id
	router.param('user_id', function (req, res, next, user_id) {

		Logger.debug('[WSA - VALID] "user_id" : ' + user_id);

		if (!user_id) {
			next(new Exception.RouteEx('Param missing', [ 'user_id' ]));
		}
		next();
	});

	// Validate param type_category_id
	router.param('type_category_id', function (req, res, next, type_category_id) {

		Logger.debug('[WSA - VALID] "type_category_id" : ' + type_category_id);

		if (!type_category_id) {
			next(new Exception.RouteEx('Param missing', [ 'type_category_id' ]));
		}
		next();
	});

	// =========================================================================================
	// Public
	// =========================================================================================

	require('./api/admin/unlog/type-category')(router);

	// =========================================================================================
	// Middleware
	// =========================================================================================

	router.all('/*', function (req, res, next) {

		let token = req.body.token || req.params.token || req.query.token || req.headers[ 'x-access-token' ];

		Logger.debug('[WSA - MIDDL] route.api.admin#secure');
		Logger.debug('              -- token : ' + token);

		if (req.isAuthenticated()) {

			// Admin access
			if (!req.user.admin) {
				next(new Exception.RouteEx('Permission refused'));
			} else {
				next('route');
			}

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
		let user = req.result;

		// Admin access
		if(!user.admin) {
			next(new Exception.RouteEx('Permission refused'));

		} else {
			req.user = {
				id       : user._id,
				name     : user.displayname || user.firstname + ' ' + user.surname,
				email    : user.local ? user.local.email || user.facebook ? user.facebook.email : undefined : undefined,
				verified : user.verified,
				admin    : user.admin
			};

			next();
		}
	});

	// =========================================================================================
	// Private
	// =========================================================================================

	require('./api/admin/log/type-category')(router);
	require('./api/admin/log/user')(router);
};