"use strict";

// Inject
var path             = require('path');
var url              = require('url');
var facebookStrategy = require('passport-facebook').Strategy;
var shareService     = require(path.join(global.__service, 'share'));
var userDao          = require(path.join(global.__dao, 'user'));
var Exception        = require(path.join(global.__core, 'exception'));
var config           = require(path.join(global.__core, 'system')).Config;

module.exports = function(passport) {

	// =========================================================================
	// Facebook ================================================================
	// =========================================================================

	passport.use(new facebookStrategy({
		clientID          : config.strategies.facebook.clientID,
		clientSecret      : config.strategies.facebook.clientSecret,
		callbackURL       : url.resolve(config.domain, config.strategies.facebook.callbackURL),
		passReqToCallback : true

	}, function(req, token, refreshToken, profile, done) {

		process.nextTick(function() {

			if (req.user) {

				// Link
				userDao.update({
						user_id        : req.user.id,
						displayname    : profile.displayName,
						facebook_id    : profile.id,
						facebook_token : token,
						facebook_email : profile.emails ? profile.emails[0].value : undefined
					 })
					.then(function (user) {
						return done(null, user);
					})
					.catch(function (err) {
						return done(err);
					});

			} else {

				userDao.getOne('byFbId', { facebook_id : profile.id })
					.then(function (user) {

						// Re link
						return userDao.update({
								user_id        : user._id,
								displayname    : profile.displayName,
								facebook_token : token,
								facebook_email : profile.emails ? profile.emails[0].value : undefined
							 })
							.then(function (newUser) {
								return done(null, newUser);
							});
					})
					.catch(Exception.NoResultEx, function () {

						// Create
						return shareService.createUser({
								firstname      : profile.name.givenName,
								surname        : profile.name.familyName,
								displayname    : profile.displayName,
								verified       : true,
								facebook_id    : profile.id,
								facebook_token : token,
								facebook_email : profile.emails ? profile.emails[0].value : undefined
							})
							.then(function (user) {
								return done(null, user);
							});
					})
					.catch(function (err) {
						return done(err);
					});
				}
		});

	}));

};