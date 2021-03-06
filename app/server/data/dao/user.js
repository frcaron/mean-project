"use strict";

// Inject
var path          = require('path');
var BPromise      = require('bluebird');
var daoManager    = require(path.join(global.__dao, 'manager'))('user');
var userModel     = require(path.join(global.__model, 'user'));
var countersModel = require(path.join(global.__model, 'counters'));
var Exception     = require(path.join(global.__core, 'exception'));
var logger        = require(path.join(global.__core, 'logger'))('dao', __filename);

/**
 * @param  {Json} input 	Data to create
 * @return {UserModel} 		Object created
 * @throws {DuplicateEx} 	If index model is not unique
 * @throws {Error} 			If an other error is met
 */
function create (input) {

	logger.debug({ method : 'create', point : logger.pt.start, params : {
		input : input
	} });

	let user = new userModel();
	let promise = countersModel.getNextSequence('user_id')
		.then(function (seq){

			// Base
			user._id            = seq;
			user.firstname      = input.firstname;
			user.surname        = input.surname;
			user.displayname    = input.displayname;
			if ( input.verified !== undefined ) {
				user.verified = input.verified;
			}
			if ( input.admin !== undefined ) {
				user.admin = input.admin;
			}

			// Local
			user.local.email    = input.local_email;
			user.local.password = input.local_password;
			if( input.local_active !== undefined ) {
				user.local.active = input.local_active;
			}

			// Facebook
			user.facebook.id    = input.facebook_id;
			user.facebook.token = input.facebook_token;
			user.facebook.email = input.email;

			return user.saveAsync();
		})
		.then(function () {
			user.local.password = undefined;

			logger.debug({ method : 'create', point : logger.pt.end });

			return BPromise.resolve(user);
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'create', point : logger.pt.catch });

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

	return promise;
}

/**
 * @param  {Json} input 	Data to update
 * @return {UserModel} 		Object updated
 * @throws {DuplicateEx} 	If index model is not unique
 * @throws {NoResultEx} 	If id doesn't exist
 * @throws {Error} 			If an other error is met
 */
function update (input) {

	logger.debug({ method : 'update', point : logger.pt.start, params : {
		input : input
	} });

	let promise = getOne('byId', { user_id : input.user_id })
		.then(function (user) {

			// Base
			if ( input.surname ) {
				user.surname        = input.surname;
			}
			if ( input.firstname ) {
				user.firstname      = input.firstname;
			}
			if( user.isModified('surname') || user.isModified('firstname') ) {
				user.displayname        = user.firstname + ' ' + user.surname;
			}
			if ( input.verified !== undefined ) {
				user.verified       = input.verified;
			}
			if ( input.admin !== undefined ) {
				user.admin          = input.admin;
			}

			// Local
			if ( input.local_email ) {
				user.local.email    = input.local_email;
			}
			if ( input.local_password ) {
				user.local.password = input.local_password;
			}
			if( input.local_active !== undefined ) {
				user.local.active   = input.local_active;
			}

			// Facebook
			if ( input.facebook_id ) {
				user.facebook.id    = input.facebook_id;
			}
			if ( input.facebook_token ) {
				user.facebook.token = input.facebook_token;
			}
			if ( input.facebook_email ) {
				user.facebook.email = input.facebook_email;
			}

			return user.saveAsync()
				.then(function () {
					user.local.password = undefined;

					logger.debug({ method : 'update', point : logger.pt.end });

					return BPromise.resolve(user);
				});
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'update', point : logger.pt.catch });

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

	return promise;
}

/**
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {}
 * @throws {ParamEx} 			If params given are wrong
 * @throws {NoResultEx} 		If no result found
 * @throws {Error} 				If an other error is met
 */
function remove (name_query, filters) {

	logger.debug({ method : 'remove', point : logger.pt.start, params : {
		name_query : name_query,
		filters    : filters
	} });

	let promise = getOne(name_query, filters)
		.then(function(user){
			return user.removeAsync();
		})
		.then(function () {
			logger.debug({ method : 'remove', point : logger.pt.end });
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'remove', point : logger.pt.catch });
			throw err;
		});

	return promise;
}

/**
 * @return {UserModel}	List of object found
 * @throws {Error} 		If an other error is met
 */
function getAll () {

	logger.debug({ method : 'getAll', point : logger.pt.start });

	let promise = userModel.findAsync()
		.then(function (users) {
			logger.debug({ method : 'getAll', point : logger.pt.end });

			return BPromise.resolve(users);
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'getAll', point : logger.pt.catch });
			throw err;
		});

	return promise;
}

/**
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {UserModel}			Object found
 * @throws {ParamEx} 			If params given are wrong
 * @throws {NoResultEx} 		If no result found
 * @throws {Error} 				If an other error is met
 */
function getOne (name_query, filters) {

	logger.debug({ method : 'getOne', point : logger.pt.start, params : {
		name_query : name_query,
		filters    : filters
	} });

	let promise = daoManager.getQuery('getOne', name_query, filters)
		.then(function (query) {
			return userModel.findOneAsync(query);
		})
		.then(function (user) {
			logger.debug({ method : 'getOne', point : logger.pt.end });

			if (!user) {
				throw new Exception.NoResultEx('No user found');
			}
			return BPromise.resolve(user);
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'getOne', point : logger.pt.catch });
			throw err;
		});

	return promise;
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

	logger.debug({ method : 'validatePassword', point : logger.pt.start, params : {
		log  : log,
		pass : pass
	} });

	let promise = userModel.findOne({ 'local.email' : log })
		.select('+local.password')
		.then(function(user) {
			if(!user) {
				throw new Exception.NoResultEx('No user found');
			}

			let validPassword = user.comparePassword(pass);

			if (!validPassword) {
				throw new Exception.LoginEx('Wrong password');
			}

			user.local.password = undefined;

			logger.debug({ method : 'validatePassword', point : logger.pt.end });

			return BPromise.resolve(user);
		})
		.then(undefined, function (err){
			logger.debug(err.message, { method : 'validatePassword', point : logger.pt.catch });
			throw err;
		});

	return BPromise.resolve(promise);
}

module.exports = {
	create (input) {
		return create(input);
	},
	update (input) {
		return update(input);
	},
	remove (name_query, filters) {
		return remove(name_query, filters);
	},
	getAll () {
		return getAll();
	},
	getOne (name_query, filters) {
		return getOne(name_query, filters);
	},
	validatePassword (log, pass) {
		return validatePassword(log, pass);
	}
};