"use strict";

//Inject
var Path            = require('path');
var Validator       = require('validator');
var Exception       = require(Path.join(global.__server, 'ExceptionManager'));
var ResponseService = require(Path.join(global.__service, 'response'));
var SessionService  = require(Path.join(global.__service, 'session'));
var Config          = require(Path.join(global.__core, 'system')).Config;
var Logger          = require(Path.join(global.__core, 'system')).Logger;

// Properties
var api_prefix = '/auth';

module.exports = function (router, passport) {

	router.route('/logout')

		// Logout
		.all(function (req, res) {
			req.logout();
			ResponseService.success(res);
		});

	if(Config.strategies.local.enabled) {
		router.route(api_prefix + '/signup')

			// Signup local
			.post(function (req, res, next) {

				Logger.debug('[WSP - VALID] SessionRoute#post');
				Logger.debug('              -- req.body.surname   : ' + req.body.surname);
				Logger.debug('              -- req.body.firstname : ' + req.body.firstname);
				Logger.debug('              -- req.body.email     : ' + req.body.email);
				Logger.debug('              -- req.body.password  : ' + req.body.password);

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

				if(!Validator.isEmail(req.body.email)) {
					return next(new Exception.MetierEx('Param invalid', [ 'email' ]));
				}

				next();

			}, function (req, res, next) {
				SessionService.authenticate(req, res, next, passport, 'local-signup');

			}, function (req, res) {
				ResponseService.success(res);
			});

		router.route(api_prefix + '/login')

			// Login local
			.post(function (req, res, next) {

				Logger.debug('[WSP - VALID] SessionRoute#post');
				Logger.debug('              -- req.body.email     : ' + req.body.email);
				Logger.debug('              -- req.body.password  : ' + req.body.password);

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

				if(!Validator.isEmail(req.body.email)) {
					return next(new Exception.MetierEx('Param invalid', [ 'email' ]));
				}
				next();

			}, function (req, res, next) {
				SessionService.authenticate(req, res, next, passport, 'local-login');

			}, function (req, res, next) {
				SessionService.login(req, res, next);

			}, function (req, res) {
				ResponseService.success(res, {
					result : req.user
				});
			});
	}

	if(Config.strategies.facebook.enabled) {
		router.route(api_prefix + '/facebook')

			// Login facebook
			.get(passport.authenticate('facebook', { scope : 'email' }));

		router.route(api_prefix + '/facebook/callback')

			// Login facebook callback
			.get(function (req, res, next) {
				SessionService.authenticate(req, res, next, passport, 'facebook');

			}, function (req, res, next) {
				SessionService.login(req, res, next);

			}, function (req, res) {
				ResponseService.success(res, {
					result : req.user
				});
			});
	}
};