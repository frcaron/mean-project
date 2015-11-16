"use strict";

// Inject 
var Jwt             = require('jsonwebtoken');
var TokenConfig     = require(global.__config + '/token');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_trans + '/ResponseService');

module.exports = function (router) {

	// =========================================================================================
	// Public
	// =========================================================================================

	// =========================================================================================
	// Middleware
	// =========================================================================================

	// Token verification
	router.use(function (req, res, next) {

		var token = req.body.token || req.params.token ||  req.query.token || req.headers[ 'x-access-token' ];

		Logger.debug('ExpressMiddleWare Basic [start] | token : ' + token);

		if (token) {
			Jwt.verify(token, TokenConfig.secret, function (err, decoded) {
				if (err) {
					return ResponseService.fail(res, { 
								message   : 'Session',
								reason    : 'Expired',
								code_http : 403
							});
				}

				// Follow token
				req.decoded = decoded;

				Logger.debug('ExpressMiddleWare Basic [end] | decoded : ' + decoded);	

				return next();
			});
		} else {
			return ResponseService.fail(res, { 
						message   : 'Session',
						reason    : 'No authicate',
						code_http : 403
					});
		}
	});

	// =========================================================================================
	// Private
	// =========================================================================================

};