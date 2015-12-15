"use strict";

// Inject
var path           = require('path');
var BPromise       = require('bluebird');
var userDao        = require(path.join(global.__dao, 'user'));
var planDao        = require(path.join(global.__dao, 'plan'));
var programDao     = require(path.join(global.__dao, 'program'));
var categoryDao    = require(path.join(global.__dao, 'category'));
var transactionDao = require(path.join(global.__dao, 'transaction'));
var Exception      = require(path.join(global.__core, 'exception'));
var logger         = require(path.join(global.__core, 'logger'))('service', __filename);

module.exports = {

	// Update one user
	update (req, next, user_id) {

		logger.debug({ method : 'update', point : logger.pt.start, params : { user_id : user_id } });

		userDao.update({
                user_id        : user_id,
                firstname      : req.body.firstname,
                surname        : req.body.surname,
                local_email    : req.body.email,
                local_password : req.body.password
            })
			.then(function (user) {
				req.result = user;

				logger.debug({ method : 'update', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'update', point : logger.pt.catch });
				next(err);
			});
	},

	// Remove one user
	remove (req, next, user_id) {

		logger.debug({ method : 'remove', point : logger.pt.start, params : { user_id : user_id } });

		let msg = [];
		BPromise.map([
				[userDao, 'byId'],
				[planDao, 'byU'],
				[programDao, 'byU'],
				[categoryDao, 'byU'],
				[transactionDao, 'byU']
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

				logger.debug({ method : 'remove', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'remove', point : logger.pt.catch });
				next(err);
			});
	},

	// Get all users
	all (req, next) {

		logger.debug({ method : 'all', point : logger.pt.start });

		userDao.getAll()
			.then(function(users) {
				req.result = users;

				logger.debug({ method : 'all', point : logger.pt.end });
				next();
			})
			.catch(function(err) {
				logger.debug(err.message, { method : 'all', point : logger.pt.catch });
				next(err);
			});
	},

	// Get one user by id
	getById (req, next, user_id) {

		logger.debug({ method : 'getById', point : logger.pt.start, params : { user_id : user_id } });

		userDao.getOne('byId', { user_id : user_id })
			.then(function (user) {
				req.result = user;

				logger.debug({ method : 'getById', point : logger.pt.end });
				next();
			})
			.catch(function (err) {
				logger.debug(err.message, { method : 'getById', point : logger.pt.catch });
				next(err);
			});
	},

	// Set permission
	managePermission (req, next, user_id) {

		logger.debug({ method : 'managePermission', point : logger.pt.start, params : { user_id : user_id } });

		userDao.update({
                user_id : user_id,
                admin   : req.body.admin
            })
			.then(function() {
				logger.debug({ method : 'managePermission', point : logger.pt.end });
				next();
			})
			.catch(function(err) {
				logger.debug(err.message, { method : 'managePermission', point : logger.pt.catch });
				next(err);
			});
	}
};