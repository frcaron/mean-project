"use strict";

// Inject
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_trans + '/ResponseService');
var TypeCategoryDao = require(global.__dao + '/TypeCategoryDao');

module.exports = {

	// Create one type category
	create    : function (req, res) {

		Logger.debug('TypeCategoryService#create - [start]');

		let input = {
			type   : req.body.type,
			active : req.body.active
		};

		TypeCategoryDao.create(input)
			.then(function (typeCategory){
				ResponseService.success(res, {
					message : 'Add type category', 
					result  : typeCategory
				});
			})
			.catch(function (err){
				Logger.error('TypeCategoryService#create | ' + err.message);

				ResponseService.fail(res, {
					message : 'Add type category'
				});
			});

		Logger.debug('TypeCategoryService#create - [end]');
	},

	// Update one type category
	update    : function (req, res) {

		Logger.debug('TypeCategoryService#update - [start]');

		let input = {
			type   : req.body.type,
			active : req.body.active
		};

		TypeCategoryDao.update(input)
			.then(function (typeCategory) {
				ResponseService.success(res, {
					message : 'Update type category', 
					result 	: typeCategory
				});
			})
			.catch(function (err) {
				Logger.error('TypeCategoryService#update | ' + err.message);

				ResponseService.fail(res, {
					message : 'Update type category'
				});
			});

		Logger.debug('TypeCategoryService#update - [end]');
	},

	// Get all type category
	all       : function (req, res) {

		Logger.debug('TypeCategoryService#all - [start]');

		TypeCategoryDao.getAll()
			.then(function (typeCategories) {
				ResponseService.success(res, {
					message : 'Get all categories', 
					result  : typeCategories
				});
			})
			.catch(function (err) {
				Logger.error('TypeCategoryService#all | ' + err.message);

				ResponseService.fail(res, {
					message : 'Get all categories'
				});
			});

		Logger.debug('TypeCategoryService#all - [end]');
	},

	// Get all type category active
	allActive : function (req, res) {

		Logger.debug('TypeCategoryService#allActive - [start]');

		TypeCategoryDao.getAll({ active : true })
			.then(function (typeCategories) {
				ResponseService.success(res, {
					message : 'Get all type categories active', 
					result  : typeCategories
				});
			})
			.catch(function (err) {
				Logger.error('TypeCategoryService#allActive | ' + err.message);

				ResponseService.fail(res, {
					message : 'Get all type categories active'
				});
			});

		Logger.debug('TypeCategoryService#allActive - [end]');
	},

	// Get one type category by id
	getById    : function (req, res) {

		Logger.debug('TypeCategoryService#getById - [start]');

		TypeCategoryDao.getOne({ id : req.params.type_category_id })
			.then(function (typeCategory) {
				ResponseService.success(res, {
					message : 'Get type category', 
					result  : typeCategory
				});
			})
			.catch(function (err) {
				Logger.error('TypeCategoryService#getById | ' + err.message);

				ResponseService.fail(res, {
					message : 'Get type category'
				});
			});

		Logger.debug('TypeCategoryService#getById - [end]');
	}
};