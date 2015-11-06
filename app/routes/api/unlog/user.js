//Inject services
var responseService = require(global.__service + '/ResponseService');
var userService = require(global.__service + '/UserService');

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Create new user
		.post(function (req, res) {

			// Validation
			if (!req.body.surname) {
				return responseService.fail(res, 'Add failed', 'Param "surname" missing');
			}
			if (!req.body.firstname) {
				return responseService.fail(res, 'Add failed', 'Param "firstname" missing');
			}
			if (!req.body.email) {
				return responseService.fail(res, 'Add failed', 'Param "email" missing');
			}
			if (!req.body.password) {
				return responseService.fail(res, 'Add failed', 'Param "password" missing');
			}

			userService.create(req, res);
		});
};