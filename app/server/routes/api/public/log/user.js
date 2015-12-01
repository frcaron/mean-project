"use strict";

//Inject
var Path            = require('path');
var Validator       = require('validator');
var Exception       = require(Path.join(global.__server, 'ExceptionManager'));
var ResponseService = require(Path.join(global.__service, 'response'));
var UserService     = require(Path.join(global.__service, 'user'));

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Update one user
		.put(function (req, res, next) {

			if(req.body.email) {
				if(!Validator.isEmail(req.body.email)) {
					return next(new Exception.MetierEx('Format email invalid'));
				}
			}
			next();

		}, function (req, res, next) {

			UserService.update(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		})

		// Delete one user
		.delete(function (req, res, next) {
			UserService.remove(req, next, req.user.id);
			req.logout();

		}, function (req, res) {
			ResponseService.success(res);
		});
};