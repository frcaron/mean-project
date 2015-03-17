// Inject models
var TypeCategoryModel = require(global.__model + '/TypeCategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Create one type category
	create       : function (req, res) {

		var typeCategory = new TypeCategoryModel();

		// Build object
		typeCategory.type = req.body.type;

		// Query save
		typeCategory.save(function (err) {
			if (err) {
				return responseService.fail(res, 'Add failed', err.message);
			}
			return responseService.success(res, 'Add success', typeCategory._id);
		});
	},

	// Update one type category
	update       : function (req, res) {

		// Query find type category by id
		TypeCategoryModel.findById(req.params.type_category_id, function (err, typeCategory) {
			if (err) {
				return responseService.fail(res, 'Update failed', err.message);
			}
			if (!typeCategory) {
				return responseService.fail(res, 'Update failed', 'Type category not found');
			}

			// Build object
			if (req.body.type) {
				typeCategory.type = req.body.type;
			}
			if (req.body.visible) {
				typeCategory.visible = req.body.visible;
			}

			// Query save
			typeCategory.save(function (err) {
				if (err) {
					return responseService.fail(res, 'Update failed', err.message);
				}
				return responseService.success(res, 'Update success');
			});
		});
	},

	// Remove one type category
	remove       : function (req, res) {

		// Query remove
		TypeCategoryModel.remove({
			_id : req.params.type_category_id
		}, function (err) {
			if (err) {
				return responseService.fail(res, 'Remove failed', err.message);
			}
			return responseService.success(res, 'Remove success');
		});
	},

	// Get all type category
	allByU       : function (req, res) {

		// Query find categories
		TypeCategoryModel.find(function (err, typeCategories) {
			if (err) {
				return responseService.fail(res, 'Find failed', err.message);
			}
			return responseService.success(res, 'Find success', typeCategories);
		});
	},

	// Get all type category active
	allActiveByU : function (req, res) {

		// Query find categories
		TypeCategoryModel.find({
			active : true
		}, function (err, typeCategories) {
			if (err) {
				return responseService.fail(res, 'Find failed', err.message);
			}
			return responseService.success(res, 'Find success', typeCategories);
		});
	},

	// Get one type category by id
	getByIdU     : function (req, res) {

		// Query find category by id
		TypeCategoryModel.findById(req.params.type_category_id, function (err, typeCategory) {
			if (err) {
				return responseService.fail(res, 'Find failed', err.message);
			}
			return responseService.success(res, 'Find success', typeCategory);
		});
	}
};