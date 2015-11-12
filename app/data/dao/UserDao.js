// Inject
var Promise       = require('bluebird');
var ErrorManager  = require(global.__app) + '/ErrorManager');
var UserModel     = require(global.__model + '/UserModel');
var CountersModel = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 	Data to create
 * @return {UserModel} 		Object created
 * @throws {DuplicateError} If index model is not unique
 * @throws {Error} 			If an other error is met
 */
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
				throw new ErrorManager.DuplicateError('User already exist');
			} else {
				throw err;
			}
		});

	return promise;
}

/** 
 * @param  {Json} input 	Data to update
 * @return {UserModel} 		Object updated
 * @throws {DuplicateError} If index model is not unique
 * @throws {NoResultError} 	If id doesn't exist
 * @throws {Error} 			If an other error is met
 */
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
				throw new ErrorManager.DuplicateError('User already exist');
			} else {
				throw err;
			}
		});

	return promise;
}

/**
 * @param  {Json} filters 	Keys : 	- id [user_id]
 * 									- email
 * @return {} 
 * @throws {ParamsError} 	If params given are wrong
 * @throws {NoResultError} 	If no result found
 * @throws {Error} 			If an other error is met
 */
function remove (filters) {

	var promise = getOne(filters)
		.then(function(user){
			return user.removeAsync();
		})
		.catch(function (err) {
			throw err;
		});

	return promise;
}

/**
 * @return {UserModel}	List of object found
 * @throws {Error} 		If an other error is met
 */
function getAll () {

	var promise = UserModel.findAsync()
		.then(function (users) {
			return Promise.resolve(users);
		})
		.catch(function (err) {
			throw err;
		});

	return promise;
}

/**
 * @param  {Json} filters 	Keys : 	- id [user_id]
 * 									- email
 * @return {UserModel}		Object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {NoResultError} 	If no result found
 * @throws {Error} 			If an other error is met
 */
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
		promise = Promise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.then(function (user) {
			if (!user) {
				throw new ErrorManager.NoResultError('User not found');
			}
			return Promise.resolve(user);
		})
		.catch(function (err) {
			throw err;
		});

	return promiseEnd;
}

/**
 * @param  {String} log 	Login
 * @param  {String} pass 	Password
 * @return {UserModel}		Object found
 * @throws {NoResultError} 	If no result found
 * @throws {LoginError} 	If login failed
 * @throws {Error} 			If an other error is met
 */
function validatePassword (log, pass) {

	var promise = UserModel.findOne({
		email : log
	})
	.select('_id, surname firstname email password admin')
	.then(function(user) {
		if(!user) {
			throw new ErrorManager.NoResultError('User not found');
		}

		var validPassword = user.comparePassword(pass);

		if (!validPassword) {
			throw new ErrorManager.LoginError('Wrong password');
		}

		return Promise.resolve(user);
	})
	.then(undefined, function (err){
		throw err;
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