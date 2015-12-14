"use strict";

// Inject
var path      = require('path');
var jwt       = require('jsonwebtoken');
var userDao   = require(path.join(global.__dao, 'user'));
var Exception = require(path.join(global.__core, 'exception'));
var config    = require(path.join(global.__core, 'system')).Config;
var logger    = require(path.join(global.__core, 'logger'))('route', __filename);

// Valide authenticate
var auth = function (req, res, next) {

	let token = req.body.token || req.params.token || req.query.token || req.headers[ 'x-access-token' ];

	logger.debug({ method : 'auth', point : logger.pt.start, params : { token : token } });

	if (req.isAuthenticated()) {
		logger.debug({ method : 'auth', point : logger.pt.end });
		next();
	} else if (token) {
		jwt.verify(token, config.session.secret, function (err, decoded) {

			logger.debug({ method : 'auth', point : logger.pt.in, params : { token : decoded } });

			if (err) {
				 next(new Exception.RouteEx('Session Expired'));
			} else {
				userDao.getOne('byId', { user_id : decoded.id })
					.then(function (user) {
						req.user = {
							id       : user._id,
							name     : user.displayname || user.firstname + ' ' + user.surname,
							email    : user.local ? user.local.email || user.facebook ? user.facebook.email : undefined : undefined,
							verified : user.verified,
							admin    : user.admin
						};

						logger.debug({ method : 'auth', point : logger.pt.end });
						next();
					});
			}
		});
	} else {
		next(new Exception.RouteEx('No session'));
	}

};

module.exports = function (router, passport) {

	// ================================================================
	//  Param validation ==============================================
	// ================================================================

	// Validate param plan_id
	router.param('plan_id', function (req, res, next, plan_id) {

		logger.debug({ point : logger.pt.valid, params : { plan_id : plan_id } });

		if (!plan_id) {
			next(new Exception.RouteEx('Param missing', [ 'plan_id' ]));
		}
		next();
	});

	// Validate param program_id
	router.param('program_id', function (req, res, next, program_id) {

		logger.debug({ point : logger.pt.valid, params : { program_id : program_id } });

		if (!program_id) {
			next(new Exception.RouteEx('Param missing', [ 'program_id' ]));
		}
		next();
	});

	// Validate param transaction_id
	router.param('transaction_id', function (req, res, next, transaction_id) {

		logger.debug({ point : logger.pt.valid, params : { transaction_id : transaction_id } });

		if (!transaction_id) {
			next(new Exception.RouteEx('Param missing', [ 'transaction_id' ]));
		}
		next();
	});

	// Validate param category_id
	router.param('category_id', function (req, res, next, category_id) {

		logger.debug({ point : logger.pt.valid, params : { category_id : category_id } });

		if (!category_id) {
			next(new Exception.RouteEx('Param missing', [ 'category_id' ]));
		}
		next();
	});

	// Validate param type_category_id
	router.param('type_category_id', function (req, res, next, type_category_id) {

		logger.debug({ point : logger.pt.valid, params : { type_category_id : type_category_id } });

		if (!type_category_id) {
			next(new Exception.RouteEx('Param missing', [ 'type_category_id' ]));
		}
		next();
	});

	// ================================================================
	//  Public ========================================================
	// ================================================================

	require('./api/public/unlog/session')(router, passport);

	// ================================================================
	//  Private =======================================================
	// ================================================================

	require('./api/public/log/user')(router, auth);
	require('./api/public/log/plan')(router, auth);
	require('./api/public/log/program')(router, auth);
	require('./api/public/log/transaction')(router, auth);
	require('./api/public/log/category')(router, auth);
	require('./api/public/log/type-category')(router, auth);
	require('./api/public/log/me')(router, auth);
	require('./api/public/log/session')(router, passport, auth);
};