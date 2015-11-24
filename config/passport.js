"use strict";

// Inject
var Passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserModel     = require(global.__model + '/UserModel');

module.exports = function() {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================

    // used to serialize the user for the session
    Passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    Passport.deserializeUser(function(id, done) {
        UserModel.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    UserModel.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req, email, password, done) {

        process.nextTick(function() {

            UserModel.findOne({ 'local.email' :  email }, function(err, user) {

                // if there are any errors, return the error before anything else
                if (err) {
                    return done(err);
                }

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken'));
                } else {

                    let newUser = new UserModel();
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        } else {
                            return done(null, newUser);
                        }
                    });
                }
            });
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    Passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        UserModel.findOne({ 'local.email' :  email }, function(err, user) {

            // if there are any errors, return the error before anything else
            if (err) {
                return done(err);
            }

            // if no user is found, return the message
            if (!user){
                return done(null, false, req.flash('loginMessage', 'No user found'));
            }

            // if the user is found but the password is wrong
            if (!user.comparePassword(password)){
                return done(null, false, req.flash('loginMessage', 'Wrong password'));
            } else {
                return done(null, user);
            }
        });

    }));
};