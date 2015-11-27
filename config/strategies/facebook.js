"use strict";

// Inject
var FacebookStrategy = require('passport-facebook').Strategy;
var Exception        = require(global.__server  + '/ExceptionManager');
var BudgetService    = require(global.__service + '/share/BudgetService');
var UserDao          = require(global.__dao     + '/UserDao');
var AuthConfig       = require(global.__config  + '/auth');

module.exports = function(passport) {

	// =========================================================================
	// FACEBOOK ================================================================
	// =========================================================================

	passport.use(new FacebookStrategy({
		clientID     : AuthConfig.facebookAuth.clientID,
		clientSecret : AuthConfig.facebookAuth.clientSecret,
		callbackURL  : AuthConfig.facebookAuth.callbackURL,
		passReqToCallback : true

	}, function(req, token, refreshToken, profile, done) {

		process.nextTick(function() {

			if (req.user) {

				// Link
				UserDao.update({
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

				UserDao.getOne('byFbId', { facebook_id : profile.id })
					.then(function (user) {

						// Re link
						return UserDao.update({
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
						return BudgetService.createUser({
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