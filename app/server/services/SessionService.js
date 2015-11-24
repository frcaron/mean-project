"use strict";

// Inject
var Jwt             = require('jsonwebtoken');
var TokenConfig     = require(global.__config + '/token');
var ExManager       = require(global.__server + '/ExceptionManager');
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var UserDao         = require(global.__dao + '/UserDao');

module.exports = {

	// Authenticate user
	login : function (req, res) {

		Logger.debug('[SER - START] SessionService#login');

		UserDao.validatePassword(req.body.email, req.body.password)
			.then(function (user){

				// Generate token
				let token = Jwt.sign({
					user_id   : user._id,
					surname   : user.surname,
					firstname : user.firstname,
					email     : user.email,
					admin     : user.admin
				}, TokenConfig.secret, {
					expiresMinutes : 1440
				});

				ResponseService.success(res, {
					result  : token
				});
			})
			.catch(ExManager.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] SessionService#login');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] SessionService#login');
	}
};