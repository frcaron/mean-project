"use strict";

//Inject
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service + '/ResponseService');
var UserService     = require(global.__service + '/UserService');

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Create new user
		.post(function (req, res) {

			Logger.debug('Public#UserRoute#post [validation]');
			Logger.debug('-- req.body.surname   : ' + req.body.surname);
			Logger.debug('-- req.body.firstname : ' + req.body.firstname);
			Logger.debug('-- req.body.email     : ' + req.body.email);
			Logger.debug('-- req.body.password  : ' + req.body.password);

			// Validation
			if (!req.body.surname) {
				return ResponseService.fail(res, 'Add failed', 'Param "surname" missing');
			}
			if (!req.body.firstname) {
				return ResponseService.fail(res, 'Add failed', 'Param "firstname" missing');
			}
			if (!req.body.email) {
				return ResponseService.fail(res, 'Add failed', 'Param "email" missing');
			}
			if (!req.body.password) {
				return ResponseService.fail(res, 'Add failed', 'Param "password" missing');
			}

			UserService.create(req, res);
		});
};