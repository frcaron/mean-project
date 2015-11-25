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
                    id        : user._id,
                    surname   : user.surname,
                    firstname : user.firstname,
                    email     : user.local.email || user.facebook.email,
                    admin     : user.admin
                });
            })
            .catch(function (err) {
                done(err);
            });
    });

    require('./strategies/local')(passport);
};