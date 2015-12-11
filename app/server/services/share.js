"use strict";

// Inject
var path            = require('path');
var BPromise        = require('bluebird');
var userDao         = require(path.join(global.__dao, 'user'));
var planDao         = require(path.join(global.__dao, 'plan'));
var programDao      = require(path.join(global.__dao, 'program'));
var categoryDao     = require(path.join(global.__dao, 'category'));
var typeCategoryDao = require(path.join(global.__dao, 'type-category'));
var logger          = require(path.join(global.__core, 'system')).Logger;

module.exports = {

	createUser (input) {

		logger.debug('[SER - START] BudgetService#createUser');
		logger.debug('              -- input   : ' + JSON.stringify(input));

		var promise = userDao.create({
				firstname      : input.firstname,
				surname        : input.surname,
				displayname    : input.displayname,
				verified       : input.verified,
				local_email    : input.local_email,
				local_password : input.local_password,
				local_active   : input.local_active,
				facebook_id    : input.facebook_id,
				facebook_token : input.facebook_token,
				facebook_email : input.facebook_email
			})
			.then(function (user) {
				return typeCategoryDao.getAll()
					.then(function (typeCategories) {
						return BPromise.map(typeCategories, function (typeCategory) {
							return categoryDao.create({
								name             : 'Autres',
								type_category_id : typeCategory._id,
								neutre           : true,
								user_id          : user._id
							});
						});
					})
					.then(function() {
						return BPromise.resolve(user);
					})
					.catch(function (err) {
						logger.debug('[SER - CATCH] BudgetService#createUser');
						logger.error('              -- message : ' + err.message);

						userDao.remove({ user_id : user._id });
						throw err;
					});
			});

		logger.debug('[SER -   END] BudgetService#createUser');

		return promise;
	},

	createPlan (input) {

		logger.debug('[SER - START] BudgetService#createPlan');
		logger.debug('              -- input   : ' + JSON.stringify(input));

		let promise = planDao.create(input)
			.then(function (plan) {
				return categoryDao.getAll('byNeutreU', {
						neutre  : true,
						user_id : input.user_id
					})
					.then(function (categories) {
						return BPromise.map(categories, function (category) {
							return programDao.create({
								category_id : category._id,
								plan_id     : plan._id,
								user_id     : input.user_id
							});
						});
					})
					.then(function () {
						return BPromise.resolve(plan);
					})
					.catch(function (err) {
						logger.debug('[SER - CATCH] BudgetService#createPlan');
						logger.error('              -- message : ' + err.message);

						planDao.remove('byIdU', {
							plan_id : plan._id,
							user_id : input.user_id
						});
						throw err;
					});
			});

		logger.debug('[SER -   END] BudgetService#createPlan');

		return promise;
	},

	createProgram (input) {

		logger.debug('[SER - START] BudgetService#createProgram');
		logger.debug('              -- input   : ' + JSON.stringify(input));

		let promise = categoryDao.getOne('byIdU', {
				category_id : input.category_id,
				user_id     : input.user_id
			})
			.then(function () {
				return planDao.getOne('byIdU', {
							plan_id : input.plan_id,
							user_id : input.user_id
						});
			})
			.then(function () {
				return programDao.create(input);
			});

		logger.debug('[SER -   END] BudgetService#createProgram');

		return promise;
	}

};