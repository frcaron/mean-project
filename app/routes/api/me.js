
module.exports = function(router) {
	
	router.route('/me')
		
		// User token information
		.get(function(req, res) {
			res.send(req.decoded);
		});
};