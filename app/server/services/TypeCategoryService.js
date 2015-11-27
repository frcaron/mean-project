"use strict";

// Inject
var Logger          = require(global.__server  + '/LoggerManager');
var TypeCategoryDao = require(global.__dao     + '/TypeCategoryDao');

module.exports = {

	// Create one type category
	create (req, next) {

		Logger.debug('[SER - START] TypeCategoryService#create');

		TypeCategoryDao.create({
				name : req.body.name
			})
			.then(function (typeCategory){
				req.result = typeCategory;
				next();
			})
			.catch(function (err){
				next(err);
			});

		Logger.debug('[SER -   END] TypeCategoryService#create');
	},

	// Update one type category
	update (req, next) {

		Logger.debug('[SER - START] TypeCategoryService#update');

		TypeCategoryDao.update({
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

		Logger.debug('[SER -   END] TypeCategoryService#update');
	},

	// Get all type category
	all (req, next) {

		Logger.debug('[SER - START] TypeCategoryService#all');

		TypeCategoryDao.getAll()
			.then(function (typeCategories) {
				req.result = typeCategories;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] TypeCategoryService#all');
	},

	// Get one type category by id
	getById (req, next) {

		Logger.debug('[SER - START] TypeCategoryService#getById');

		TypeCategoryDao.getOne('byId', { type_category_id : req.params.type_category_id })
			.then(function (typeCategory) {
				req.result = typeCategory;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		Logger.debug('[SER -   END] TypeCategoryService#getById');
	}
};