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
			if (!req.body.name) {
				return responseService.fail(res, 'Add failed', 'Param "name" missing');
			}
			if (!req.body.username) {
				return responseService.fail(res, 'Add failed', 'Param "username" missing');
			}
			if (!req.body.password) {
				return responseService.fail(res, 'Add failed', 'Param "password" missing');
			}

			userService.create(req, res);
		});
};