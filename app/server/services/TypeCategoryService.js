"use strict";

// Inject
var Exception       = require(global.__server  + '/ExceptionManager');
var Logger          = require(global.__server  + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var TypeCategoryDao = require(global.__dao     + '/TypeCategoryDao');

module.exports = {

	// Create one type category
	create (req, res) {

		Logger.debug('[SER - START] TypeCategoryService#create');

		TypeCategoryDao.create({
				name : req.body.name
			})
			.then(function (typeCategory){
				ResponseService.success(res, {
					result  : typeCategory
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err){
				Logger.debug('[SER - CATCH] TypeCategoryService#create');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] TypeCategoryService#create');
	},

	// Update one type category
	update (req, res) {

		Logger.debug('[SER - START] TypeCategoryService#update');

		TypeCategoryDao.update({
				type_category_id : req.params.type_category_id,
				name             : req.body.name
			})
			.then(function (typeCategory) {
				ResponseService.success(res, {
					result 	: typeCategory
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TypeCategoryService#update');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] TypeCategoryService#update');
	},

	// Get all type category
	all (req, res) {

		Logger.debug('[SER - START] TypeCategoryService#all');

		TypeCategoryDao.getAll()
			.then(function (typeCategories) {
				ResponseService.success(res, {
					result  : typeCategories
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TypeCategoryService#all');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] TypeCategoryService#all');
	},

	// Get one type category by id
	getById (req, res) {

		Logger.debug('[SER - START] TypeCategoryService#getById');

		TypeCategoryDao.getOne({ type_category_id : req.params.type_category_id })
			.then(function (typeCategory) {
				ResponseService.success(res, {
					result  : typeCategory
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] TypeCategoryService#getById');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] TypeCategoryService#getById');
	}
};