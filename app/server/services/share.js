"use strict";

// Inject
var Path            = require('path');
var BPromise        = require('bluebird');
var UserDao         = require(Path.join(global.__dao, 'user'));
var PlanDao         = require(Path.join(global.__dao, 'plan'));
var ProgramDao      = require(Path.join(global.__dao, 'program'));
var CategoryDao     = require(Path.join(global.__dao, 'category'));
var TypeCategoryDao = require(Path.join(global.__dao, 'type-category'));
var Logger          = require(Path.join(global.__core, 'system')).Logger;

module.exports = {

	createUser (input) {

		Logger.debug('[SER - START] BudgetService#createUser');
		Logger.debug('              -- input   : ' + JSON.stringify(input));

		var promise = UserDao.create({
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
				return TypeCategoryDao.getAll()
					.then(function (typeCategories) {
						return BPromise.map(typeCategories, function (typeCategory) {
							return CategoryDao.create({
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
						Logger.debug('[SER - CATCH] BudgetService#createUser');
						Logger.error('              -- message : ' + err.message);

						UserDao.remove({ user_id : user._id });
						throw err;
					});
			});

		Logger.debug('[SER -   END] BudgetService#createUser');

		return promise;
	},

	createPlan (input) {

		Logger.debug('[SER - START] BudgetService#createPlan');
		Logger.debug('              -- input   : ' + JSON.stringify(input));

		let promise = PlanDao.create(input)
			.then(function (plan) {
				return CategoryDao.getAll('byNeutreU', {
						neutre  : true,
						user_id : input.user_id
					})
					.then(function (categories) {
						return BPromise.map(categories, function (category) {
							return ProgramDao.create({
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
						Logger.debug('[SER - CATCH] BudgetService#createPlan');
						Logger.error('              -- message : ' + err.message);

						PlanDao.remove('byIdU', {
							plan_id : plan._id,
							user_id : input.user_id
						});
						throw err;
					});
			});

		Logger.debug('[SER -   END] BudgetService#createPlan');

		return promise;
	},

	createProgram (input) {

		Logger.debug('[SER - START] BudgetService#createProgram');
		Logger.debug('              -- input   : ' + JSON.stringify(input));

		let promise = CategoryDao.getOne('byIdU', {
				category_id : input.category_id,
				user_id     : input.user_id
			})
			.then(function () {
				return PlanDao.getOne('byIdU', {
							plan_id : input.plan_id,
							user_id : input.user_id
						});
			})
			.then(function () {
				return ProgramDao.create(input);
			});

		Logger.debug('[SER -   END] BudgetService#createProgram');

		return promise;
	}

};