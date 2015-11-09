// Inject
var Promise   = require('bluebird');
var UserModel = require(global.__model + '/UserModel');

function create (input) {
		var promise = new Promise();
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
}

function update (id, input) {
		var promise = new Promise();

		getOne(id)
			.then(function (user) {
				if ( input.surname ) { 
					user.surname   = input.surname;
				}
				if ( input.firstname ) { 
					user.firstname = input.firstname;
				}
				if ( input.email ) { 
					user.email     = input.email;
				}
				if ( input.password ) { 
					user.password  = input.password;
				}
				if ( input.admin ) { 
					user.admin     = input.admin;
				}
				return user.saveAsync();
			})
			.then(function () {
				promise.fulfill();
			})
			.catch(function (err) {
				promise.reject(err.message);
			});

		return promise;
}

function remove (id) {
		var promise = new Promise();

		getOne(id)
			.then(function(user){
				return user.removeAsync();
			})
			.then(function () {
				promise.fulfill();
			})
			.catch(function (err) {
				promise.reject(err.message);
			});

		return promise;
}

function getAll () {
		var promise = new Promise();

		UserModel.findAsync()
			.then(function (users) {
				promise.fulfill(users);
			})
			.catch(function (err) {
				promise.reject(err.message);
			});

		return promise;
}

function getOne (id) {
		var promise = new Promise();

		UserModel.findByIdAsync({
			_id   : id
		})
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

module.exports = {
	create : function (input) {
		return create(input);
	},

	update : function (id, input) {
		return update(id, input);
	},

	remove : function (id) {
		return remove(id);
	},

	getAll : function () {
		return getAll();
	},

	getOne : function (id) {
		return getOne(id);
	}
};