// Inject application
var jwt = require('jsonwebtoken');
var tokenConfig = require(global.__config + '/token');

// Inject models
var UserModel = require(global.__model + '/UserModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Authenticate user
	login : function (req, res) {

		// Query find user by username
		UserModel.findOne({
			username : req.body.username
		}).select('_id name username password admin').exec(function (err, user) {
			if (err) {
				return responseService.fail(res, 'Authentication failed', err.message);
			}
			if (!user) {
				return responseService.fail(res, 'Authentication failed', 'User not found');
			}

			var validPassword = user.comparePassword(req.body.password);
			if (!validPassword) {
				return responseService.fail(res, 'Authentication failed', 'Wrong password');
			}

			// Generate token
			var token = jwt.sign({
				id       : user._id,
				name     : user.name,
				username : user.username,
				admin    : user.admin
			}, tokenConfig.secret, {
				expiresMinutes : 1440
			});

			return responseService.success(res, 'Authentication success', token);
		});
	}
};