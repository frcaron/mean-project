"use strict";

// Inject
var BPromise        = require('bluebird');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service + '/ResponseService');
var UserDao         = require(global.__dao + '/UserDao');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TransactionDao  = require(global.__dao + '/TransactionDao');

module.exports = {

    // Create one user
    create           : function (req, res) {

        Logger.debug('UserService#create - [start]');

        var input = {
            firstname : req.body.firstname,
            surname   : req.body.surname,
            email     : req.body.email,
            password  : req.body.password,
            admin     : req.body.admin // TODO delete after test
        };

        UserDao.create(input)
            .then(function(user) {
                ResponseService.success(res, 'Add user', user);
            })
            .catch(function(err) {
                Logger.error('UserService#create / ' + err.message);

                ResponseService.fail(res, {
                    message : 'Add user'
                });
            });

        Logger.debug('UserService#create - [end]');
    },

    // Update one user
    update           : function (req, res, user_id) {

        Logger.debug('UserService#update - [start]');

        var input = {
            id        : user_id,
            firstname : req.body.firstname,
            surname   : req.body.surname,
            email     : req.body.email,
            password  : req.body.password,
            admin     : req.body.admin // TODO delete after test
        };

        UserDao.update(input)
            .then(function(user) {
                ResponseService.success(res, 'Update user', user);
            })
            .catch(function(err) {
                Logger.error('UserService#update / ' + err.message);

                ResponseService.fail(res, {
                    message : 'Update user'
                });
            });

        Logger.debug('UserService#update - [end]');
    },

    // Remove one user
    remove           : function (req, res, user_id) {

        Logger.debug('UserService#remove - [start]');

        var msg = [];
        BPromise.map([UserDao, PlanDao, ProgramDao, CategoryDao, TransactionDao], 
            function(dao) {
                return dao.remove({ user_id : user_id })
                        .then(function () {
                           msg.push(' [Success]' + dao.name);
                        })
                        .catch(function (err) {
                           msg.push(' [Failed]' + dao.name + ' / ' + err.message);
                        });
            })                                  
        .then(function() {
            ResponseService.success(res, 'Remove user', msg.toString());                 
        })        
        .catch(function (err) { 
            Logger.error('UserService#remove / ' + err.message);

            ResponseService.fail(res, {
                message : 'Remove user'
            });
        });

        Logger.debug('UserService#remove - [end]');
    },

    // Get all users
    getAll           : function (req, res) {

        Logger.debug('UserService#getAll - [start]');

        UserDao.getAll()
            .then(function(users) {
                ResponseService.success(res, 'Get all uses', users);
            })
            .catch(function(err) {
                Logger.error('UserService#getAll / ' + err.message);

                ResponseService.fail(res, {
                    message : 'Get all users'
                });
            });

        Logger.debug('UserService#getAll - [end]');
    },

    // Get one user by id
    getOne           : function (req, res, user_id) {

        Logger.debug('UserService#getOne - [start]');

        var filters = {
            id : user_id
        };

        UserDao.getOne(filters)
            .then(function(user) {
                ResponseService.success(res, 'Get user', user);
            })
            .catch(function(err) {
                Logger.error('UserService#getOne / ' + err.message);

                ResponseService.fail(res, {
                    message : 'Get user'
                });
            });

        Logger.debug('UserService#getOne - [end]');
    },

    // Set permission
    managePermission : function (req, res, user_id) {

        Logger.debug('UserService#managePermission - [start]');

        var input = {
            id    : user_id,
            admin : req.body.admin
        };

        UserDao.update(input)
            .then(function() {
                ResponseService.success(res, 'Give rights');
            })
            .catch(function(err) {
                Logger.error('UserService#managePermission / ' + err.message);

                ResponseService.fail(res, {
                    message : 'Give rights'
                });
            });

        Logger.debug('UserService#managePermission - [end]');
    }
};