"use strict";

// Inject
var BPromise        = require('bluebird');
var Exception       = require(global.__server  + '/ExceptionManager');
var Logger          = require(global.__server  + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var ProgramDao      = require(global.__dao     + '/ProgramDao');
var CategoryDao     = require(global.__dao     + '/CategoryDao');
var TypeCategoryDao = require(global.__dao     + '/TypeCategoryDao');

module.exports = {

	// Create one category
	create (req, res, user_id) {

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
				ResponseService.success(res, {
					result  : category
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] CategoryService#create');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] CategoryService#create');
	},

	// Update one category
	update (req, res, user_id) {

		Logger.debug('[SER - START] CategoryService#update');
		Logger.debug('              -- user_id : ' + user_id);

		CategoryDao.update({
				category_id : req.params.category_id,
				name        : req.body.name,
				user_id     : user_id
			})
			.then(function (category) {
				ResponseService.success(res, {
					result  : category
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
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
	desactivate (req, res, user_id) {

		Logger.debug('[SER - START] CategoryService#desactivate');
		Logger.debug('              -- user_id : ' + user_id);

		CategoryDao.update({
				category_id : req.params.category_id,
				active      : false,
				user_id     : user_id
			})
			.then(function () {
				ResponseService.success(res);
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] CategoryService#desactivate');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] CategoryService#desactivate');
	},

	allByTypeCatUNoUse (req, res, user_id) {

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
						return CategoryDao.getAll('ninCategorybiesTypeU', {
							categories_id    : categories_id,
							type_category_id : type_category_id,
							neutre           : false,
							user_id          : user_id
						});
					});
			})
			. then(function (categories) {
				ResponseService.success(res, {
					result  : categories
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] CategoryService#allByTypeCatUNoUse');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] CategoryService#allByTypeCatUNoUse');
	},

	// Get active categories by type category
	allByTypeU (req, res, user_id) {

		Logger.debug('[SER - START] CategoryService#allByTypeU');
		Logger.debug('              -- user_id : ' + user_id);

		CategoryDao.getAll('byTypeU', {
				type_category_id : req.params.type_category_id,
				user_id          : user_id
			})
			.then(function (categories) {
				ResponseService.success(res, {
					result  : categories
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] CategoryService#allByTypeU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] CategoryService#allByTypeU');
	},

	// Get one category by id
	getByIdU (req, res, user_id) {

		Logger.debug('[SER - START] CategoryService#getByIdU');
		Logger.debug('              -- user_id : ' + user_id);

		CategoryDao.getOne('byIdU', {
				category_id : req.params.category_id,
				user_id     : user_id
			})
			.then(function (category) {
				ResponseService.success(res, {
					result  : category
				});
			})
			.catch(Exception.MetierEx, function(err) {
				ResponseService.fail(res, {
					reason  : err.message,
					detail : err.detail
				});
			})
			.catch(function (err) {
				Logger.debug('[SER - CATCH] CategoryService#getByIdU');
				Logger.error('              -- message : ' + err.message);

				ResponseService.fail(res);
			});

		Logger.debug('[SER -   END] CategoryService#getByIdU');
	}
};