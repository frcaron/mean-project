"use strict";

// Inject
var BPromise    = require('bluebird');
var PlanDao     = require(global.__dao + '/PlanDao');
var ProgramDao  = require(global.__dao + '/ProgramDao');
var CategoryDao = require(global.__dao + '/CategoryDao');

module.exports = {

	createPlan    : function (input) {

		return PlanDao.create(input)
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
						PlanDao.remove({ plan_id : plan._id });
						throw err;
					});
			});
	},

	createProgram : function (input) {

		return CategoryDao.getOne({
				category_id : input._category,
				user_id     : input._user
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
	}

};