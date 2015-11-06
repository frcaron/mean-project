// Inject models
var UserModel         = require(global.__model + '/UserModel');
var PlanModel         = require(global.__model + '/PlanModel');
var ProgramModel      = require(global.__model + '/ProgramModel');
var TransactionModel  = require(global.__model + '/TransactionModel');
var CategoryModel     = require(global.__model + '/CategoryModel');
var TypeCategoryModel = require(global.__model + '/TypeCategoryModel');

// Inject services
var responseService   = require(global.__service + '/ResponseService');

module.exports = {

	// Create one user
	create    : function (req, res) {

		var user = new UserModel();
		
		user.surname   = req.body.surname;
		user.firstname = req.body.username;
		user.email     = req.body.email;
		user.password  = req.body.password;
		if (req.body.admin) { // TODO remove permission
			user.admin = req.body.admin;
		}				

		user.saveAsync()

			.then(function () {
				responseService.success(res, 'Add success', user._id);
			})

			.catch(function (err) {
				var message;
				if (err.code == 11000) {
					message = 'User exist';
				} else {
					message = err.message;
				}
				responseService.fail(res, 'Add failed', message);
			});

	},

	// Update one user
	update    : function (req, res) {

		var promise = UserModel.findByIdAsync(req.decoded.id);

		promise
			.then(function (user) {

				if (!user) {
					throw new Error('User not found');
				}

				if (req.body.surname) {
					user.surname = req.body.surname;
				}
				if (req.body.firstname) {
					user.firstname = req.body.firstname;
				}
				if (req.body.email) {
					user.email = req.body.email;
				}
				if (req.body.password) {
					user.password = req.body.password;
				}

				return user.saveAsync();
			})

			.then(function () {
				responseService.success(res, 'Update success');
			})

			.catch(function (err) {
				var message;
				if (err.code == 11000) {
					message = 'User exist';
				} else {
					message = err.message;
				}
				responseService.fail(res, 'Update failed', message);
			});
	},

	// Remove one user
	remove    : function (req, res, id) {

		var promise = TransactionModel.removeAsync({
			_user : id
		});

		promise
			.then(function () {
				return CategoryModel.removeAsync({
					_user : id
				});
			})

			.then(function () {
				return ProgramModel.removeAsync({
					_user : id
				});
			})

			.then(function () {
				return PlanModel.removeAsync({
					_user : id
				});
			})

			.then(function () {
				return UserModel.removeAsync({
					_id : id
				});
			})

			.then(function () {
				responseService.success(res, 'Remove success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Remove failed', err.message);
			});
	},

	// Get all users
	all       : function (req, res) {

		var promise = UserModel.findAsync();

		promise
			.then(function (users) {
				responseService.success(res, 'Find success', users);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get one user by id
	getById   : function (req, res) {

		var promise = UserModel.findByIdAsync(req.decoded.id);

		promise
			.then(function (user) {
				responseService.success(res, 'Find success', user);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Set permission
	giveAdmin : function (req, res) {

		var promise = UserModel.findByIdAsync(req.params.user_id);

		promise
			.then(function (user) {
				user.admin = true;
				return user.saveAsync();
			})

			.then(function () {
				responseService.success(res, 'Give permission success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Give permission failed', err.message);
			});
	}
};