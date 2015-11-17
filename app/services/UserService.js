"use strict";

// Inject
var BPromise        = require('bluebird');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_trans + '/ResponseService');
var UserDao         = require(global.__dao + '/UserDao');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TransactionDao  = require(global.__dao + '/TransactionDao');
var TypeCategoryDao = require(global.__dao + '/TypeCategoryDao');

module.exports = {

    // Create one user
    create           : function (req, res) {

        Logger.debug('UserService#create - [start]');

        let inputUser = {
            firstname : req.body.firstname,
            surname   : req.body.surname,
            email     : req.body.email,
            password  : req.body.password,
            admin     : req.body.admin // TODO delete after test
        };

        UserDao.create(inputUser)
            .then(function (user) {
                return TypeCategoryDao.getAll()
                    .then(function (typeCategories) {
                        return BPromise.map(typeCategories, function (typeCategory) {

                                let inputCategory = {
                                    name   : 'Autres',
                                    _type  : typeCategory._id,
                                    active : false,
                                    _user  : user._id
                                };
                                return CategoryDao.create(inputCategory);
                            });
                    })
                    .then(function() {
                        return BPromise.resolve(user);
                    })
                    .catch(function (err) {
                        UserDao.remove({ id : user._id });
                        throw err;
                    });
            })
            .then(function (user) {
                ResponseService.success(res, {
                    message :'Add user', 
                    result  : user 
                });
            })
            .catch(function (err) {
                Logger.error('UserService#create | ' + err.message);

                ResponseService.fail(res, {
                    message : 'Add user'
                });
            });

        Logger.debug('UserService#create - [end]');
    },

    // Update one user
    update           : function (req, res, user_id) {

        Logger.debug('UserService#update - [start]');

        let input = {
            _id       : user_id,
            firstname : req.body.firstname,
            surname   : req.body.surname,
            email     : req.body.email,
            password  : req.body.password,
            admin     : req.body.admin // TODO delete after test
        };

        UserDao.update(input)
            .then(function (user) {
                ResponseService.success(res, {
                    message : 'Update user', 
                    result  : user
                });
            })
            .catch(function (err) {
                Logger.error('UserService#update | ' + err.message);

                ResponseService.fail(res, {
                    message : 'Update user'
                });
            });

        Logger.debug('UserService#update - [end]');
    },

    // Remove one user
    remove           : function (req, res, user_id) {

        Logger.debug('UserService#remove - [start]');

        let msg = [];
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
            ResponseService.success(res, {
                    message : 'Remove user', 
                    result  : msg.toString()
                });                 
        })        
        .catch(function (err) { 
            Logger.error('UserService#remove | ' + err.message);

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
                ResponseService.success(res, {
                    message : 'Get all users', 
                    result  : users
                });
            })
            .catch(function(err) {
                Logger.error('UserService#getAll | ' + err.message);

                ResponseService.fail(res, {
                    message : 'Get all users'
                });
            });

        Logger.debug('UserService#getAll - [end]');
    },

    // Get one user by id
    getOne           : function (req, res, user_id) {

        Logger.debug('UserService#getOne - [start]');

        UserDao.getOne({
                id : user_id
            })
            .then(function(user) {
                ResponseService.success(res, {
                    message : 'Get user', 
                    result  : user
                });
            })
            .catch(function(err) {
                Logger.error('UserService#getOne | ' + err.message);

                ResponseService.fail(res, {
                    message : 'Get user'
                });
            });

        Logger.debug('UserService#getOne - [end]');
    },

    // Set permission
    managePermission : function (req, res, user_id) {

        Logger.debug('UserService#managePermission - [start]');

        let input = {
            _id    : user_id,
            admin : req.body.admin
        };

        UserDao.update(input)
            .then(function() {
                ResponseService.success(res, {
                    message : 'Give rights'
                });
            })
            .catch(function(err) {
                Logger.error('UserService#managePermission |Ò ' + err.message);

                ResponseService.fail(res, {
                    message : 'Give rights'
                });
            });

        Logger.debug('UserService#managePermission - [end]');
    }
};