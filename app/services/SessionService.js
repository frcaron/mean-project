"use strict";

// Inject
var Jwt             = require('jsonwebtoken');
var TokenConfig     = require(global.__config + '/token');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service + '/ResponseService');
var UserDao         = require(global.__dao + '/UserDao');

module.exports = {

	// Authenticate user
	login : function (req, res) {
		UserDao.validatePassword(req.body.email, req.body.password)
			.then(function (user){

				// Generate token
				var token = Jwt.sign({
					id        : user._id,
					surname   : user.surname,
					firstname : user.firstname,
					email     : user.email,
					admin     : user.admin
				}, TokenConfig.secret, {
					expiresMinutes : 1440
				});

				return ResponseService.success(res, 'Authentication success', token);
			})
			.catch(function (err) {
				return ResponseService.fail(res, 'Authentication failed', err.message);
			});
	}
};