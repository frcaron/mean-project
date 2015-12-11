"use strict";

// Inject
var path            = require('path');
var typeCategoryDao = require(path.join(global.__dao, 'type-category'));
var logger          = require(path.join(global.__core, 'system')).Logger;

module.exports = {

	// Create one type category
	create (req, next) {

		logger.debug('[SER - START] TypeCategoryService#create');

		typeCategoryDao.create({
				name : req.body.name
			})
			.then(function (typeCategory){
				req.result = typeCategory;
				next();
			})
			.catch(function (err){
				next(err);
			});

		logger.debug('[SER -   END] TypeCategoryService#create');
	},

	// Update one type category
	update (req, next) {

		logger.debug('[SER - START] TypeCategoryService#update');

		typeCategoryDao.update({
				type_category_id : req.params.type_category_id,
				name             : req.body.name
			})
			.then(function (typeCategory) {
				req.result = typeCategory;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug('[SER -   END] TypeCategoryService#update');
	},

	// Get all type category
	all (req, next) {

		logger.debug('[SER - START] TypeCategoryService#all');

		typeCategoryDao.getAll()
			.then(function (typeCategories) {
				req.result = typeCategories;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug('[SER -   END] TypeCategoryService#all');
	},

	// Get one type category by id
	getById (req, next) {

		logger.debug('[SER - START] TypeCategoryService#getById');

		typeCategoryDao.getOne('byId', { type_category_id : req.params.type_category_id })
			.then(function (typeCategory) {
				req.result = typeCategory;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug('[SER -   END] TypeCategoryService#getById');
	}
};