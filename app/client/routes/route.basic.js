"use strict";

// Inject
var Jwt             = require('jsonwebtoken');
var SecretConfig    = require(global.__config + '/token');
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');

module.exports = function (router) {

	// =========================================================================================
	// Public
	// =========================================================================================

	// =========================================================================================
	// Middleware
	// =========================================================================================

	// Token verification
	router.use(function (req, res, next) {

		let token = req.body.token || req.params.token ||  req.query.token || req.headers[ 'x-access-token' ];

		Logger.debug('[WSB - START] MiddleWare');
		Logger.debug('              -- token : ' + token);

		if (token) {
			Jwt.verify(token, SecretConfig.secret, function (err, decoded) {
				if (err) {
					return ResponseService.fail(res, {
						reason    : 'Session expired',
						code_http : 403
					});
				}

				// Follow token
				req.decoded = decoded;

				Logger.debug('[WSB -   END] MiddleWare');
				Logger.debug('              -- token : ' + JSON.stringify(decoded));

				return next();
			});
		} else {
			return ResponseService.fail(res, {
				reason    : 'No session',
				code_http : 403
			});
		}
	});

	// =========================================================================================
	// Private
	// =========================================================================================

};