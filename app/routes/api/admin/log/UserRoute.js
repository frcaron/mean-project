//Inject
var ResponseService = require(global.__service + '/ResponseService');
var UserService     = require(global.__service + '/UserService');

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all users
		.get(function (req, res) {
			UserService.getAll(req, res);
		});

	router.route(api_prefix + '/:user_id')

		// Update one user
		.put(function (req, res) {

			if (!req.params.user_id) {
				return ResponseService.fail(res, 'Give permission failed', 'Param "user_id" missing');
			}

			UserService.giveAdmin(req, res);
		})

		// Delete one user
		.delete(function (req, res) {
			UserService.remove(req, res, req.params.user_id);
		});
};