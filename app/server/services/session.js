"use strict";

// Inject
var path      = require('path');
var jwt       = require('jsonwebtoken');
var Exception = require(path.join(global.__core, 'exception'));
var config    = require(path.join(global.__core, 'system')).Config;
var logger    = require(path.join(global.__core, 'system')).Logger;

module.exports = {

	// Authenticate user
	authenticate (req, res, next, passport, startegy) {

		logger.debug('[SER - START] SessionService#authenticate');
		logger.debug('              -- startegy : ' + startegy);

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

		logger.debug('[SER -   END] SessionService#authenticate');
	},

	// Authorize user
	authorize (req, res, next, passport, startegy) {

		logger.debug('[SER - START] SessionService#authorize');
		logger.debug('              -- startegy : ' + startegy);

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

		logger.debug('[SER -   END] SessionService#authorize');

	},

	// Login user
	login (req, res, next) {

		logger.debug('[SER - START] SessionService#login');

		let user = req.result;
		req.login(user, function(err) {
			if(err){
				return next(err);
			}

			// Generate token
			let token = jwt.sign({
				id : user._id
			}, config.session.secret, {
				expiresMinutes : config.session.delay
			});
			req.result = token;

			next();
		});

		logger.debug('[SER -   END] SessionService#login');
	},

	deleteToken (req, next, provider) {

		logger.debug('[SER - START] SessionService#unlink');
		logger.debug('              -- provider : ' + provider);

		// TODO delete token user
		next();

		logger.debug('[SER -   END] SessionService#unlink');

	}
};