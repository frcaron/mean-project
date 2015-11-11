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
			if ( input.admin !== undefined ) {
				user.admin = input.admin;
			}

			return user.saveAsync();
		})
		.then(function () {
			return Promise.resolve(user);
		})
		.catch(function (err) {
			if (err.code === 11000) {
				err = new Error('User already exist');
			}
			return Promise.reject(err);
		});

	return promise;
}

function update (input) {

	var output;
	var promise = getOne(input)
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
			if ( input.admin !== undefined ) { 
				user.admin     = input.admin;
			}
			output = user;
			return user.saveAsync();
		})
		.then(function () {
			return Promise.resolve(output);
		})
		.catch(function (err) {
			if (err.code === 11000) {
				err = new Error('User already exist');
			}
			return Promise.reject(err);
		});

	return promise;
}

function remove (filters) {

	var promise = getOne(filters)
		.then(function(user){
			return user.removeAsync();
		})
		.catch(function (err) {
			return Promise.reject(err);
		});

	return promise;
}

function getAll () {

	var promise = UserModel.findAsync()
		.then(function (users) {
			return Promise.resolve(users);
		})
		.catch(function (err) {
			return Promise.reject(err);
		});

	return promise;
}

function getOne (filters) {
	
	var promise;
	var id = filters.id || filters.user_id;
	if(id) {
		promise = UserModel.findByIdAsync(id);

	} else if(filters.email) {
		promise = UserModel.findOneAsync({
					email : filters.email
				});

	} else {
		return Promise.reject(new Error('Filters missing'));
	}

	var promiseEnd = promise
		.then(function (user) {
			if (!user) {
				throw new Error('User not found');
			}
			return Promise.resolve(user);
		})
		.catch(function (err) {
			return Promise.reject(err);
		});

	return promiseEnd;
}

function validatePassword (log, pass) {

	var promise = UserModel.findOne({
		email : log
	})
	.select('_id, surname firstname email password admin')
	.then(function(user) {
		if(!user) {
			throw new Error('User not found');
		}

		var validPassword = user.comparePassword(pass);

		if (!validPassword) {
			throw new Error('Wrong password');
		}

		return Promise.resolve(user);
	})
	.then(undefined, function (err){
		return Promise.reject(err);
	});

	return Promise.resolve(promise);
}

module.exports = {
	create           : function (input) {
		return create(input);
	},

	update           : function (input) {
		return update(input);
	},

	remove           : function (filters) {
		return remove(filters);
	},

	getAll           : function () {
		return getAll();
	},

	getOne           : function (filters) {
		return getOne(filters);
	},

	validatePassword : function (log, pass) {
		return validatePassword(log, pass);
	}
};