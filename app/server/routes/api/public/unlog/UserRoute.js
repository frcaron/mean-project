"use strict";

//Inject
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var UserService     = require(global.__service + '/UserService');

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Create new user
		.post(function (req, res) {

			Logger.debug('[WSP - VALID] UserRoute#post');
			Logger.debug('              -- req.body.surname   : ' + req.body.surname);
			Logger.debug('              -- req.body.firstname : ' + req.body.firstname);
			Logger.debug('              -- req.body.email     : ' + req.body.email);
			Logger.debug('              -- req.body.password  : ' + req.body.password);

			// Validation
			let msg = [];
			if (!req.body.surname) {
				msg.push('surname');
			}
			if (!req.body.firstname) {
				msg.push('firstname');
			}
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

			UserService.create(req, res);
		});
};