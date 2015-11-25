"use strict";

// Inject
var LocalStrategy = require('passport-local').Strategy;
var Exception     = require(global.__server + '/ExceptionManager');
var BudgetService = require(global.__service + '/share/BudgetService');
var UserDao       = require(global.__dao + '/UserDao');

module.exports = function(passport) {

	// =========================================================================
	// LOCAL SIGNUP ============================================================
	// =========================================================================

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true

	}, function(req, email, password, done) {
		process.nextTick(function() {
			UserDao.getOne({ email : email })
				.then( function() {
					return done(null, false, req.flash('signupMessage', 'That email is already taken'));
				})
				.catch(Exception.NoResultEx, function () {
					return BudgetService.createUser({
				            firstname : req.body.firstname,
				            surname   : req.body.surname,
				            email     : email,
				            password  : password
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
	// LOCAL LOGIN =============================================================
	// =========================================================================

	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		UserDao.validatePassword(email, password)
			.then(function (user) {
				return done(null, user);
			})
			.catch(Exception.MetierEx, function (err) {
				return done(null, false, req.flash('loginMessage', err.message));
			})
			.catch(function (err) {
				return done(err);
			});

	}));
};