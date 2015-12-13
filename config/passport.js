"use strict";

// Inject
var path    = require('path');
var userDao = require(path.join(global.__dao, 'user'));
var logger  = require(path.join(global.__core, 'logger'))('session', __filename);

module.exports = function(passport) {

	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {

		logger.debug({ method : 'serializeUser', point : logger.pt.start, params : { 'user.id' : user.id } });

		done(null, user.id);

		logger.debug({ method : 'serializeUser', point : logger.pt.end });
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {

		logger.debug({ method : 'deserializeUser', point : logger.pt.start, params : { 'user.id' : id } });

		userDao.getOne('byId', { user_id : id })
			.then(function(user) {
				logger.debug({ method : 'deserializeUser', point : logger.pt.end });

				done(null, {
					id       : user._id,
					name     : user.displayname || user.firstname + ' ' + user.surname,
					email    : user.local ? user.local.email || user.facebook ? user.facebook.email : undefined : undefined,
					verified : user.verified,
					admin    : user.admin
				});

				return null;
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'deserializeUser', point : logger.pt.catch });

				done(err);
				return null;
			});
	});

	require('./strategies/local')(passport);
	require('./strategies/facebook')(passport);
};