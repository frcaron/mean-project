"use strict";

//Inject 
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_share + '/ResponseService');
var SessionService  = require(global.__service + '/SessionService');

// Properties
var api_prefix = '/authenticate';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all type category
		.post(function (req, res) {

			Logger.debug('[WSP - VALID] SessionRoute#post');
			Logger.debug('              -- req.body.email    : ' + req.body.email);
			Logger.debug('              -- req.body.password : ' + req.body.password);

			// Validation
			if (!req.body.email) {
				return ResponseService.fail(res, {
							message : 'Authentication', 
							reason  : 'Param "email" missing'
						});
			}
			if (!req.body.password) {
				return ResponseService.fail(res, {
							message : 'Authentication', 
							reason  : 'Param "password" missing'
						});
			}

			SessionService.login(req, res);
		});
};