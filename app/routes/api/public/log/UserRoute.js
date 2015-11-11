//Inject 
var UserService     = require(global.__service + '/UserService');

// Properties
var api_prefix = '/users';

module.exports = function (router) {

	router.route(api_prefix)

		// Get one user
		.get(function (req, res) {
			UserService.getOne(req, res, req.decoded.id);
		})

		// Update one user
		.put(function (req, res) {
			UserService.update(req, res, req.decoded.id);
		})

		// Delete one user
		.delete(function (req, res) {
			UserService.remove(req, res, req.decoded.id);
		});
};