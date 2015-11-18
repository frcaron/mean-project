"use strict";

// Inject
var BPromise        = require('bluebird');
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_share + '/ResponseService');
var UserDao         = require(global.__dao + '/UserDao');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TransactionDao  = require(global.__dao + '/TransactionDao');
var TypeCategoryDao = require(global.__dao + '/TypeCategoryDao');

module.exports = {

    // Create one user
    create           : function (req, res) {

        Logger.debug('[SER-START] UserService#create');

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
                                    name             : 'Autres',
                                    type_category_id : typeCategory._id,
                                    active           : false,
                                    user_id          : user._id
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
                Logger.debug('[SER-CATCH] UserService#create');
                Logger.error('-- message : ' + err.message);

                ResponseService.fail(res, {
                    message : 'Add user'
                });
            });

        Logger.debug('[SER - END] UserService#create');
    },

    // Update one user
    update           : function (req, res, user_id) {

        Logger.debug('[SER-START] UserService#update');

        let input = {
            id        : user_id,
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
                Logger.debug('[SER-CATCH] UserService#update');
                Logger.error('-- message : ' + err.message);

                ResponseService.fail(res, {
                    message : 'Update user'
                });
            });

        Logger.debug('[SER - END] UserService#update');
    },

    // Remove one user
    remove           : function (req, res, user_id) {

        Logger.debug('[SER-START] UserService#remove');

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
            Logger.debug('[SER-CATCH] UserService#remove');
            Logger.error('-- message : ' + err.message);

            ResponseService.fail(res, {
                message : 'Remove user'
            });
        });

        Logger.debug('[SER - END] UserService#remove');
    },

    // Get all users
    all              : function (req, res) {

        Logger.debug('[SER-START] UserService#getAll');

        UserDao.getAll()
            .then(function(users) {
                ResponseService.success(res, {
                    message : 'Get all users', 
                    result  : users
                });
            })
            .catch(function(err) {
                Logger.debug('[SER-CATCH] UserService#getAll');
                Logger.error('-- message : ' + err.message);

                ResponseService.fail(res, {
                    message : 'Get all users'
                });
            });

        Logger.debug('[SER - END] UserService#getAll');
    },

    // Get one user by id
    getById          : function (req, res, user_id) {

        Logger.debug('[SER-START] UserService#getOne');

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
                Logger.debug('[SER-CATCH] UserService#getOne');
                Logger.error('-- message : ' + err.message);

                ResponseService.fail(res, {
                    message : 'Get user'
                });
            });

        Logger.debug('[SER - END] UserService#getOne');
    },

    // Set permission
    managePermission : function (req, res, user_id) {

        Logger.debug('[SER-START] UserService#managePermission');

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
                Logger.debug('[SER-CATCH] UserService#managePermission');
                Logger.error('-- message : ' + err.message);

                ResponseService.fail(res, {
                    message : 'Give rights'
                });
            });

        Logger.debug('[SER - END] UserService#managePermission');
    }
};