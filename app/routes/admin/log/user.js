//Inject services
var responseService = require(global.__service + '/ResponseService');
var userService = require(global.__service + '/UserService');

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all users
		.get(function(req, res) {
			userService.all(req, res);
		});

	router.route(api_prefix + '/:user_id')

		// Update one user
		.put(function (req, res) {

			if (!req.params.user_id) {
				return res.json(responseService.fail('Give permission failed', 'Param "user_id" missing'));
			}

			userService.giveAdmin(req, res);
		});
};