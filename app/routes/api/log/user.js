//Inject services
var responseService = require(global.__service + '/ResponseService');
var userService = require(global.__service + '/UserService');

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Get one user
		.get(function (req, res) {
			userService.getById(req, res);
		})

		// Update one user
		.put(function (req, res) {
			userService.update(req, res);
		})

		// Delete one user
		.delete(function (req, res) {
			userService.remove(req, res, req.decoded.id);
		});
};