//Inject services
var responseService = require(global.__service + '/ResponseService');

// Properties
var api_prefix = '/me';

module.exports = function(router) {

	router.route(api_prefix)

	// User token information
	.get(function(req, res) {
		return res.json(responseService.success('Get success', req.decoded));
	});
};