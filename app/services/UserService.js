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
	create    : function (req, res) {

		var user = new UserModel();

		// Build object
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;
		if (req.body.admin) { // TODO remove permission
			user.admin = req.body.admin;
		}

		TypeCategoryModel.findOne({
			type : 'unknow'
		}, function (err, typeCategory) {
			if (err) {
				return responseService.fail(res, 'Add failed', err.message);
			}

			var id;
			if (!typeCategory) {

				// Type category not exist, create new
				var newTypeCategory = new TypeCategoryModel();

				newTypeCategory.type = 'unknow';
				newTypeCategory.active = false;
				newTypeCategory.save().exec();

				id = newTypeCategory._id;
			} else {
				id = typeCategory._id;
			}

			// Query save
			user.save(function (err) {
				if (err) {
					if (err.code == 11000) {
						return responseService.fail(res, 'Add failed', 'User exist');
					} else if (err) {
						return responseService.fail(res, 'Add failed', err.message);
					}
				}

				var category = new CategoryModel();

				// Build object
				category.name = 'unknow';
				category.type = id;
				category.active = false;
				category._user = user._id;
				category.save();

				return responseService.success(res, 'Add success', user._id);
			});
		});
	},

	// Update one user
	update    : function (req, res) {

		// Query find user by id
		UserModel.findById(req.decoded.id, function (err, user) {
			if (err) {
				return responseService.fail(res, 'Update failed', err.message);
			}
			if (!user) {
				return responseService.fail(res, 'Update failed', 'User not found');
			}

			// Build object
			if (req.body.name) {
				user.name = req.body.name;
			}
			if (req.body.password) {
				user.password = req.body.password;
			}

			// Query save
			user.save(function (err) {
				if (err) {
					return responseService.fail(res, 'Update failed', err.message);
				}
				return responseService.success(res, 'Update success');
			});
		});
	},

	// Remove one user
	remove    : function (req, res) {

		// Query remove
		TransactionModel.remove({
			_user : req.decoded.id
		}).exec();

		CategoryModel.remove({
			_user : req.decoded.id
		}).exec();

		ProgramModel.remove({
			_user : req.decoded.id
		}.exec());

		PlanModel.remove({
			_user : req.decoded.id
		}.exec());

		UserModel.remove({
			_id : req.decoded.id
		}.exec());

		return responseService.success(res, 'Remove success');
	},

	// Get all users
	all       : function (req, res) {

		// Query find users
		UserModel.find(function (err, users) {
			if (err) {
				return responseService.fail(res, 'Find failed', err.message);
			}
			return responseService.success(res, 'Find success', users);
		});
	},

	// Get one user by id
	getById   : function (req, res) {

		// Query find user by id
		UserModel.findById(req.decoded.id, function (err, user) {
			if (err) {
				return responseService.fail(res, 'Find failed', err.message);
			}
			return responseService.success(res, 'Find success', user);
		});
	},

	// Set permission
	giveAdmin : function (req, res) {

		// Query find user by id
		UserModel.findById(req.params.user_id, function (err, user) {
			if (err) {
				return responseService.fail(res, 'Give permission failed', err.message);
			}

			user.admin = true;

			// Query save
			user.save(function (err) {
				if (err) {
					return responseService.fail(res, 'Give permission failed', err.message);
				}
				return responseService.success(res, 'Give permission success');
			});
		});
	}
};