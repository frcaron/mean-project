"use strict";

// Inject
var BPromise      = require('bluebird');
var Exception     = require(global.__server + '/ExceptionManager');
var Logger        = require(global.__server + '/LoggerManager');
var UserModel     = require(global.__model + '/UserModel');
var CountersModel = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 	Data to create
 * @return {UserModel} 		Object created
 * @throws {DuplicateEx} If index model is not unique
 * @throws {Error} 			If an other error is met
 */
function create (input) {

	Logger.debug('[DAO - START] UserDao#create');
	Logger.debug('              -- input : ' + JSON.stringify(input));

	let user = new UserModel();
	let promise = CountersModel.getNextSequence('user_id')
		.then(function (seq){

			user._id            = seq;
			user.surname        = input.surname;
			user.firstname      = input.firstname;
			user.local.email    = input.email;
			user.local.password = input.password;
			if ( input.admin !== undefined ) {
				user.admin = input.admin;
			}

			return user.saveAsync();
		})
		.then(function () {
			user.local.password = undefined;
			return BPromise.resolve(user);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] UserDao#create');
			Logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new Exception.DuplicateEx('User already exist');
			} if(err.name === 'ValidationError') {
				let detail = [];
				Object.keys(err.errors).map(function(prop) {
					detail.push(err.errors[prop].message);
				});
				throw new Exception.ValidatorEx(err.message, detail);
			} else {
				throw err;
			}
		});

	Logger.debug('[DAO -   END] UserDao#create');

	return promise;
}

/**
 * @param  {Json} input 	Data to update
 * @return {UserModel} 		Object updated
 * @throws {DuplicateEx} If index model is not unique
 * @throws {NoResultEx} 	If id doesn't exist
 * @throws {Error} 			If an other error is met
 */
function update (input) {

	Logger.debug('[DAO - START] UserDao#update');
	Logger.debug('              -- input : ' + JSON.stringify(input));

	let promise = getOne({ user_id : input.user_id })
		.then(function (user) {
			if ( input.surname ) {
				user.surname        = input.surname;
			}
			if ( input.firstname ) {
				user.firstname      = input.firstname;
			}
			if ( input.email ) {
				user.local.email    = input.email;
			}
			if ( input.password ) {
				user.local.password = input.password;
			}
			if ( input.admin !== undefined ) {
				user.admin          = input.admin;
			}
			return user.saveAsync()
				.then(function () {
					user.local.password = undefined;
					return BPromise.resolve(user);
				});
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] UserDao#update');
			Logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new Exception.DuplicateEx('User already exist');
			} if(err.name === 'ValidationError') {
				let detail = [];
				Object.keys(err.errors).map(function(prop) {
					detail.push(err.errors[prop].message);
				});
				throw new Exception.ValidatorEx(err.message, detail);
			} else {
				throw err;
			}
		});

	Logger.debug('[DAO -   END] UserDao#update');

	return promise;
}

/**
 * @param  {Json} filters 	Keys : 	- user_id
 * 									- email
 * @return {}
 * @throws {ParamEx} 	If params given are wrong
 * @throws {NoResultEx} 	If no result found
 * @throws {Error} 			If an other error is met
 */
function remove (filters) {

	Logger.debug('[DAO - START] UserDao#remove');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise = getOne(filters)
		.then(function(user){
			return user.removeAsync();
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] UserDao#remove');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] UserDao#remove');

	return promise;
}

/**
 * @return {UserModel}	List of object found
 * @throws {Error} 		If an other error is met
 */
function getAll () {

	Logger.debug('[DAO - START] UserDao#getAll');

	let promise = UserModel.findAsync()
		.then(function (users) {
			return BPromise.resolve(users);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] UserDao#getAll');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] UserDao#getAll');

	return promise;
}

/**
 * @param  {Json} filters 	Keys : 	- user_id
 * 									- email
 * @return {UserModel}		Object found
 * @throws {ParamEx} 	If params given are wrong
 * @throws {NoResultEx} 	If no result found
 * @throws {Error} 			If an other error is met
 */
function getOne (filters) {

	Logger.debug('[DAO - START] UserDao#getOne');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		promise = UserModel.findByIdAsync(filters.user_id);

	} else if(filters.email) {
		promise = UserModel.findOneAsync({
			'local.email' : filters.email
		});
	}

	if(!promise) {
		promise = BPromise.reject(new Exception.ParamEx('Filters missing'));
	}

	let promiseEnd = promise
		.then(function (user) {
			if (!user) {
				throw new Exception.NoResultEx('No user found');
			}
			return BPromise.resolve(user);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] UserDao#getOne');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] UserDao#getOne');

	return promiseEnd;
}

/**
 * @param  {String} log 	Login
 * @param  {String} pass 	Password
 * @return {UserModel}		Object found
 * @throws {NoResultEx} 	If no result found
 * @throws {LoginEx} 		If login failed
 * @throws {Error} 			If an other error is met
 */
function validatePassword (log, pass) {

	Logger.debug('[DAO - START] UserDao#validatePassword');

	var promise = UserModel.findOne({
			'local.email' : log
		})
		.select('_id, surname firstname local.email local.password admin')
		.then(function(user) {
			if(!user) {
				throw new Exception.NoResultEx('No user found');
			}

			var validPassword = user.comparePassword(pass);

			if (!validPassword) {
				throw new Exception.LoginEx('Wrong password');
			}

			user.local.password = undefined;
			return BPromise.resolve(user);
		})
		.then(undefined, function (err){
			Logger.debug('[DAO - CATCH] UserDao#validatePassword');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] UserDao#validatePassword');

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