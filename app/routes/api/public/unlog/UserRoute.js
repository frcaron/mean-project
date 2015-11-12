"use strict";

//Inject
var ResponseService = require(global.__service + '/ResponseService');
var UserService     = require(global.__service + '/UserService');

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Create new user
		.post(function (req, res) {

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