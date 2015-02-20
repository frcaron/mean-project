var jwt = require('jsonwebtoken');
var tokenUtils = require('./../../config/tokenUtils');

module.exports = function(router) {

	// =========================================================================================
	// Param validation ========================================================================
	// =========================================================================================
	
	// Validate param plan_id
	router.param('plan_id', function(req, res, next, plan_id) {
		if(!plan_id) {
			return res.json({ success : false, message : 'Param plan id missing' });
		}
		next();
	});
	
	// Validate param program_id
	router.param('program_id', function(req, res, next, program_id) {
		if(!program_id) {
			return res.json({ success : false, message : 'Param program id missing' });
		}
		next();
	});
	
	// Validate param transaction_id
	router.param('transaction_id', function(req, res, next, transaction_id) {
		if(!transaction_id) {
			return res.json({ success : false, message : 'Param transaction id missing' });
		}
		next();
	});
	
	// Validate param category_id
	router.param('category_id', function(req, res, next, category_id) {
		if(!category_id) {
			return res.json({ success : false, message : 'Param category id missing' });
		}
		next();
	});
	
	// Validate param type_category_id
	router.param('type_category_id', function(req, res, next, type_category_id) {
		if(!type_category_id) {
			return res.json({ success : false, message : 'Param type category id missing' });
		}
		next();
	});

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
					return res.status(403).json({ success : false, message : 'Session expired' });
				} else {
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

	require('./api/plan')(router);
	require('./api/program')(router);
	require('./api/transaction')(router);
	require('./api/category')(router);
	require('./api/typecategory')(router);
	require('./api/me')(router);
};