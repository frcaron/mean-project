// Inject application
var jwt = require('jsonwebtoken');
var tokenConfig = require(global.__config + '/token');

module.exports = function (router) {

	// =========================================================================================
	// Public
	// =========================================================================================

	// =========================================================================================
	// Middleware
	// =========================================================================================

	// Token verification
	router.use(function (req, res, next) {

		var token = req.body.token || req.param('token') || req.headers[ 'x-access-token' ];

		if (token) {
			jwt.verify(token, tokenConfig.secret, function (err, decoded) {
				if (!err) {
					req.decoded = decoded;
				}
			});
		}

		next();
	});

	// =========================================================================================
	// Private
	// =========================================================================================

};