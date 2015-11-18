"use strict";

// Inject
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_share + '/ResponseService');
var TypeCategoryDao = require(global.__dao + '/TypeCategoryDao');

module.exports = {

	// Create one type category
	create    : function (req, res) {

		Logger.debug('[SER - START] TypeCategoryService#create');

		let input = {
			type : req.body.name
		};

		TypeCategoryDao.create(input)
			.then(function (typeCategory){
				ResponseService.success(res, {
					message : 'Add type category', 
					result  : typeCategory
				});
			})
			.catch(function (err){
				Logger.debug('[SER - CATCH] TypeCategoryService#create');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Add type category'
				});
			});

		Logger.debug('[SER -   END] TypeCategoryService#create');
	},

	// Update one type category
	update    : function (req, res) {

		Logger.debug('[SER - START] TypeCategoryService#update');

		let input = {
			type : req.body.name
		};

		TypeCategoryDao.update(input)
			.then(function (typeCategory) {
				ResponseService.success(res, {
					message : 'Update type category', 
					result 	: typeCategory
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TypeCategoryService#update');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Update type category'
				});
			});

		Logger.debug('[SER -   END] TypeCategoryService#update');
	},

	// Get all type category
	all       : function (req, res) {

		Logger.debug('[SER - START] TypeCategoryService#all');

		TypeCategoryDao.getAll()
			.then(function (typeCategories) {
				ResponseService.success(res, {
					message : 'Get all categories', 
					result  : typeCategories
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TypeCategoryService#all');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get all categories'
				});
			});

		Logger.debug('[SER -   END] TypeCategoryService#all');
	},

	// Get one type category by id
	getById    : function (req, res) {

		Logger.debug('[SER - START] TypeCategoryService#getById');

		TypeCategoryDao.getOne({ id : req.params.type_category_id })
			.then(function (typeCategory) {
				ResponseService.success(res, {
					message : 'Get type category', 
					result  : typeCategory
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TypeCategoryService#getById');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get type category'
				});
			});

		Logger.debug('[SER -   END] TypeCategoryService#getById');
	}
};