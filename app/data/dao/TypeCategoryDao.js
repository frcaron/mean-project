"use strict";

// Inject
var BPromise          = require('bluebird');
var Logger            = require(global.__app + '/LoggerManager');
var ErrorManager      = require(global.__app + '/ErrorManager');
var TypeCategoryModel = require(global.__model + '/TypeCategoryModel');
var CountersModel     = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 		Data to create
 * @return {TypeCategoryModel} 	Object created
 * @throws {DuplicateError} 	If index model is not unique
 * @throws {Error} 				If an other error is met
 */
function create (input) {

	Logger.debug('TypeCategoryDao#create [start]');

	var typeCategory = new TypeCategoryModel();
	var promise = CountersModel.getNextSequence('type_category_id')
		.then(function (seq){

			typeCategory._id  = seq;
			typeCategory.type = input.type;
			if( input.active !== undefined ) {
				typeCategory.active = input.active;
			}

			return typeCategory.saveAsync();
		})
		.then(function () {
			return BPromise.resolve(typeCategory);
		})
		.catch(function (err) {
			Logger.error('TypeCategoryDao#create | ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Type Category already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('TypeCategoryDao#create [end]');

	return promise;
}

/** 
 * @param  {Json} input 		Data to update
 * @return {TypeCategoryModel} 	Object updated
 * @throws {DuplicateError} 	If index model is not unique
 * @throws {NoResultError} 		If id doesn't exist
 * @throws {Error} 				If an other error is met
 */
function update (input) {

	Logger.debug('TypeCategoryDao#update [start]');

	var output;
	var promise = getOne(input)
		.then(function (typeCategory) {
			if( input.type ) {
				typeCategory.type   = input.type;
			}
			if( input.active !== undefined ) {
				typeCategory.active = input.active;
			}
			output = typeCategory;
			return typeCategory.saveAsync();
		})
		.then(function () {
			return BPromise.resolve(output);
		})
		.catch(function (err) {
			Logger.error('TypeCategoryDao#update | ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Type Category already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('TypeCategoryDao#update [end]');

	return promise;
}

/**
 * @param {Json} Filters 		Keys : 	- active
 * 										- empty
 * @return {TypeCategoryModel}	List of object found
 * @throws {Error} 				If anything error is met
 */
function getAll (filters) {

	Logger.debug('TypeCategoryDao#getAll [start]');

	var promise;
	if(filters.active) {
		promise = TypeCategoryModel.findAsync({
					active : filters.active
				});

	} else {
		promise = TypeCategoryModel.findAsync();
	}

	var promiseEnd = promise
		.catch(function (err) {
			Logger.error('TypeCategoryDao#getAll | ' + err.message);

			throw err;
		});

	Logger.debug('TypeCategoryDao#getAll [end]');

	return promiseEnd;
}

/**
 * @param  {Json} filters 		Keys : 	- id
 * 										- type
 * @return {TypeCategoryModel}	Object found
 * @throws {ParamsError} 		If params given are wrong
 * @throws {NoResultError} 		If no result found
 * @throws {Error} 				If an other error is met
 */
function getOne (filters) {

	Logger.debug('TypeCategoryDao#getOne [start]');
	
	var promise;
	if(filters.id) {
		promise = TypeCategoryModel.findByIdAsync(filters.id);

	} else if(filters.type) {
		promise = TypeCategoryModel.findOneAsync({
					type : filters.type
				});

	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.then(function (typeCategory) {
			if (!typeCategory) {
				throw new ErrorManager.NoResultError('Type Category not found');
			}
			return BPromise.resolve(typeCategory);
		})
		.catch(function (err) {
			Logger.error('TypeCategoryDao#getOne | ' + err.message);

			throw err;
		});

	Logger.debug('TypeCategoryDao#getOne [end]');

	return promiseEnd;
}

module.exports = {
	name   : 'TypeCategoryDao',
	create : function (input) {
		return create(input);
	},
	update : function (input) {
		return update(input);
	},
	getAll : function (filters) {
		return getAll(filters);
	},
	getOne : function (filters) {
		return getOne(filters);
	}
};