"use strict";

// Inject
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_trans + '/ResponseService');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TypeCategoryDao = require(global.__dao + '/TypeCategoryDao');

module.exports = {

	// Create one category
	create                   : function (req, res) {

		Logger.debug('CategoryService#create - [start]');

		let type_category_id = req.body.type_category_id ||req.query.type_category_id;

		TypeCategoryDao.getOne({ id : type_category_id })
			.then(function (typeCategory) {

				let input = {
					name :  req.body.name,
					_type : typeCategory._id,
					_user : req.decoded.id
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
				Logger.error('CategoryService#create |' + err.message);

				ResponseService.fail(res, {
					message : 'Add category'
				});
			});

		Logger.debug('CategoryService#create - [end]');
	},

	// Update one category
	update                   : function (req, res) {

		Logger.debug('CategoryService#update - [start]');

		let input = {
			_id    : req.params.category_id,
			name   : req.body.name,
			_type  : req.body.type_category_id ||req.query.type_category_id,
			active : req.body.active,
			_user  : req.decoded.id
		};

		CategoryDao.update(input)
			.then(function (category) {
				ResponseService.success(res, {
					message : 'Update category',
					result  : category
				});
			})
			.catch(function (err) {
				Logger.error('CategoryService#update |' + err.message);

				ResponseService.fail(res, {
					message : 'Update category'
				});
			});

		Logger.debug('CategoryService#update - [end]');
	},

	// Desactivate one category
	desactivate              : function (req, res) {

		Logger.debug('CategoryService#desactivate - [start]');

		let input = {
			_id    : req.params.category_id,
			active : false,
			_user : req.decoded.id
		};

		CategoryDao.update(input)
			.then(function () {
				ResponseService.success(res, {
					message : 'Desactivate category'
				});
			})
			.catch(function (err) {
				Logger.error('CategoryService#desactivate |' + err.message);

				ResponseService.fail(res, {
					message : 'Desactivate category'
				});
			});

		Logger.debug('CategoryService#desactivate - [end]');
	},

	// Get categories by user
	allByU                   : function (req, res) {

		Logger.debug('CategoryService#allByU - [start]');

		CategoryDao.getAll({ user_id : req.decoded.id })
			.then(function (categories) {
				ResponseService.success(res, {
					message : 'Get all categories',
					result  : categories
				});
			})
			.catch(function (err) {
				Logger.error('CategoryService#allByU |' + err.message);

				ResponseService.fail(res, {
					message : 'Get all categories'
				});
			});

		Logger.debug('CategoryService#allByU - [end]');
	},

	// Get active categories by user
	allActiveByU             : function (req, res) {

		Logger.debug('CategoryService#allActiveByU - [start]');

		CategoryDao.getAll({
				active  : true,
				user_id : req.decoded.id
			})
			.then(function (categories) {
				ResponseService.success(res, {
					message : 'Get all categories active',
					result  : categories
				});
			})
			.catch(function (err) {
				Logger.error('CategoryService#allActiveByU |' + err.message);

				ResponseService.fail(res, {
					message : 'Get all categories active'
				});
			});

		Logger.debug('CategoryService#allActiveByU - [end]');
	},

	// Get active categories by type category
	allActiveByTypeCategoryU : function (req, res) {

		Logger.debug('CategoryService#allActiveByTypeCategoryU - [start]');

		CategoryDao.getAll({
				active  : true,
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
				Logger.error('CategoryService#allActiveByTypeCategoryU | ' + err.message);

				ResponseService.fail(res, {
					message : 'Get all categories active by type category'
				});
			});

		Logger.debug('CategoryService#allActiveByTypeCategoryU - [end]');
	},

	// Get one category by id
	getByIdU                 : function (req, res) {

		Logger.debug('CategoryService#getByIdU - [start]');

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
				Logger.error('CategoryService#getByIdU |' + err.message);

				ResponseService.fail(res, {
					message : 'Get category'
				});
			});

		Logger.debug('CategoryService#getByIdU - [end]');
	}
};