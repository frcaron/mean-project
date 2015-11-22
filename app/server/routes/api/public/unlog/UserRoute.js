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
			if (!req.body.surname) {
				return ResponseService.fail(res, {
					message : 'Add',
					reason  : 'Param "surname" missing'
				});
			}
			if (!req.body.firstname) {
				return ResponseService.fail(res, {
					message : 'Add',
					reason  : 'Param "firstname" missing'
				});
			}
			if (!req.body.email) {
				return ResponseService.fail(res, {
					message : 'Add',
					reason  : 'Param "email" missing'
				});
			}
			if (!req.body.password) {
				return ResponseService.fail(res, {
					message : 'Add',
					reason  : 'Param "password" missing'
				});
			}

			UserService.create(req, res);
		});
};