"use strict";

// Inject
var BPromise        = require('bluebird');
var Logger          = require(global.__server + '/LoggerManager');
var UserDao         = require(global.__dao + '/UserDao');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TypeCategoryDao = require(global.__dao + '/TypeCategoryDao');

module.exports = {

	createUser    : function (input) {

		Logger.debug('[SER - START] BudgetService#createUser');
		Logger.debug('              -- input   : ' + JSON.stringify(input));

		var promise = UserDao.create({
	            firstname : input.firstname,
	            surname   : input.surname,
	            email     : input.email,
	            password  : input.password
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

	createPlan    : function (input) {

		Logger.debug('[SER - START] BudgetService#createPlan');
		Logger.debug('              -- input   : ' + JSON.stringify(input));

		let promise = PlanDao.create(input)
			.then(function (plan) {
				return CategoryDao.getAll({
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

						PlanDao.remove({ plan_id : plan._id });
						throw err;
					});
			});

		Logger.debug('[SER -   END] BudgetService#createPlan');

		return promise;
	},

	createProgram : function (input) {

		Logger.debug('[SER - START] BudgetService#createProgram');
		Logger.debug('              -- input   : ' + JSON.stringify(input));

		let promise = CategoryDao.getOne({
				category_id : input.category_id,
				user_id     : input.user_id
			})
			.then(function () {
				return PlanDao.getOne({
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