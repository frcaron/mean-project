// Inject models
var CategoryModel = require(global.__model + '/CategoryModel');
var TypeCategoryModel = require(global.__model + '/TypeCategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Create one category
	create: function(req, res) {

		// Validate category id
		TypeCategoryModel.findById(req.body.type_category_id, '_id', function(err,
			typeCategory) {
			if (err) {
				return res.json(responseService.fail('Add failed', err.message));
			}
			if (!typeCategory) {
				return res.json(responseService.fail('Add failed',
					'Type category id invalid'));
			}

			var category = new CategoryModel();

			// Build object
			category.name = req.body.name;
			category.type = req.body.type_category_id;
			category._user = req.decoded.id;

			// Query save
			category.save(function(err) {
				if (err) {
					return res.json(responseService.fail('Add failed', err.message));
				}
				return res.json(responseService.success('Add success', category._id));
			});
		});
	},

	// Update one category
	update: function(req, res) {

		// Query find category by id and user
		CategoryModel.findOne({
			_id: req.params.category_id,
			_user: req.decoded.id
		}, function(err, category) {
			if (err) {
				return res.json(responseService.fail('Update failed',
					'Find category failed  / ' + err.message));
			}
			if (!category) {
				return res.json(responseService.fail('Update failed',
					'Category not found'));
			}

			// Build object
			if (req.body.name) {
				category.name = req.body.name;
			}

			// Query save
			category.save(function(err) {
				if (err) {
					return res.json(responseService.fail('Update failed', err.message));
				}
				return res.json(responseService.success('Update success'));
			});
		});
	},

	// Remove one category
	remove: function(req, res) {

		// Query find category by id and user
		CategoryModel.findOneAndUpdate({
			_id: req.params.category_id,
			_user: req.decoded.id
		}, function(err, category) {
			if (err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
			if (!category) {
				return res.json(responseService.fail('Remove failed',
					'Category not found'));
			}

			category.active = false;

			return res.json(responseService.success('Remove success'));
		});
	},

	// Get categories by user
	allByU: function(req, res) {

		// Query find categories by user
		CategoryModel.find({
			_user: req.decoded.id
		}, function(err, categories) {
			if (err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', categories));
		});
	},

	// Get active categories by user
	allActiveByU: function(req, res) {

		// Query find categories by user
		CategoryModel.find({
			_user: req.decoded.id,
			active: true
		}, function(err, categories) {
			if (err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', categories));
		});
	},

	// Get categories by type category
	allByTypeCategoryU: function(req, res) {

		// Query find categories by id and type category
		CategoryModel.find({
			_user: req.decoded.id,
			type: req.params.type_category_id,
			active: true
		}, function(err, categories) {
			if (err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', categories));
		});
	},

	// Get one category by id
	getByIdU: function(req, res) {

		// Query find category by id and user
		CategoryModel.findOne({
			_id: req.params.category_id,
			_user: req.decoded.id
		}, function(err, category) {
			if (err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', category));
		});
	}
};