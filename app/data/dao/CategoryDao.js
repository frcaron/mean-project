"use strict";

// Inject
var BPromise      = require('bluebird');
var Logger        = require(global.__app + '/LoggerManager');
var ErrorManager  = require(global.__app + '/ErrorManager');
var CategoryModel = require(global.__model + '/CategoryModel');
var CountersModel = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 	Data to create
 * @return {CategoryModel} 	Object created
 * @throws {DuplicateError} If index model is not unique
 * @throws {Error} 			If an other error is met
 */
function create (input) {

	Logger.debug('CategoryDao#create [start]');
	Logger.debug('-- input : ' + JSON.stringify(input));

	var category = new CategoryModel();
	var promise = CountersModel.getNextSequence('category_id')
		.then(function (seq){

			category._id   = seq;
			category.name  = input.name;
			category._type = input._type;
			if( input.active !== undefined ) {
				category.active = input.active;
			}
			category._user = input._user;

			return category.saveAsync();
		})
		.then(function () {
			return BPromise.resolve(category);
		})
		.catch(function (err) {
			Logger.error('CategoryDao#create | ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Category already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('CategoryDao#create [end]');

	return promise;
}

/** 
 * @param  {Json} input 	Data to update
 * @param  {Json} filters 	Keys : 	- 
 *                         			- 
 * @return {CategoryModel} 	Object updated
 * @throws {DuplicateError} If index model is not unique
 * @throws {NoResultError} 	If id doesn't exist
 * @throws {Error} 			If an other error is met
 */
function update (input, filters) {

	Logger.debug('CategoryDao#update [start]');
	Logger.debug('-- input   : ' + JSON.stringify(input));
	Logger.debug('-- filters : ' + JSON.stringify(filters));

	var promise, output;
	if(filters) {
		// TODO
		promise = CategoryModel.update();
	} else {
		promise = getOne({ 
				id      : input._id,
				user_id : input._user
			})
			.then(function (category) {
				if( input.name ) {
					category.name   = input.name;
				}
				if( input._type ) {
					category._type  = input._type;
				}
				if( input.active !== undefined ) {
					category.active = input.active;
				}
				output = category;
				return category.saveAsync();
			});
	}

	var promiseEnd = promise 
		.then(function () {
			return BPromise.resolve(output);
		})
		.catch(function (err) {
			Logger.error('CategoryDao#update | ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Category already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('CategoryDao#update [end]');

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : 	- user_id
 * 									- id / user_id
 * @return {CategoryModel}	Object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {NoResultError} 	If no result found
 * @throws {Error} 			If an other error is met
 */
function remove (filters) {

	Logger.debug('CategoryDao#remove [start]');
	Logger.debug('-- filters : ' + JSON.stringify(filters));

	var promise;
	if(filters.user_id) {
		if(filters.id) {		
			promise = CategoryModel.removeAsync({ 
				_id   : filters.id,
				_user : filters.user_id
			});

		} else {
			promise = CategoryModel.removeAsync({ _user : filters.user_id });

		}
	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.catch(function (err) {
			Logger.error('CategoryDao#remove | ' + err.message);

			throw err;
		});

	Logger.debug('CategoryDao#remove [end]');

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys :  - user_id
 *                         			- type_id
 *                         			- active
 * @return {CategoryModel}	List of object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {Error} 			If an other error is met
 */
function getAll (filters) {

	Logger.debug('CategoryDao#getAll [start]');
	Logger.debug('-- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {

		let query = {
			_type  : filters.type_id,
			active : filters.active,
			_user  : filters.user_id
		};

		promise = CategoryModel.findAsync(query);
	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	let promiseEnd = promise
		.catch(function (err) {
			Logger.error('CategoryDao#getAll | ' + err.message);

			throw err;
		});

	Logger.debug('CategoryDao#getAll [end]');

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : 	- id
 * 									- type_id
 * 									- user_id
 * @return {CategoryModel}	Object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {NoResultError} 	If no result found
 * @throws {Error} 			If an other error is met
 */
function getOne (filters) {

	Logger.debug('CategoryDao#getOne [start]');
	Logger.debug('-- filters : ' + JSON.stringify(filters));

	var promise;
	if(filters.user_id) {
		if(filters.id) {		
			promise = CategoryModel.findOneAsync({
							_id   : filters.id,
							_user : filters.user_id
						});
		} else if(filters.type_id) {
			promise = CategoryModel.findOneAsync({
							_type : filters.type_id,
							_user : filters.user_id
						});
		} else {
			promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
		}
	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}
		
	var promiseEnd = promise
		.then(function (category) {
			if (!category) {
				throw new ErrorManager.NoResultError('Category not found');
			}
			return BPromise.resolve(category);
		})
		.catch(function (err) {
			Logger.error('CategoryDao#getOne | ' + err.message);

			throw err;
		});

	Logger.debug('CategoryDao#getOne [end]');

	return promiseEnd;
}

module.exports = {
	name   : 'CategoryDao',
	create : function (input) {
		return create(input);
	},
	update : function (input, filters) {
		return update(input, filters);
	},
	remove : function (filters) {
		return remove(filters);
	},
	getAll : function (filters) {
		return getAll(filters);
	},
	getOne : function (filters) {
		return getOne(filters);
	}
};