"use strict";

// Inject
var BPromise        = require('bluebird');
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TypeCategoryDao = require(global.__dao + '/TypeCategoryDao');

module.exports = {

	// Create one category
	create             : function (req, res) {

		Logger.debug('[SER - START] CategoryService#create');

		let type_category_id = req.body.type_category_id || req.query.type_category_id;

		TypeCategoryDao.getOne({ type_category_id : type_category_id })
			.then(function (typeCategory) {

				return CategoryDao.create({
					name             : req.body.name,
					type_category_id : typeCategory._id,
					user_id          : req.decoded.id
				});
			})
			.then(function (category) {
				ResponseService.success(res, {
					message : 'Add category',
					result  : category
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] CategoryService#create');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Add category'
				});
			});

		Logger.debug('[SER -   END] CategoryService#create');
	},

	// Update one category
	update             : function (req, res) {

		Logger.debug('[SER - START] CategoryService#update');

		CategoryDao.update({
				category_id      : req.params.category_id,
				name             : req.body.name,
				type_category_id : req.body.type_category_id || req.query.type_category_id,
				user_id          : req.decoded.id
			})
			.then(function (category) {
				ResponseService.success(res, {
					message : 'Update category',
					result  : category
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] CategoryService#update');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Update category'
				});
			});

		Logger.debug('[SER -   END] CategoryService#update');
	},

	// Desactivate one category
	desactivate        : function (req, res) {

		Logger.debug('[SER - START] CategoryService#desactivate');

		CategoryDao.update({
				category_id : req.params.category_id,
				active      : false,
				user_id     : req.decoded.id
			})
			.then(function () {
				ResponseService.success(res, {
					message : 'Desactivate category'
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] CategoryService#desactivate');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Desactivate category'
				});
			});

		Logger.debug('[SER -   END] CategoryService#desactivate');
	},

	allByTypeCatUNoUse : function (req, res) {

		Logger.debug('[SER - START] CategoryService#allByTypeCatUNoUse');

		let plan_id          = req.body.plan_id || req.query.plan_id;
		let type_category_id = req.body.type_category_id || req.query.type_category_id;

		ProgramDao.getAll({
				plan_id : plan_id,
				user_id : req.decoded.id
			})
			.then(function (programs) {
				if(!programs.length) {
					throw new Error('Program not found');
				}

				var categories_id = [];
				programs.map(function (program) {
					categories_id.push(program._id);
				});

				return BPromise.all(categories_id)
					.then(function () {
						return CategoryDao.getAll({
							no_categories_id : categories_id,
							type_category_id : type_category_id,
							user_id          : req.decoded.id
						});
					});
			})
			. then(function (categories) {
				ResponseService.success(res, {
					message : 'Get all categories active usable for this plan',
					result  : categories
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] CategoryService#allByTypeCatUNoUse');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get all categories active usable for this plan'
				});
			});

		Logger.debug('[SER -   END] CategoryService#allByTypeCatUNoUse');
	},

	// Get active categories by type category
	allByTypeCatU      : function (req, res) {

		Logger.debug('[SER - START] CategoryService#allActiveByTypeCategoryU');

		CategoryDao.getAll({
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
				Logger.debug('[SER - CATCH] CategoryService#allActiveByTypeCategoryU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get all categories active by type category'
				});
			});

		Logger.debug('[SER -   END] CategoryService#allActiveByTypeCategoryU');
	},

	// Get one category by id
	getByIdU           : function (req, res) {

		Logger.debug('[SER - START] CategoryService#getByIdU');

		CategoryDao.getOne({
				category_id : req.params.category_id,
				user_id     : req.decoded.id
			})
			.then(function (category) {
				ResponseService.success(res, {
					message : 'Get category',
					result  : category
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] CategoryService#getByIdU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res, {
					message : 'Get category'
				});
			});

		Logger.debug('[SER -   END] CategoryService#getByIdU');
	}
};