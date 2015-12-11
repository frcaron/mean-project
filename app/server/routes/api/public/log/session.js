"use strict";

//Inject
var path            = require('path');
var responseService = require(path.join(global.__service, 'response'));
var sessionService  = require(path.join(global.__service, 'session'));

// Properties
var api_prefix_link   = '/link';
var api_prefix_unlink = '/unlink';

module.exports = function (router, passport, auth) {

	router.route(api_prefix_link + '/facebook')

		.get(auth, function (req, res, next) {
			sessionService.authorize(req, res, next, passport, 'facebook');

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix_unlink + '/facebook')

		.get(auth, function (req, res, next) {
			sessionService.deleteToken(req, next, 'facebook');

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});
};