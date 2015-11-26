"use strict";

// Inject
var BPromise        = require('bluebird');
var Exception       = require(global.__server + '/ExceptionManager');
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var UserDao         = require(global.__dao + '/UserDao');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TransactionDao  = require(global.__dao + '/TransactionDao');

module.exports = {

	// Update one user
	update (req, res, user_id) {

		Logger.debug('[SER - START] UserService#update');
		Logger.debug('              -- user_id : ' + user_id);

		UserDao.update({
                user_id        : user_id,
                firstname      : req.body.firstname,
                surname        : req.body.surname,
                displayname    : req.body.displayname,
                local_email    : req.body.email,
                local_password : req.body.password
            })
			.then(function (user) {
				ResponseService.success(res, {
					result  : user
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] UserService#update');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] UserService#update');
	},

	// Remove one user
	remove (req, res, user_id) {

		Logger.debug('[SER - START] UserService#remove');
		Logger.debug('              -- user_id : ' + user_id);

		let msg = [];
		BPromise.map([UserDao, PlanDao, ProgramDao, CategoryDao, TransactionDao], function(dao) {
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
						result  : msg.toString()
					});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] UserService#remove');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] UserService#remove');
	},

	// Get all users
	all (req, res) {

		Logger.debug('[SER - START] UserService#getAll');

		UserDao.getAll()
			.then(function(users) {
				ResponseService.success(res, {
					result  : users
				});
			})
			.catch(function(err) {
				Logger.debug('[SER - CATCH] UserService#getAll');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] UserService#getAll');
	},

	// Get one user by id
	getById (req, res, user_id) {

		Logger.debug('[SER - START] UserService#getOne');
		Logger.debug('              -- user_id : ' + user_id);

		UserDao.getOne('byId', { user_id : user_id })
			.then(function(user) {
				ResponseService.success(res, {
					result  : user
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function(err) {
				Logger.debug('[SER - CATCH] UserService#getOne');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] UserService#getOne');
	},

	// Set permission
	managePermission (req, res, user_id) {

		Logger.debug('[SER - START] UserService#managePermission');
		Logger.debug('              -- user_id : ' + user_id);

		UserDao.update({
                user_id : user_id,
                admin   : req.body.admin
            })
			.then(function() {
				ResponseService.success(res);
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function(err) {
				Logger.debug('[SER - CATCH] UserService#managePermission');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] UserService#managePermission');
	}
};