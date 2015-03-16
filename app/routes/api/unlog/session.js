//Inject services
var responseService = require(global.__service + '/ResponseService');
var sessionService = require(global.__service + '/SessionService');

// Properties
var api_prefix = '/authenticate';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all type category
		.post(function (req, res) {

			// Validation
			if (!req.body.username) {
				return res.json(responseService.fail('Authentication failed',
					'Param "username" missing'));
			}
			if (!req.body.password) {
				return res.json(responseService.fail('Authentication failed',
					'Param "password" missing'));
			}

			sessionService.login(req, res);
		});
};