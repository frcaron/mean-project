"use strict";

//Inject
var path            = require('path');
var responseService = require(path.join(global.__service, 'response'));
var userService     = require(path.join(global.__service, 'user'));
var Exception       = require(path.join(global.__core, 'exception'));
var logger          = require(path.join(global.__core, 'system')).Logger;

// Properties
var api_prefix = '/users';

module.exports = function (router, auth) {

	router.route(api_prefix)

		// Get all users
		.get(auth, function (req, res, next) {
			userService.all(req, next);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:user_id')

		// Get one user
		.get(auth, function (req, res, next) {
			userService.getById(req, next, req.params.user_id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:user_id')

		// Manage permission
		.put(auth, function (req, res, next) {

			logger.debug('[WSA - VALID] UserRoute#put');
			logger.debug('              -- req.body.admin : ' + req.body.admin);

			// Validation
			if ( req.body.admin === undefined ) {
				return next(new Exception.MetierEx('Param missing',  [ 'admin' ]));
			}
			next();

		}, function (req, res, next) {

			userService.managePermission(req, next, req.params.user_id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});
};