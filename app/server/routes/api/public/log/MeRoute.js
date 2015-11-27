"use strict";

//Inject
var ResponseService = require(global.__service + '/ResponseService');
var UserService     = require(global.__service + '/UserService');

// Properties
var api_prefix = '/me';

module.exports = function (router) {

	router.route(api_prefix)

		// Get one user
		.get(function (req, res, next) {
			UserService.getById(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});
};