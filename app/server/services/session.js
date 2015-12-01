"use strict";

// Inject
var Path      = require('path');
var Exception = require(Path.join(global.__server, 'ExceptionManager'));
var Logger    = require(Path.join(global.__core, 'system')).Logger;

module.exports = {

	// Authenticate user
	authenticate (req, res, next, passport, startegy) {

		Logger.debug('[SER - START] SessionService#authenticate');
		Logger.debug('              -- startegy : ' + startegy);

		passport.authenticate(startegy, { failureFlash: true }, function (err, user, info) {
			if(err) {
				return next(err);
			}

			if(!user) {
				if(info) {
					return next(new Exception.MetierEx('Param missing', info.message));
				}
				return next(new Exception.MetierEx(req.flash('authMessage')[0]));
			}

			req.result = user;
			next();

		})(req, res);

		Logger.debug('[SER -   END] SessionService#authenticate');
	},

	// Authorize user
	authorize (req, res, next, passport, startegy) {

		Logger.debug('[SER - START] SessionService#authorize');
		Logger.debug('              -- startegy : ' + startegy);

		passport.authorize(startegy, { failureFlash: true }, function (err, user, info) {
			if(err) {
				return next(err);
			}

			if(!user) {
				if(info) {
					return next(new Exception.MetierEx('Param missing', info.message));
				}
				return next(new Exception.MetierEx(req.flash('authMessage')[0]));
			}

			req.result = user;
			next();

		})(req, res);

		Logger.debug('[SER -   END] SessionService#authorize');

	},

	// Login user
	login (req, res, next) {

		Logger.debug('[SER - START] SessionService#login');

		req.login(req.result, function(err) {
			if(err){
				return next(err);
			}
			next();
		});

		Logger.debug('[SER -   END] SessionService#login');
	},

	deleteToken (req, next, provider) {

		Logger.debug('[SER - START] SessionService#unlink');
		Logger.debug('              -- provider : ' + provider);

		// TODO delete token user
		next();

		Logger.debug('[SER -   END] SessionService#unlink');

	}
};