
var jwt = require('jsonwebtoken');
var tokenUtils = require('./../../config/tokenUtils');

module.exports = function(router) {
	
	// =========================================================================================
	// Middleware ==============================================================================
	// =========================================================================================

	// Token verification
	router.use(function(req, res, next) {
		
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];
		
		if(token) {
			jwt.verify(token, tokenUtils.secret, function(err, decoded) {
				if(err) {
					return res.status(403).send({ success : false, message : 'Session expired' });
				} else {
					
					// Admin access
					if(!decoded.admin) return res.status(403).json({ success : false, message : 'Permission refused' });
					
					// Follow token
					req.decoded = decoded;
					
					next();
				}
			});
		} else {
			return res.status(403).json({ success : false, message : 'No session' });
		}
	});

	// =========================================================================================
	// Private =================================================================================
	// =========================================================================================
	
	require('./admin/user')(router);
	require('./admin/typecategory')(router);
};