"use strict";

//Inject
var path            = require('path');
var validator       = require('validator');
var responseService = require(path.join(global.__service, 'response'));
var sessionService  = require(path.join(global.__service, 'session'));
var Exception       = require(path.join(global.__core, 'exception'));
var config          = require(path.join(global.__core, 'system')).Config;
var logger          = require(path.join(global.__core, 'logger'))('route', __filename);

// Properties
var api_prefix = '/auth';

module.exports = function (router, passport) {

	router.route(api_prefix + '/logout')

		// Logout
		.all(function (req, res) {
			req.logout();
			responseService.success(res);
		});

	if(config.strategies.local.enabled) {
		router.route(api_prefix + '/signup')

			// Signup local
			.post(function (req, res, next) {

				logger.debug({ method : 'auth/signup@post', point : logger.pt.valid, params : {
					'req.body.surname'   : req.body.surname,
					'req.body.firstname' : req.body.firstname,
					'req.body.email'     : req.body.email,
					'req.body.password'  : req.body.password
				} });

				// Validation
				let msg = [];
				if (!req.body.surname) {
					msg.push('surname');
				}
				if (!req.body.firstname) {
					msg.push('firstname');
				}
				if (!req.body.email) {
					msg.push('email');
				}
				if (!req.body.password) {
					msg.push('password');
				}
				if(msg.length) {
					return next(new Exception.MetierEx('Param missing', msg));
				}

				if(!validator.isEmail(req.body.email)) {
					return next(new Exception.MetierEx('Param invalid', [ 'email' ]));
				}

				next();

			}, function (req, res, next) {
				sessionService.authenticate(req, res, next, passport, 'local-signup');

			}, function (req, res) {
				responseService.success(res);
			});

		router.route(api_prefix + '/login')

			// Login local
			.post(function (req, res, next) {

				logger.debug({ method : 'login@post', point : logger.pt.valid, params : {
					'req.body.email'     : req.body.email,
					'req.body.password'  : req.body.password
				} });

				// Validation
				let msg = [];
				if (!req.body.email) {
					msg.push('email');
				}
				if (!req.body.password) {
					msg.push('password');
				}
				if(msg.length) {
					return next(new Exception.MetierEx('Param missing', msg));
				}

				if(!validator.isEmail(req.body.email)) {
					return next(new Exception.MetierEx('Param invalid', [ 'email' ]));
				}
				next();

			}, function (req, res, next) {
				sessionService.authenticate(req, res, next, passport, 'local-login');

			}, function (req, res, next) {
				sessionService.login(req, res, next);

			}, function (req, res) {
				responseService.success(res, {
					result : {
						user  : req.user,
						token : req.result
					}
				});
			});
	}

	if(config.strategies.facebook.enabled) {
		router.route(api_prefix + '/facebook')

			// Login facebook
			.get(passport.authenticate('facebook', { scope : 'email' }));

		router.route(api_prefix + '/facebook/callback')

			// Login facebook callback
			.get(function (req, res, next) {
				sessionService.authenticate(req, res, next, passport, 'facebook');

			}, function (req, res, next) {
				sessionService.login(req, res, next);

			}, function (req, res) {
				responseService.success(res, {
					result : {
						user  : req.user,
						token : req.result
					}
				});
			});
	}
};