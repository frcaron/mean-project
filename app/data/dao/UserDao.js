// Inject
var Promise       = require('bluebird');
var UserModel     = require(global.__model + '/UserModel');
var CountersModel = require(global.__model + '/CountersModel');

function create (input) {

		var user = new UserModel();
		var promise = CountersModel.getNextSequence('user_id')
			.then(function (seq){

				user._id       = seq;
				user.surname   = input.surname;
				user.firstname = input.firstname;
				user.email     = input.email;
				user.password  = input.password;
				if ( input.admin ) {
					user.admin = input.admin;
				}

				return user.saveAsync();
			})
			.then(function () {
				return Promise.resolve(user);
			})
			.catch(function (err) {
				if (err.code === 11000) {
					throw new Error('User already exist');
				} else {
					throw err;
				}
			});

		return promise;
}

function update (id, input) {

		var output;
		var promise = getOne(id)
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
				output = user;
				return user.saveAsync();
			})
			.then(function () {
				Promise.resolve(output);
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function remove (id) {

		var promise = getOne(id)
			.then(function(user){
				return user.removeAsync();
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getAll () {

		var promise = UserModel.findAsync()
			.then(function (users) {
				Promise.resolve(users);
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getOne (id) {
	
		var promise = UserModel.findByIdAsync({
						_id   : id
					})
			.then(function (user) {
				if (!user) {
					throw new Error('User not found');
				}
				Promise.resolve(user);
			})
			.catch(function (err) {
				throw err;
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