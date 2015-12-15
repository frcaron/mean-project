"use strict";

//Inject
var path            = require('path');
var responseService = require(path.join(global.__service, 'response'));
var userService     = require(path.join(global.__service, 'user'));

// Properties
var api_prefix = '/me';

module.exports = function (router, auth) {

	router.route(api_prefix)

		// Get one user
		.get(auth, function (req, res, next) {
			userService.getById(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});
};