"use strict";

// Inject
var path            = require('path');
var BPromise        = require('bluebird');
var programDao      = require(path.join(global.__dao, 'program'));
var categoryDao     = require(path.join(global.__dao, 'category'));
var typeCategoryDao = require(path.join(global.__dao, 'type-category'));
var Exception       = require(path.join(global.__core, 'exception'));
var logger          = require(path.join(global.__core, 'system')).Logger;

module.exports = {

	// Create one category
	create (req, next, user_id) {

		logger.debug('[SER - START] CategoryService#create');
		logger.debug('              -- user_id : ' + user_id);

		let type_category_id = req.body.type_category_id || req.query.type_category_id;

		typeCategoryDao.getOne('byId', { type_category_id : type_category_id })
			.then(function (typeCategory) {
				return categoryDao.create({
					name             : req.body.name,
					type_category_id : typeCategory._id,
					user_id          : user_id
				})
				.catch(Exception.DuplicateEx, function() {
					return categoryDao.getOne('byNameTypeU', {
							name             : req.body.name,
							type_category_id : typeCategory._id,
							user_id          : user_id
						})
						.then(function (category) {
							if(category.active) {
								throw new Exception.DuplicateEx('Category already exist');
							} else {
								return  categoryDao.update({
									category_id : category._id,
									active      : true,
									user_id     : user_id
								});
							}
						});
				});
			})
			.then(function (category) {
				req.result = category;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug('[SER -   END] CategoryService#create');
	},

	// Update one category
	update (req, next, user_id) {

		logger.debug('[SER - START] CategoryService#update');
		logger.debug('              -- user_id : ' + user_id);

		categoryDao.update({
				category_id : req.params.category_id,
				name        : req.body.name,
				user_id     : user_id
			})
			.then(function (category) {
				req.result = category;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug('[SER -   END] CategoryService#update');
	},

	// Desactivate one category
	desactivate (req, next, user_id) {

		logger.debug('[SER - START] CategoryService#desactivate');
		logger.debug('              -- user_id : ' + user_id);

		categoryDao.update({
				category_id : req.params.category_id,
				active      : false,
				user_id     : user_id
			})
			.then(function () {
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug('[SER -   END] CategoryService#desactivate');
	},

	allByTypeCatUNoUse (req, next, user_id) {

		logger.debug('[SER - START] CategoryService#allByTypeCatUNoUse');
		logger.debug('              -- user_id : ' + user_id);

		let plan_id          = req.body.plan_id || req.query.plan_id;
		let type_category_id = req.body.type_category_id || req.query.type_category_id;

		programDao.getAll('byPlanU', {
				plan_id : plan_id,
				user_id : user_id
			})
			.then(function (programs) {
				var categories_id = [];
				programs.map(function (program) {
					categories_id.push(program._category);
				});

				return BPromise.all(categories_id)
					.then(function () {
						return categoryDao.getAll('ninCategoryiesByTypeU', {
							categories_id    : categories_id,
							type_category_id : type_category_id,
							neutre           : false,
							user_id          : user_id
						});
					});
			})
			. then(function (categories) {
				req.result = categories;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug('[SER -   END] CategoryService#allByTypeCatUNoUse');
	},

	// Get active categories by type category
	allByTypeU (req, next, user_id) {

		logger.debug('[SER - START] CategoryService#allByTypeU');
		logger.debug('              -- user_id : ' + user_id);

		categoryDao.getAll('byTypeU', {
				type_category_id : req.params.type_category_id,
				user_id          : user_id
			})
			.then(function (categories) {
				req.result = categories;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug('[SER -   END] CategoryService#allByTypeU');
	},

	// Get one category by id
	getByIdU (req, next, user_id) {

		logger.debug('[SER - START] CategoryService#getByIdU');
		logger.debug('              -- user_id : ' + user_id);

		categoryDao.getOne('byIdU', {
				category_id : req.params.category_id,
				user_id     : user_id
			})
			.then(function (category) {
				req.result = category;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug('[SER -   END] CategoryService#getByIdU');
	}
};