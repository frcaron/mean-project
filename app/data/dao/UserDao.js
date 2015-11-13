"use strict";

// Inject
var BPromise      = require('bluebird');
var Logger        = require(global.__app + '/LoggerManager');
var ErrorManager  = require(global.__app + '/ErrorManager');
var UserModel     = require(global.__model + '/UserModel');
var CountersModel = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 	Data to create
 * @return {UserModel} 		Object created
 * @throws {DuplicateError} If index model is not unique
 * @throws {Error} 			If an other error is met
 */
function create (input) {
	
	Logger.debug('UserDao#create [start]');

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
			return BPromise.resolve(user);
		})
		.catch(function (err) {
			Logger.error('UserDao#create | ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('User already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('UserDao#create [end]');

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

	Logger.debug('UserDao#update [start]');

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
			return BPromise.resolve(output);
		})
		.catch(function (err) {
			Logger.error('UserDao#update | ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('User already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('UserDao#update [end]');

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

	Logger.debug('UserDao#remove [start]');

	var promise = getOne(filters)
		.then(function(user){
			return user.removeAsync();
		})
		.catch(function (err) {
			Logger.error('UserDao#remove | ' + err.message);

			throw err;
		});

	Logger.debug('UserDao#remove [end]');

	return promise;
}

/**
 * @return {UserModel}	List of object found
 * @throws {Error} 		If an other error is met
 */
function getAll () {

	Logger.debug('UserDao#getAll [start]');

	var promise = UserModel.findAsync()
		.then(function (users) {
			return BPromise.resolve(users);
		})
		.catch(function (err) {
			Logger.error('UserDao#getAll | ' + err.message);

			throw err;
		});

	Logger.debug('UserDao#getAll [end]');

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

	Logger.debug('UserDao#getOne [start]');
	
	var promise;
	var id = filters.id || filters.user_id;
	if(id) {
		promise = UserModel.findByIdAsync(id);

	} else if(filters.email) {
		promise = UserModel.findOneAsync({
					email : filters.email
				});

	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.then(function (user) {
			if (!user) {
				throw new ErrorManager.NoResultError('User not found');
			}
			return BPromise.resolve(user);
		})
		.catch(function (err) {
			Logger.error('UserDao#getOne | ' + err.message);

			throw err;
		});

	Logger.debug('UserDao#getOne [end]');

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

	Logger.debug('UserDao#validatePassword [start]');

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

		return BPromise.resolve(user);
	})
	.then(undefined, function (err){
		Logger.error('UserDao#validatePassword | ' + err.message);

		throw err;
	});

	Logger.debug('UserDao#validatePassword [end]');

	return BPromise.resolve(promise);
}

module.exports = {
	name             : 'UserDao',
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