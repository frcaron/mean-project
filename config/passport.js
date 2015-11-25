"use strict";

// Inject
var UserDao = require(global.__dao + '/UserDao');

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        UserDao.getOne({ user_id : id })
            .then(function(user) {
                done(null, {
                    id    : user._id,
                    name  : user.facebook.displayname || user.firstname + ' ' + user.surname,
                    email : user.local ? user.local.email : undefined,
                    admin : user.admin
                });
            })
            .catch(function (err) {
                done(err);
            });
    });

    require('./strategies/local')(passport);
    require('./strategies/facebook')(passport);
};