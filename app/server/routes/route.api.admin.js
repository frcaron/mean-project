"use strict";

// Inject
var path      = require('path');
var jwt       = require('jsonwebtoken');
var userDao   = require(path.join(global.__dao, 'user'));
var Exception = require(path.join(global.__core, 'exception'));
var config    = require(path.join(global.__core, 'system')).Config;
var logger    = require(path.join(global.__core, 'system')).Logger;

// Valide authenticate
var auth = function (req, res, next) {

	let token = req.body.token || req.params.token || req.query.token || req.headers[ 'x-access-token' ];

	logger.debug('[WSA - MIDDL] route.api.admin#secure');
	logger.debug('              -- token : ' + token);

	if (req.isAuthenticated()) {

		// Admin access
		if (!req.user.admin) {
			next(new Exception.RouteEx('Permission refused'));
		} else {
			next();
		}
	} else if (token) {
		jwt.verify(token, config.session.secret, function (err, decoded) {
			if (err) {
				next(new Exception.RouteEx('Session Expired'));
			} else {
				logger.debug('              -- token : ' + JSON.stringify(decoded));

				userDao.getOne('byId', { user_id : decoded.id })
					.then(function (user) {
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
			}
		});
	} else {
		next(new Exception.RouteEx('No session'));
	}
};

module.exports = function (router) {

	// ================================================================
	//  Param validation ==============================================
	// ================================================================

	// Validate param user_id
	router.param('user_id', function (req, res, next, user_id) {

		logger.debug('[WSA - VALID] "user_id" : ' + user_id);

		if (!user_id) {
			next(new Exception.RouteEx('Param missing', [ 'user_id' ]));
		}
		next();
	});

	// Validate param type_category_id
	router.param('type_category_id', function (req, res, next, type_category_id) {

		logger.debug('[WSA - VALID] "type_category_id" : ' + type_category_id);

		if (!type_category_id) {
			next(new Exception.RouteEx('Param missing', [ 'type_category_id' ]));
		}
		next();
	});

	// ================================================================
	//  Public ========================================================
	// ================================================================

	require('./api/admin/unlog/type-category')(router);

	// ================================================================
	//  Private =======================================================
	// ================================================================

	require('./api/admin/log/type-category')(router, auth);
	require('./api/admin/log/user')(router, auth);
};