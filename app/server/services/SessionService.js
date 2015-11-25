"use strict";

// Inject
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');

module.exports = {

	// Save user
	signup : function (req, res,  passport) {

		Logger.debug('[SER - START] SessionService#signup');

		passport.authenticate('local-signup', { failureFlash: true }, function (err, user, info) {
			if(err) {
				Logger.debug('[SER - CATCH] SessionService#signup');
				Logger.error('              -- message : ' + err.message);

				return ResponseService.fail(res);
			}

			if(!user) {
				if(info) {
					return ResponseService.fail(res, {
						reason : info.message
					});
				}

				return ResponseService.fail(res, {
					reason : req.flash('signupMessage')[0]
				});
			}

			req.login(user, function(err){
				if(err){
					Logger.debug('[SER - CATCH] SessionService#signup');
					Logger.error('              -- message : ' + err.message);

					return ResponseService.fail(res);
				}
				ResponseService.success(res, {
					result : user
				});
			});
		})(req, res);

		Logger.debug('[SER -   END] SessionService#signup');
	},

	// Authenticate user
	login  : function (req, res, passport) {

		Logger.debug('[SER - START] SessionService#login');

		passport.authenticate('local-login', { failureFlash: true }, function (err, user, info) {
			if(err) {
				Logger.debug('[SER - CATCH] SessionService#login');
				Logger.error('              -- message : ' + err.message);

				return ResponseService.fail(res);
			}

			if(!user) {
				if(info) {
					return ResponseService.fail(res, {
						reason : info.message
					});
				}

				return ResponseService.fail(res, {
					reason : req.flash('loginMessage')[0]
				});
			}

			req.login(user, function(err){
				if(err){
					Logger.debug('[SER - CATCH] SessionService#login');
					Logger.error('              -- message : ' + err.message);

					return ResponseService.fail(res);
				}
				ResponseService.success(res, {
					result : user
				});
			});
		})(req, res);

		Logger.debug('[SER -   END] SessionService#login');
	},

	// Authenticate user
	logout  : function (req, res) {

		Logger.debug('[SER - START] SessionService#logout');

		req.logout();
		ResponseService.success(res);

		Logger.debug('[SER -   END] SessionService#logout');
	}
};