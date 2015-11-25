"use strict";

//Inject
var UserService = require(global.__service + '/UserService');

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Get one user
		.get(function (req, res) {
			UserService.getById(req, res, req.user.id);
		})

		// Update one user
		.put(function (req, res) {
			UserService.update(req, res, req.user.id);
		})

		// Delete one user
		.delete(function (req, res) {
			UserService.remove(req, res, req.user.id);
		});
};