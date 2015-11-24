"use strict";

//Inject
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
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
			let msg = [];
			if (!req.body.email) {
				msg.push('email');
			}
			if (!req.body.password) {
				msg.push('password');
			}
			if(msg.length) {
				return ResponseService.fail(res, {
					reason : 'Param missing',
					detail : msg
				});
			}

			SessionService.login(req, res);
		});
};