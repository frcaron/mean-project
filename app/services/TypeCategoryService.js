// Inject models
var TypeCategoryModel = require(global.__model + '/TypeCategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Create one type category
	create    : function (req, res) {

		var typeCategory = new TypeCategoryModel();

		typeCategory.type = req.body.type;

		var promise = typeCategory.saveAsync();

		promise
			.then(function () {
				responseService.success(res, 'Add success', typeCategory._id);
			})

			.catch(function (err) {
				responseService.fail(res, 'Add failed', err.message);
			});
	},

	// Update one type category
	update    : function (req, res) {

		var promise = TypeCategoryModel.findByIdAsync(req.params.type_category_id);

		promise
			.then(function (typeCategory) {

				if (!typeCategory) {
					throw new Error('Type category not found');
				}

				if (req.body.type) {
					typeCategory.type = req.body.type;
				}
				if (req.body.visible) {
					typeCategory.visible = req.body.visible;
				}

				return typeCategory.saveAsync();
			})

			.then(function () {
				responseService.success(res, 'Update success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Update failed', err.message);
			});
	},

	// Remove one type category
	remove    : function (req, res) {

		var promise = TypeCategoryModel.removeAsync({
			_id : req.params.type_category_id
		});

		promise
			.then(function () {
				responseService.success(res, 'Remove success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Remove failed', err.message);
			});
	},

	// Get all type category
	all       : function (req, res) {

		var promise = TypeCategoryModel.findAsync();

		promise
			.then(function (typeCategories) {
				responseService.success(res, 'Find success', typeCategories);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get all type category active
	allActive : function (req, res) {

		var promise = TypeCategoryModel.findAsync({
			active : true
		});

		promise
			.then(function (typeCategories) {
				responseService.success(res, 'Find success', typeCategories);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get one type category by id
	getById   : function (req, res) {

		var promise = TypeCategoryModel.findByIdAsync(req.params.type_category_id);

		promise
			.then(function (typeCategory) {
				responseService.success(res, 'Find success', typeCategory);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	}
};