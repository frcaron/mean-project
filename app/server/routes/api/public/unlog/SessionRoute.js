"use strict";

//Inject
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var SessionService  = require(global.__service + '/SessionService');

// Properties
var api_prefix = '/auth';

module.exports = function (router, passport) {

	router.route(api_prefix + '/signup')

		.post(function (req, res) {

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
				return ResponseService.fail(res, {
					reason : 'Param missing',
					detail : msg
				});
			}

			SessionService.signup(req, res, passport);
		});

	router.route(api_prefix + '/login')

		.post(function (req, res) {

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
				return ResponseService.fail(res, {
					reason : 'Param missing',
					detail : msg
				});
			}

			SessionService.login(req, res, passport);
		});

	router.route(api_prefix + '/logout')

		.post(function (req, res) {
			SessionService.logout(req, res);
		});

};