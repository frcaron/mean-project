// Inject 
var Jwt             = require('jsonwebtoken');
var TokenConfig     = require(global.__config + '/token');

module.exports = function (router) {

	// =========================================================================================
	// Public
	// =========================================================================================

	// =========================================================================================
	// Middleware
	// =========================================================================================

	// Token verification
	router.use(function (req, res, next) {

		var token = req.body.token || req.params.token ||  req.query.token || req.headers[ 'x-access-token' ];

		if (token) {
			Jwt.verify(token, TokenConfig.secret, function (err, decoded) {
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