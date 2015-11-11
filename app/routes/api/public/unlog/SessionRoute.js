//Inject 
var ResponseService = require(global.__service + '/ResponseService');
var SessionService  = require(global.__service + '/SessionService');

// Properties
var api_prefix = '/authenticate';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all type category
		.post(function (req, res) {

			// Validation
			if (!req.body.email) {
				return ResponseService.fail(res, 'Authentication failed',
					'Param "email" missing');
			}
			if (!req.body.password) {
				return ResponseService.fail(res, 'Authentication failed',
					'Param "password" missing');
			}

			SessionService.login(req, res);
		});
};