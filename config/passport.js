"use strict";

// Inject
var Path    = require('path');
var UserDao = require(Path.join(global.__dao, 'user'));
var Logger  = require(Path.join(global.__core, 'system')).Logger;

module.exports = function(passport) {

	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {

		Logger.debug('[PAS - START] passport#serializeUser');
		Logger.debug('              -- user.id : ' + user.id);

		done(null, user.id);

		Logger.debug('[PAS -   END] passport#serializeUser');
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {

		Logger.debug('[PAS - START] passport#deserializeUser');
		Logger.debug('              -- user.id : ' + id);

		UserDao.getOne('byId', { user_id : id })
			.then(function(user) {
				done(null, {
					id       : user._id,
					name     : user.displayname || user.firstname + ' ' + user.surname,
					email    : user.local ? user.local.email ||
						user.facebook ? user.facebook.email : undefined : undefined,
					verified : user.verified,
					admin    : user.admin
				});
			})
			.catch(function (err) {
				Logger.debug('[PAS - CATCH] passport#deserializeUser');
				Logger.error('              -- message : ' + err.message);

				return done(err);
			});

		Logger.debug('[PAS -   END] passport#deserializeUser');
	});

	require('./strategies/local')(passport);
	require('./strategies/facebook')(passport);
};