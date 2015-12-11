"use strict";

// Inject
var path          = require('path');
var localStrategy = require('passport-local').Strategy;
var shareService  = require(path.join(global.__service, 'share'));
var userDao       = require(path.join(global.__dao, 'user'));
var Exception     = require(path.join(global.__core, 'exception'));

module.exports = function(passport) {

	// =========================================================================
	// Local signup ============================================================
	// =========================================================================

	passport.use('local-signup', new localStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true

	}, function(req, email, password, done) {

		process.nextTick(function() {
			userDao.getOne('byEmail', { local_email : email })
				.then( function() {
					return done(null, false, req.flash('authMessage', 'That email is already taken'));
				})
				.catch(Exception.NoResultEx, function () {
					return shareService.createUser({
				            firstname      : req.body.firstname,
				            surname        : req.body.surname,
				            displayname    : req.body.firstname + ' ' +  req.body.surname,
				            local_email    : email,
				            local_password : password,
				            local_active   : true
				        })
						.then(function (user) {
							return done(null, user);
						});
				})
				.catch(function (err) {
					return done(err);
				});
		});
	}));

	// =========================================================================
	// Local login =============================================================
	// =========================================================================

	passport.use('local-login', new localStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true

	}, function(req, email, password, done) {

		userDao.validatePassword(email, password)
			.then(function (user) {
				if(user.local && !user.local.active) {
					return done(null, false, req.flash('authMessage', 'Login local not activate'));
				}
				return done(null, user);
			})
			.catch(Exception.MetierEx, function (err) {
				return done(null, false, req.flash('authMessage', err.message));
			})
			.catch(function (err) {
				return done(err);
			});
	}));
};