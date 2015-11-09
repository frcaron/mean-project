// Inject
var Promise         = require('bluebird');
var responseService = require(global.__service + '/ResponseService');
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
                responseService.success(res, 'Add success', user._id);
            })
            .catch(function(err) {
                responseService.fail(res, 'Add failed', err.message);
            });

    },

    // Update one user
    update    : function (req, res) {

        UserDao.update(req.decoded.id, req.body)
            .then(function() {
                responseService.success(res, 'Update success');
            })
            .catch(function(err) {
                responseService.fail(res, 'Update failed', err.message);
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
                            responseService.success(res, 'Remove success');
                        })
                        .catch(function (err) {
                            responseService.fail(res, 'Remove failed', err.message);  
                        });
            },
            Promise.resolve());
    },

    // Get all users
    getAll    : function (req, res) {

        UserDao.getAll()
            .then(function(users) {
                responseService.success(res, 'Find success', users);
            })
            .catch(function(err) {
                responseService.fail(res, 'Find failed', err.message);
            });
    },

    // Get one user by id
    getOne    : function (req, res) {

        UserDao.getOne(req.decoded.id)
            .then(function(user) {
                responseService.success(res, 'Find success', user);
            })
            .catch(function(err) {
                responseService.fail(res, 'Find failed', err.message);
            });
    },

    // Set permission
    giveAdmin : function (req, res) {

        var user;
        user.admin = true;

        UserDao.update(req.params.user_id, user)
            .then(function() {
                responseService.success(res, 'Give permission success');
            })
            .catch(function(err) {
                responseService.fail(res, 'Give permission failed', err.message);
            });
    }
};