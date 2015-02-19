var api_prefix = '/me'; 

module.exports = function(router) {
	
	router.route(api_prefix)
		
		// User token information
		.get(function(req, res) {
			return res.json(req.decoded);
		});
};