"use strict";

//Inject
var Validator       = require('validator');
var Exception       = require(global.__server  + '/ExceptionManager');
var Logger          = require(global.__server  + '/LoggerManager');
var ResponseService = require(global.__service + '/ResponseService');
var SessionService  = require(global.__service + '/SessionService');

// Properties
var api_prefix = '/auth';

module.exports = function (router, passport) {

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

	router.route(api_prefix + '/logout')

		// Logout
		.post(function (req, res) {
			req.logout();
			ResponseService.success(res);
		});

};