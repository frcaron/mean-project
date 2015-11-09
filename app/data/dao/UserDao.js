// Inject
var Promise   = require('bluebird');
var UserModel = require(global.__model + '/UserModel');

module.exports = {

	create : function (input) {

		var promise = Promise.resolve();

		var user = new UserModel();

		user.surname   = input.surname;
		user.firstname = input.username;
		user.email     = input.email;
		user.password  = input.password;
		if ( input.admin ) {
			user.admin = input.admin;
		}

		user.saveAsync()

			.then(function () {
				promise.fulfill(user);
			})

			.catch(function (err) {
				if (err.code === 11000) {
					promise.reject('User exist');
				} else {
					promise.reject(err.message);
				}
			});

		return promise;
	},

	update : function (id, input) {

		var promise = Promise.resolve();

		getOne(id)

			.then(function (user) {

				if ( input.surname ) user.surname     = input.surname;
				if ( input.firstname ) user.firstname = input.firstname;
				if ( input.email ) user.email         = input.email;
				if ( input.password ) user.password   = input.password;
				if ( input.admin ) user.admin         = input.admin;

				return user.saveAsync();
			})

			.then(function () {
				promise.fulfill(user);
			})

			.catch(function (err) {
				promise.reject(err.message);
			});

		return promise;
	},

	remove : function (id) {

		var promise = Promise.resolve();

		USerModel.removeAsync()

			.then(function () {
				promise.fulfill();
			})

			.catch(function (err) {
				promise.reject(err.message);
			});

		return promise;
	},

	getAll : function () {

		var promise = Promise.resolve();

		USerModel.findAsync()

			.then(function (users) {
				promise.fulfill(users);
			})

			.catch(function (err) {
				promise.reject(err.message);
			});

		return promise;
	},

	getOne : function (id) {

		var promise = Promise.resolve();

		USerModel.findByIdAsync()

			.then(function (user) {

				if (!user) {
					throw new Error('User not found');
				}

				promise.fulfill(user);
			})

			.catch(function (err) {
				promise.reject(err.message);
			});

		return promise;
	}
}