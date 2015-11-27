"use strict";

//Inject
var Logger          = require(global.__server  + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var UserService     = require(global.__service + '/UserService');

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all users
		.get(function (req, res) {
			UserService.all(req, res);
		});

	router.route(api_prefix + '/:user_id')

		// Get one user
		.get(function (req, res) {
			UserService.getById(req, res, req.params.user_id);
		});

	router.route(api_prefix + '/:user_id')

		// Manage permission
		.put(function (req, res) {

			Logger.debug('[WSA - VALID] UserRoute#put');
			Logger.debug('              -- req.body.admin : ' + req.body.admin);

			// Validation
			if ( req.body.admin === undefined ) {
				return ResponseService.fail(res, {
					reason : 'Param missing',
					detail : [ 'admin' ]
				});
			}

			UserService.managePermission(req, res, req.params.user_id);
		});
};