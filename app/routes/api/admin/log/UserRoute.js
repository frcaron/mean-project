"use strict";

//Inject
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service + '/ResponseService');
var UserService     = require(global.__service + '/UserService');

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all users
		.get(function (req, res) {
			UserService.getAll(req, res);
		});

	router.route(api_prefix + '/:user_id')

		// Get one user
		.get(function (req, res) {
			UserService.getOne(req, res, req.params.user_id);
		})

		// Update one user
		.put(function (req, res) {
			UserService.update(req, res, req.params.user_id);
		})

		// Delete one user
		.delete(function (req, res) {
			UserService.remove(req, res, req.params.user_id);
		});

	router.route(api_prefix + '/:user_id/rules')

		// Manage permission
		.put(function (req, res) {

			Logger.debug('Admin#UserRoute#put [validation]');
			Logger.debug('-- req.body.admin : ' + req.body.admin);

			// Validation
			if ( req.body.admin === undefined ) {
				return ResponseService.fail(res, {
							message : 'Give permission', 
							reason  : 'Param "admin" missing'
						});
			}

			UserService.managePermission(req, res, req.params.user_id);
		});
};