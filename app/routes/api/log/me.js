//Inject services
var responseService = require(global.__service + '/ResponseService');

// Properties
var api_prefix = '/me';

module.exports = function (router) {

	router.route(api_prefix)

		// User token information
		.get(function (req, res) {
			return responseService.success(res, 'Get success', req.decoded);
		});
};