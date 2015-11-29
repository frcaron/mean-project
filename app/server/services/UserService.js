"use strict";

// Inject
var Path            = require('path');
var BPromise        = require('bluebird');
var Exception       = require(Path.join(global.__server, 'ExceptionManager'));
var Logger          = require(Path.join(global.__server, 'LoggerManager'));
var UserDao         = require(Path.join(global.__dao, 'UserDao'));
var PlanDao         = require(Path.join(global.__dao, 'PlanDao'));
var ProgramDao      = require(Path.join(global.__dao, 'ProgramDao'));
var CategoryDao     = require(Path.join(global.__dao, 'CategoryDao'));
var TransactionDao  = require(Path.join(global.__dao, 'TransactionDao'));

module.exports = {

	// Update one user
	update (req, next, user_id) {

		Logger.debug('[SER - START] UserService#update');
		Logger.debug('              -- user_id : ' + user_id);

		UserDao.update({
                user_id        : user_id,
                firstname      : req.body.firstname,
                surname        : req.body.surname,
                local_email    : req.body.email,
                local_password : req.body.password
            })
			.then(function (user) {
				req.result = user;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] UserService#update');
	},

	// Remove one user
	remove (req, next, user_id) {

		Logger.debug('[SER - START] UserService#remove');
		Logger.debug('              -- user_id : ' + user_id);

		let msg = [];
		BPromise.map([
				[UserDao, 'byId'],
				[PlanDao, 'byU'],
				[ProgramDao, 'byU'],
				[CategoryDao, 'byU'],
				[TransactionDao, 'byU']
			], function(dao) {
				return dao[0].remove(dao[1], {
						user_id : user_id
					})
					.catch(Exception.NoResultEx, function () {
					})
					.catch(function (err) {
					   msg.push(err.message);
					});
			})
			.then(function() {
				if(msg.length) {
					throw new Error(msg);
				}
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] UserService#remove');
	},

	// Get all users
	all (req, next) {

		Logger.debug('[SER - START] UserService#getAll');

		UserDao.getAll()
			.then(function(users) {
				req.result = users;
				next();
			})
			.catch(function(err) {
				next(err);
			});

		Logger.debug('[SER -   END] UserService#getAll');
	},

	// Get one user by id
	getById (req, next, user_id) {

		Logger.debug('[SER - START] UserService#getOne');
		Logger.debug('              -- user_id : ' + user_id);

		UserDao.getOne('byId', { user_id : user_id })
			.then(function(user) {
				req.result = user;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] UserService#getOne');
	},

	// Set permission
	managePermission (req, next, user_id) {

		Logger.debug('[SER - START] UserService#managePermission');
		Logger.debug('              -- user_id : ' + user_id);

		UserDao.update({
                user_id : user_id,
                admin   : req.body.admin
            })
			.then(function() {
				next();
			})
			.catch(function(err) {
				next(err);
			});

		Logger.debug('[SER -   END] UserService#managePermission');
	}
};