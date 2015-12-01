"use strict";

// Inject
var Path            = require('path');
var BPromise        = require('bluebird');
var Exception       = require(Path.join(global.__server, 'ExceptionManager'));
var ProgramDao      = require(Path.join(global.__dao, 'program'));
var CategoryDao     = require(Path.join(global.__dao, 'category'));
var TypeCategoryDao = require(Path.join(global.__dao, 'type-category'));
var Logger          = require(Path.join(global.__core, 'system')).Logger;

module.exports = {

	// Create one category
	create (req, next, user_id) {

		Logger.debug('[SER - START] CategoryService#create');
		Logger.debug('              -- user_id : ' + user_id);

		let type_category_id = req.body.type_category_id || req.query.type_category_id;

		TypeCategoryDao.getOne('byId', { type_category_id : type_category_id })
			.then(function (typeCategory) {
				return CategoryDao.create({
					name             : req.body.name,
					type_category_id : typeCategory._id,
					user_id          : user_id
				})
				.catch(Exception.DuplicateEx, function() {
					return CategoryDao.getOne('byNameTypeU', {
							name             : req.body.name,
							type_category_id : typeCategory._id,
							user_id          : user_id
						})
						.then(function (category) {
							if(category.active) {
								throw new Exception.DuplicateEx('Category already exist');
							} else {
								return  CategoryDao.update({
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

		Logger.debug('[SER -   END] CategoryService#create');
	},

	// Update one category
	update (req, next, user_id) {

		Logger.debug('[SER - START] CategoryService#update');
		Logger.debug('              -- user_id : ' + user_id);

		CategoryDao.update({
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

		Logger.debug('[SER -   END] CategoryService#update');
	},

	// Desactivate one category
	desactivate (req, next, user_id) {

		Logger.debug('[SER - START] CategoryService#desactivate');
		Logger.debug('              -- user_id : ' + user_id);

		CategoryDao.update({
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

		Logger.debug('[SER -   END] CategoryService#desactivate');
	},

	allByTypeCatUNoUse (req, next, user_id) {

		Logger.debug('[SER - START] CategoryService#allByTypeCatUNoUse');
		Logger.debug('              -- user_id : ' + user_id);

		let plan_id          = req.body.plan_id || req.query.plan_id;
		let type_category_id = req.body.type_category_id || req.query.type_category_id;

		ProgramDao.getAll('byPlanU', {
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
						return CategoryDao.getAll('ninCategoryiesByTypeU', {
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

		Logger.debug('[SER -   END] CategoryService#allByTypeCatUNoUse');
	},

	// Get active categories by type category
	allByTypeU (req, next, user_id) {

		Logger.debug('[SER - START] CategoryService#allByTypeU');
		Logger.debug('              -- user_id : ' + user_id);

		CategoryDao.getAll('byTypeU', {
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

		Logger.debug('[SER -   END] CategoryService#allByTypeU');
	},

	// Get one category by id
	getByIdU (req, next, user_id) {

		Logger.debug('[SER - START] CategoryService#getByIdU');
		Logger.debug('              -- user_id : ' + user_id);

		CategoryDao.getOne('byIdU', {
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

		Logger.debug('[SER -   END] CategoryService#getByIdU');
	}
};