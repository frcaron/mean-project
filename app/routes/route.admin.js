// Inject application
var jwt = require('jsonwebtoken');
var tokenConfig = require(global.__config + '/token');

module.exports = function(router) {

	// =========================================================================================
	// Param validation ========================================================================
	// =========================================================================================
	
	// Validate param user_id
	router.param('user_id', function(req, res, next, user_id) {
		if(!user_id) {
			return res.json({ success : false, message : 'Param "user_id" missing' });
		}
		next();
	});
	
	// Validate param type_category_id
	router.param('type_category_id', function(req, res, next, type_category_id) {
		if(!type_category_id) {
			return res.json({ success : false, message : 'Param "type_category_id" missing' });
		}
		next();
	});

	// TODO move private
	require('./admin/user')(router);
	
	// =========================================================================================
	// Middleware ==============================================================================
	// =========================================================================================

	// Token verification
	router.use(function(req, res, next) {
		
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];
		
		if(token) {
			jwt.verify(token, tokenConfig.secret, function(err, decoded) {
				if(err) {
					return res.status(403).send({ success : false, message : 'Session expired' });
				} else {
					
					// Admin access
					if(!decoded.admin) {
						return res.status(403).json({ success : false, message : 'Permission refused' });
					}
					
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
	
	require('./admin/typecategory')(router);
};