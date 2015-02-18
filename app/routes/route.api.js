
var jwt = require('jsonwebtoken');
var tokenUtils = require('./../../config/tokenUtils');

module.exports = function(router) {

	// =========================================================================================
	// Public ==================================================================================
	// =========================================================================================
	
	require('./api/session')(router);

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
					// Follow token
					req.decoded = decoded;
					
					next();
				}
			});
		} else {
			return res.status(403).send({ success : false, message : 'No session' });
		}
	});

	// =========================================================================================
	// Private =================================================================================
	// =========================================================================================
	
	require('./api/me')(router);
};