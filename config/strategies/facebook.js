"use strict";

// Inject
var Path             = require('path');
var Url              = require('url');
var FacebookStrategy = require('passport-facebook').Strategy;
var BudgetService    = require(Path.join(global.__service, 'share'));
var UserDao          = require(Path.join(global.__dao, 'user'));
var Exception        = require(Path.join(global.__core, 'exception'));
var Config           = require(Path.join(global.__core, 'system')).Config;

module.exports = function(passport) {

	// =========================================================================
	// Facebook ================================================================
	// =========================================================================

	passport.use(new FacebookStrategy({
		clientID          : Config.strategies.facebook.clientID,
		clientSecret      : Config.strategies.facebook.clientSecret,
		callbackURL       : Url.resolve(Config.domain, Config.strategies.facebook.callbackURL),
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