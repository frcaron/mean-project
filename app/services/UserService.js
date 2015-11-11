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
    create    : function (req, res) {

        UserDao.create(req.body)
            .then(function(user) {
                ResponseService.success(res, 'Add success', user);
            })
            .catch(function(err) {
                ResponseService.fail(res, 'Add failed', err.message);
            });

    },

    // Update one user
    update    : function (req, res) {

        var input = req.body;
        input.id  = req.decoded.id;

        UserDao.update(input)
            .then(function(user) {
                ResponseService.success(res, 'Update success', user);
            })
            .catch(function(err) {
                ResponseService.fail(res, 'Update failed', err.message);
            });
    },

    // Remove one user
    remove    : function (req, res, id) {

        Promise.reduce([UserDao, PlanDao, ProgramDao, CategoryDao, TransactionDao], 
            function(sequence, dao) {
                return sequence                           
                        .then(function() {
                            return dao.remove(id);
                        })                           
                        .then(function() {
                            ResponseService.success(res, 'Remove success');
                        })
                        .catch(function (err) {
                            ResponseService.fail(res, 'Remove failed', err.message);  
                        });
            },
            Promise.resolve());
    },

    // Get all users
    getAll    : function (req, res) {

        UserDao.getAll()
            .then(function(users) {
                ResponseService.success(res, 'Find success', users);
            })
            .catch(function(err) {
                ResponseService.fail(res, 'Find failed', err.message);
            });
    },

    // Get one user by id
    getOne    : function (req, res) {

        var input = {
            id : req.decoded.id
        };

        UserDao.getOne(input)
            .then(function(user) {
                ResponseService.success(res, 'Find success', user);
            })
            .catch(function(err) {
                ResponseService.fail(res, 'Find failed', err.message);
            });
    },

    // Set permission
    giveAdmin : function (req, res) {

        var input = {
            id    : req.decoded.id,
            admin : true
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