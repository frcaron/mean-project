"use strict";

//Inject
var Path            = require('path');
var Exception       = require(Path.join(global.__server, 'ExceptionManager'));
var ResponseService = require(Path.join(global.__service, 'response'));
var UserService     = require(Path.join(global.__service, 'user'));
var Logger          = require(Path.join(global.__core, 'system')).Logger;

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all users
		.get(function (req, res, next) {
			UserService.all(req, next);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:user_id')

		// Get one user
		.get(function (req, res, next) {
			UserService.getById(req, next, req.params.user_id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:user_id')

		// Manage permission
		.put(function (req, res, next) {

			Logger.debug('[WSA - VALID] UserRoute#put');
			Logger.debug('              -- req.body.admin : ' + req.body.admin);

			// Validation
			if ( req.body.admin === undefined ) {
				return next(new Exception.MetierEx('Param missing',  [ 'admin' ]));
			}
			next();

		}, function (req, res, next) {

			UserService.managePermission(req, next, req.params.user_id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});
};