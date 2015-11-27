"use strict";

//Inject
var ResponseService = require(global.__service + '/ResponseService');
var SessionService  = require(global.__service + '/SessionService');

// Properties
var api_prefix_link   = '/link';
var api_prefix_unlink = '/unlink';

module.exports = function (router, passport) {

	router.route(api_prefix_link + '/facebook')

		.get(function (req, res, next) {
			SessionService.authorize(req, res, next, passport, 'facebook');

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix_unlink + '/facebook')

		.get(function (req, res, next) {
			SessionService.deleteToken(req, next, 'facebook');

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});
};