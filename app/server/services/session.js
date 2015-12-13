"use strict";

// Inject
var path      = require('path');
var jwt       = require('jsonwebtoken');
var Exception = require(path.join(global.__core, 'exception'));
var config    = require(path.join(global.__core, 'system')).Config;
var logger    = require(path.join(global.__core, 'logger'))('service', __filename);

module.exports = {

	// Authenticate user
	authenticate (req, res, next, passport, startegy) {

		logger.debug({ method : 'authenticate', point : logger.pt.start, params : { startegy : startegy } });

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

			logger.debug({ method : 'authenticate', point : logger.pt.end });

			next();

		})(req, res);
	},

	// Authorize user
	authorize (req, res, next, passport, startegy) {

		logger.debug({ method : 'authorize', point : logger.pt.start, params : { startegy : startegy } });

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

			logger.debug({ method : 'authorize', point : logger.pt.end });

			next();

		})(req, res);
	},

	// Login user
	login (req, res, next) {

		logger.debug({ method : 'login', point : logger.pt.start });

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

			logger.debug({ method : 'login', point : logger.pt.end });

			next();
		});
	},

	deleteToken (req, next, provider) {

		logger.debug({ method : 'deleteToken', point : logger.pt.start, params : { provider : provider } });

		// TODO delete token user

		logger.debug({ method : 'deleteToken', point : logger.pt.end });

		next();
	}
};