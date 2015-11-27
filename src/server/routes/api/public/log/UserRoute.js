"use strict";

//Inject
var Validator       = require('validator');
var Exception       = require(global.__server  + '/ExceptionManager');
var ResponseService = require(global.__service + '/ResponseService');
var UserService     = require(global.__service + '/UserService');

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