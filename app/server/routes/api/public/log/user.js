"use strict";

//Inject
var path            = require('path');
var validator       = require('validator');
var responseService = require(path.join(global.__service, 'response'));
var userService     = require(path.join(global.__service, 'user'));
var Exception       = require(path.join(global.__core, 'exception'));

// Properties
var api_prefix = '/users';

module.exports = function (router, auth) {

	router.route(api_prefix)

		// Update one user
		.put(auth, function (req, res, next) {

			if(req.body.email) {
				if(!validator.isEmail(req.body.email)) {
					return next(new Exception.MetierEx('Format email invalid'));
				}
			}
			next();

		}, function (req, res, next) {

			userService.update(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		})

		// Delete one user
		.delete(auth, function (req, res, next) {
			userService.remove(req, next, req.user.id);
			req.logout();

		}, function (req, res) {
			responseService.success(res);
		});
};