"use strict";

//Inject
var ResponseService = require(global.__service + '/share/ResponseService');

// Properties
var api_prefix = '/me';

module.exports = function (router) {

	router.route(api_prefix)

		// User token information
		.get(function (req, res) {
			return ResponseService.success(res, {
				message : 'Get success',
				result  : req.user
			});
		});
};