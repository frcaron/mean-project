"use strict";

// Inject
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');

module.exports = {

	// Signup user
	auth : function (req, res, passport, startegy) {

		Logger.debug('[SER - START] SessionService#auth');
		Logger.debug('              -- startegy : ' + startegy);

		passport.authenticate(startegy, { failureFlash: true }, function (err, user, info) {
			if(err) {
				Logger.debug('[SER - CATCH] SessionService#auth');
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
					Logger.debug('[SER - CATCH] SessionService#auth');
					Logger.error('              -- message : ' + err.message);

					return ResponseService.fail(res);
				}
				ResponseService.success(res, {
					result : user
				});
			});
		})(req, res);

		Logger.debug('[SER -   END] SessionService#auth');
	}
};