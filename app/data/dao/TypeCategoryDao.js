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

	Logger.debug('[DAO - START] TypeCategoryDao#create');
	Logger.debug('              -- input : ' + JSON.stringify(input));

	let typeCategory = new TypeCategoryModel();
	let promise = CountersModel.getNextSequence('type_category_id')
		.then(function (seq){

			typeCategory._id  = seq;
			typeCategory.name = input.name;

			return typeCategory.saveAsync();
		})
		.then(function () {
			return BPromise.resolve(typeCategory);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] TypeCategoryDao#create');
			Logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Type Category already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('[DAO -   END] TypeCategoryDao#create');

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

	Logger.debug('[DAO - START] TypeCategoryDao#update');
	Logger.debug('              -- input : ' + JSON.stringify(input));

	let promise = getOne({ id : input.id })
		.then(function (typeCategory) {
			if( input.name ) {
				typeCategory.name = input.name;
			}
			return typeCategory.saveAsync()
				.then(function () {
					return BPromise.resolve(typeCategory);
				});
		})
		.then(function (typeCategory) {
			return BPromise.resolve(typeCategory);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] TypeCategoryDao#update');
			Logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Type Category already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('[DAO -   END] TypeCategoryDao#update');

	return promise;
}

/**
 * @return {TypeCategoryModel}	List of object found
 * @throws {Error} 				If anything error is met
 */
function getAll () {

	Logger.debug('[DAO - START] TypeCategoryDao#getAll [start]');

	let promise = TypeCategoryModel.findAsync()
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] TypeCategoryDao#getAll');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] TypeCategoryDao#getAll');

	return promise;
}

/**
 * @param  {Json} filters 		Keys : 	- id
 * @return {TypeCategoryModel}	Object found
 * @throws {ParamsError} 		If params given are wrong
 * @throws {NoResultError} 		If no result found
 * @throws {Error} 				If an other error is met
 */
function getOne (filters) {

	Logger.debug('[DAO - START] TypeCategoryDao#getOne');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));
	
	let promise;
	if(filters.id) {
		promise = TypeCategoryModel.findByIdAsync(filters.id);

	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	let promiseEnd = promise
		.then(function (typeCategory) {
			if (!typeCategory) {
				throw new ErrorManager.NoResultError('Type Category not found');
			}
			return BPromise.resolve(typeCategory);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] TypeCategoryDao#getOne');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] TypeCategoryDao#getOne');

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
	getAll : function () {
		return getAll();
	},
	getOne : function (filters) {
		return getOne(filters);
	}
};