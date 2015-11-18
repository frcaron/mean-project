"use strict";

// Inject
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_share + '/ResponseService');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TypeCategoryDao = require(global.__dao + '/TypeCategoryDao');

module.exports = {

	// Create one category
	create             : function (req, res) {

		Logger.debug('[SER-START] CategoryService#create');

		let type_category_id = req.body.type_category_id || req.query.type_category_id;

		TypeCategoryDao.getOne({ id : type_category_id })
			.then(function (typeCategory) {

				let input = {
					name             : req.body.name,
					type_category_id : typeCategory._id,
					user_id          : req.decoded.id
				};

				return CategoryDao.create(input);
			})
			.then(function (category) {
				ResponseService.success(res, {
					message : 'Add category',
					result  : category
				});
			})
			.catch(function (err) {
				Logger.debug('[SER-CATCH] CategoryService#create');
				Logger.error('-- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Add category'
				});
			});

		Logger.debug('[SER - END] CategoryService#create');
	},

	// Update one category
	update             : function (req, res) {

		Logger.debug('[SER-START] CategoryService#update');

		let input = {
			id               : req.params.category_id,
			name             : req.body.name,
			type_category_id : req.body.type_category_id || req.query.type_category_id,
			user_id          : req.decoded.id
		};

		CategoryDao.update(input)
			.then(function (category) {
				ResponseService.success(res, {
					message : 'Update category',
					result  : category
				});
			})
			.catch(function (err) {
				Logger.debug('[SER-CATCH] CategoryService#update');
				Logger.error('-- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Update category'
				});
			});

		Logger.debug('[SER - END] CategoryService#update');
	},

	// Desactivate one category
	remove             : function (req, res) {

		// TODO 
		// Suppression des programs lié

		Logger.debug('[SER-START] CategoryService#remove');

		let input = {
			id      : req.params.category_id,
			active  : false,
			user_id : req.decoded.id
		};

		CategoryDao.update(input)
			.then(function () {
				ResponseService.success(res, {
					message : 'Desactivate category'
				});
			})
			.catch(function (err) {
				Logger.debug('[SER-CATCH] CategoryService#remove');
				Logger.error('-- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Desactivate category'
				});
			});

		Logger.debug('[SER - END] CategoryService#remove');
	},

	allByTypeCatUNoUse : function (req, res) {

		Logger.debug('[SER-START] CategoryService#allByTypeCatUNoUse');

		let plan_id          = req.body.plan_id || req.query.plan_id;
		let type_category_id = req.body.type_category_id || req.query.type_category_id;

		Logger.debug('[SER - END] CategoryService#allByTypeCatUNoUse');
	},

	// Get active categories by type category
	allByTypeCatU      : function (req, res) {

		Logger.debug('[SER-START] CategoryService#allActiveByTypeCategoryU');

		CategoryDao.getAll({
				active  : req.body.active,
				type_id : req.params.type_category_id,
				user_id : req.decoded.id
			})
			.then(function (categories) {
				ResponseService.success(res, {
					message : 'Get all categories active by type category', 
					result  : categories
				});
			})
			.catch(function (err) {
				Logger.debug('[SER-CATCH] CategoryService#allActiveByTypeCategoryU');
				Logger.error('-- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get all categories active by type category'
				});
			});

		Logger.debug('[SER - END] CategoryService#allActiveByTypeCategoryU');
	},

	// Get one category by id
	getByIdU           : function (req, res) {

		Logger.debug('[SER-START] CategoryService#getByIdU');

		CategoryDao.getOne({
				id      : req.params.category_id,
				user_id : req.decoded.id
			})
			.then(function (category) {
				ResponseService.success(res, {
					message : 'Get category', 
					result  : category
				});
			})
			.catch(function (err) {
				Logger.debug('[SER-CATCH] CategoryService#getByIdU');
				Logger.error('-- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get category'
				});
			});

		Logger.debug('[SER - END] CategoryService#getByIdU');
	}
};