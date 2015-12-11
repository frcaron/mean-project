"use strict";

// Inject
var path    = require('path');
var userDao = require(path.join(global.__dao, 'user'));
var logger  = require(path.join(global.__core, 'system')).Logger;

module.exports = function(passport) {

	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {

		logger.debug('[PAS - START] passport#serializeUser');
		logger.debug('              -- user.id : ' + user.id);

		done(null, user.id);

		logger.debug('[PAS -   END] passport#serializeUser');
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {

		logger.debug('[PAS - START] passport#deserializeUser');
		logger.debug('              -- user.id : ' + id);

		userDao.getOne('byId', { user_id : id })
			.then(function(user) {
				done(null, {
					id       : user._id,
					name     : user.displayname || user.firstname + ' ' + user.surname,
					email    : user.local ? user.local.email || user.facebook ? user.facebook.email : undefined : undefined,
					verified : user.verified,
					admin    : user.admin
				});
			})
			.catch(function (err) {
				logger.debug('[PAS - CATCH] passport#deserializeUser');
				logger.error('              -- message : ' + err.message);

				return done(err);
			});

		logger.debug('[PAS -   END] passport#deserializeUser');
	});

	require('./strategies/local')(passport);
	require('./strategies/facebook')(passport);
};