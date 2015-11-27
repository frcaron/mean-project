"use strict";

//Inject
var Exception       = require(global.__server  + '/ExceptionManager');
var Logger          = require(global.__server  + '/LoggerManager');
var ResponseService = require(global.__service + '/ResponseService');
var UserService     = require(global.__service + '/UserService');

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