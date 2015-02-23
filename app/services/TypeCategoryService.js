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
				return res.json(responseService.fail('Add failed', err.message));
			}
			return res.json(responseService.success('Add success', typeCategory._id));
		});
	},

	// Update one type category
	update       : function (req, res) {

		// Query find type category by id
		TypeCategoryModel.findById(req.params.type_category_id, function (err, typeCategory) {
			if (err) {
				return res.json(responseService.fail('Update failed', err.message));
			}
			if (!typeCategory) {
				return res.json(responseService.fail('Update failed', 'Type category not found'));
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
					return res.json(responseService.fail('Update failed', err.message));
				}
				return res.json(responseService.success('Update success'));
			});
		});
	},

	// Get all type category
	allByU       : function (req, res) {

		// Query find categories
		TypeCategoryModel.find(function (err, typeCategories) {
			if (err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', typeCategories));
		});
	},

	// Get all type category active
	allActiveByU : function (req, res) {

		// Query find categories
		TypeCategoryModel.find({
			active : true
		}, function (err, typeCategories) {
			if (err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', typeCategories));
		});
	},

	// Get one type category by id
	getByIdU     : function (req, res) {

		// Query find category by id
		TypeCategoryModel.findById(req.params.type_category_id, function (err, typeCategory) {
			if (err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', typeCategory));
		});
	},

	// Test type category existing
	isExist      : function (type_category_id) {

		TypeCategoryModel.findById(type_category_id, '_id', function (err, typeCategory) {
			if (err) {
				throw new Error('Find type category failed');
			}
			if (!typeCategory) {
				throw new Error('Type category id invalid');
			}
		});
	}
};