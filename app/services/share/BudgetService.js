"use strict";

// Inject
var BPromise    = require('bluebird');
var PlanDao     = require(global.__dao + '/PlanDao');
var ProgramDao  = require(global.__dao + '/ProgramDao');
var CategoryDao = require(global.__dao + '/CategoryDao');

module.exports = {

	createPlan    : function (input) {

		let promise = PlanDao.create(input)
			.then(function (plan) {
				return CategoryDao.getAll({ 
						active  : false,
						user_id : input.user_id
					})
					.then(function (categories) {
						return BPromise.map(categories, function (category) {
							
							let inputProgram = {
								category_id : category._id,
								plan_id     : plan._id,
								user_id     : input.user_id
							};

							return ProgramDao.create(inputProgram);
						});
					})
					.then(function () {
						return BPromise.resolve(plan);
					})
					.catch(function (err) {
						PlanDao.remove({ id : plan._id });
						throw err;
					});
			});

		return promise;
	},

	createProgram : function (input) {

		let promise = CategoryDao.getOne({ 
				id      : input._category,
				user_id : input._user
			})
			.then(function () {
				return PlanDao.getOne({ 
							id      : input._plan,
							user_id : input._user
						});
			})
			.then(function () {
				return ProgramDao.create(input);
			});

	return promise;
}

};