"use strict";

// Inject
var Jwt             = require('jsonwebtoken');
var TokenConfig     = require(global.__config + '/token');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_trans + '/ResponseService');
var UserDao         = require(global.__dao + '/UserDao');

module.exports = {

	// Authenticate user
	login : function (req, res) {

		Logger.debug('SessionService#login - [start]');

		UserDao.validatePassword(req.body.email, req.body.password)
			.then(function (user){

				// Generate token
				let token = Jwt.sign({
					id        : user._id,
					surname   : user.surname,
					firstname : user.firstname,
					email     : user.email,
					admin     : user.admin
				}, TokenConfig.secret, {
					expiresMinutes : 1440
				});

				return ResponseService.success(res, {
					message : 'Authentication', 
					result  : token
				});
			})
			.catch(function (err) {
				Logger.debug('SessionService#login | ' + err.message);

				return ResponseService.fail(res, {
					message : 'Authentication'
				});
			});

		Logger.debug('SessionService#login - [end]');
	}
};