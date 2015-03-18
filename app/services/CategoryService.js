// Inject models
var CategoryModel = require(global.__model + '/CategoryModel');
var TypeCategoryModel = require(global.__model + '/TypeCategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Create one category
	create             : function (req, res) {

		var category = new CategoryModel();

		var promise = TypeCategoryModel.findByIdAsync(req.query.type_category_id, '_id');

		promise
			.then(function (typeCategory) {

				if (!typeCategory) {
					throw new Error('Type category id invalid');
				}

				category.name = req.body.name;
				category.type = req.query.type_category_id;
				category._user = req.decoded.id;

				return category.saveAsync();
			})

			.then(function () {
				responseService.success(res, 'Add success', category._id);
			})

			.catch(function (err) {
				responseService.fail(res, 'Add failed', err.message);
			});
	},

	// Update one category
	update             : function (req, res) {

		var promise = CategoryModel.findOneAsync({
			_id   : req.params.category_id,
			_user : req.decoded.id
		});

		promise
			.then(function (category) {

				if (!category) {
					throw new Error('Category not found');
				}

				if (req.body.name) {
					category.name = req.body.name;
				}

				return category.saveAsync();
			})

			.then(function () {
				responseService.success(res, 'Update success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Update failed', err.message);
			});
	},

	// Remove one category
	remove             : function (req, res) {

		var promise = CategoryModel.findOneAsync({
			_id   : req.params.category_id,
			_user : req.decoded.id
		});

		promise
			.then(function (category) {
				if (!category) {
					throw new Error('Category not found');
				}

				category.active = false;

				return category.saveAsync();
			})

			.then(function () {
				responseService.success(res, 'Remove success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Remove failed', err.message);
			});
	},

	// Get categories by user
	allByU             : function (req, res) {

		var promise = CategoryModel.findAsync({
			_user : req.decoded.id
		});

		promise
			.then(function (categories) {
				responseService.success(res, 'Find success', categories);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get active categories by user
	allActiveByU       : function (req, res) {

		var promise = CategoryModel.findAsync({
			_user  : req.decoded.id,
			active : true
		});

		promise
			.then(function (categories) {
				responseService.success(res, 'Find success', categories);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get categories by type category
	allByTypeCategoryU : function (req, res) {

		var promise = CategoryModel.findAsync({
			_user  : req.decoded.id,
			type   : req.params.type_category_id,
			active : true
		});

		promise
			.then(function (categories) {
				responseService.success(res, 'Find success', categories);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get one category by id
	getByIdU           : function (req, res) {

		var promise = CategoryModel.findOneAsync({
			_id   : req.params.category_id,
			_user : req.decoded.id
		});

		promise
			.then(function (category) {
				responseService.success(res, 'Find success', category);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	}
};