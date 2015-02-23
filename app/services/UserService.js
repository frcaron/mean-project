// Inject models
var UserModel = require(global.__model + '/UserModel');
var PlanModel = require(global.__model + '/PlanModel');
var ProgramModel = require(global.__model + '/ProgramModel');
var TransactionModel = require(global.__model + '/TransactionModel');
var CategoryModel = require(global.__model + '/CategoryModel');
var TypeCategoryModel = require(global.__model + '/TypeCategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Create one user
	create  : function (req, res) {

		var user = new UserModel();

		// Build object
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;
		if (req.body.admin) {
			user.admin = req.body.admin;
		}

		TypeCategoryModel.findOne({
			type : 'unknow'
		}, function (err, typeCategory) {
			if (err) {
				return res.json(responseService.success('Add failed', err.message));
			}

			var id;
			if (!typeCategory) {

				// Type category not exist, create new
				var newTypeCategory = new TypeCategoryModel();

				newTypeCategory.type = 'unknow';
				newTypeCategory.active = false;
				newTypeCategory.save();

				id = newTypeCategory._id;
			} else {
				id = typeCategory._id;
			}

			// Query save
			user.save(function (err) {
				if (err) {
					if (err.code == 11000) {
						return res.json(responseService.success('Add failed', 'User exist'));
					} else if (err) {
						return res.json(responseService.success('Add failed', err.message));
					}
				}

				var category = new CategoryModel();

				// Build object
				category.name = 'unknow';
				category.type = id;
				category.active = false;
				category._user = user._id;
				category.save();

				return res.json(responseService.success('Add success', user._id));
			});
		});
	},

	// Update one user
	update  : function (req, res) {

		// Query find user by id
		UserModel.findById(req.params.user_id, function (err, user) {
			if (err) {
				return res.json(responseService.fail('Update failed', err.message));
			}
			if (!user) {
				return res.json(responseService.fail('Update failed', 'User not found'));
			}

			// Build object
			if (req.body.name) {
				user.name = req.body.name;
			}
			if (req.body.username) {
				user.username = req.body.username;
			}
			if (req.body.password) {
				user.password = req.body.password;
			}
			if (req.body.admin) {
				user.admin = req.body.admin;
			}

			// Query save
			user.save(function (err) {
				if (err) {
					return res.json(responseService.fail('Update failed', err.message));
				}
				return res.json(responseService.success('Update success'));
			});
		});
	},

	// Remove one user
	remove  : function (req, res) {

		// Query remove
		TransactionModel.remove({
			_user : req.params.user_id
		}, function (err) {
			if (err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
		});

		CategoryModel.remove({
			_user : req.params.user_id
		}, function (err) {
			if (err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
		});

		ProgramModel.remove({
			_user : req.params.user_id
		}, function (err) {
			if (err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
		});

		PlanModel.remove({
			_user : req.params.user_id
		}, function (err) {
			if (err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
		});

		UserModel.remove({
			_id : req.params.user_id
		}, function (err) {
			if (err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
		});

		return res.json(responseService.success('Remove success'));
	},

	// Get all users
	all     : function (req, res) {

		// Query find users
		UserModel.find(function (err, users) {
			if (err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', users));
		});
	},

	// Get one user by id
	getById : function (req, res) {

		// Query find user by id
		UserModel.findById(req.params.user_id, function (err, user) {
			if (err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', user));
		});
	}
};