// Inject
var Promise         = require('bluebird');
var ResponseService = require(global.__service + '/ResponseService');
var UserDao         = require(global.__dao + '/UserDao');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TransactionDao  = require(global.__dao + '/TransactionDao');

module.exports = {

    // Create one user
    create           : function (req, res) {

        var input = {
            firstname : req.body.firstname,
            surname   : req.body.surname,
            email     : req.body.email,
            password  : req.body.password,
            admin     : req.body.admin // TODO delete after test
        };

        UserDao.create(input)
            .then(function(user) {
                ResponseService.success(res, 'Add success', user);
            })
            .catch(function(err) {
                ResponseService.fail(res, 'Add failed', err.message);
            });

    },

    // Update one user
    update           : function (req, res, user_id) {

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
                ResponseService.success(res, 'Update success', user);
            })
            .catch(function(err) {
                ResponseService.fail(res, 'Update failed', err.message);
            });
    },

    // Remove one user
    remove           : function (req, res, user_id) {

        var messageSuccess;
        var messageError;
        Promise.map([UserDao, PlanDao, ProgramDao, CategoryDao, TransactionDao], 
            function(dao) {
                return dao.remove({ user_id : user_id })
                        .then(function () {
                            messageSuccess = messageSuccess + ' / ' + dao;
                        })
                        .catch(function (err) {
                            messageError = messageError + ' / ' + err.message;
                        });
            })                                  
        .then(function() {
            ResponseService.success(res, 'Remove', {
                success : messageSuccess,
                error   : messageError
            });                 
        })        
        .catch(function (err) {
            ResponseService.fail(res, 'Remove failed', err.message);  
        });
    },

    // Get all users
    getAll           : function (req, res) {

        UserDao.getAll()
            .then(function(users) {
                ResponseService.success(res, 'Find success', users);
            })
            .catch(function(err) {
                ResponseService.fail(res, 'Find failed', err.message);
            });
    },

    // Get one user by id
    getOne           : function (req, res, user_id) {

        var filters = {
            id : user_id
        };

        UserDao.getOne(filters)
            .then(function(user) {
                ResponseService.success(res, 'Find success', user);
            })
            .catch(function(err) {
                ResponseService.fail(res, 'Find failed', err.message);
            });
    },

    // Set permission
    managePermission : function (req, res, user_id) {

        var input = {
            id    : user_id,
            admin : req.body.admin
        };

        UserDao.update(input)
            .then(function() {
                ResponseService.success(res, 'Give permission success');
            })
            .catch(function(err) {
                ResponseService.fail(res, 'Give permission failed', err.message);
            });
    }
};