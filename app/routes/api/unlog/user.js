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
				return res.json(responseService.fail('Add failed', 'Param "name" missing'));
			}
			if (!req.body.username) {
				return res.json(responseService.fail('Add failed', 'Param "username" missing'));
			}
			if (!req.body.password) {
				return res.json(responseService.fail('Add failed', 'Param "password" missing'));
			}

			userService.create(req, res);
		});
};