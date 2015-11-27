"use strict";

//Inject
var Logger            = require(global.__server  + '/LoggerManager');
var ResponseService   = require(global.__service + '/share/ResponseService');
var SessionService    = require(global.__service + '/SessionService');

// Properties
var api_prefix_link   = '/link';
var api_prefix_unlink = '/unlink';

module.exports = function (router, passport) {

	router.route(api_prefix_link + '/facebook')

		.get(function (req, res) {

		});

	router.route(api_prefix_unlink + '/facebook')

		.get(function (req, res) {

		});
};