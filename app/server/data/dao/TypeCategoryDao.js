"use strict";

// Inject
var BPromise          = require('bluebird');
var ExManager         = require(global.__server + '/ExceptionManager');
var Logger            = require(global.__server + '/LoggerManager');
var TypeCategoryModel = require(global.__model + '/TypeCategoryModel');
var CountersModel     = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 		Data to create
 * @return {TypeCategoryModel} 	Object created
 * @throws {DuplicateEx} 	If index model is not unique
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
				throw new ExManager.DuplicateEx('Type Category already exist');
			} if(err.name === 'ValidationError') {
				let detail = [];
				Object.keys(err.errors).map(function(prop) {
					detail.push(err.errors[prop].message);
				});
				throw new ExManager.ValidatorEx(err.message, detail);
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
 * @throws {DuplicateEx} 	If index model is not unique
 * @throws {NoResultEx} 		If id doesn't exist
 * @throws {Error} 				If an other error is met
 */
function update (input) {

	Logger.debug('[DAO - START] TypeCategoryDao#update');
	Logger.debug('              -- input : ' + JSON.stringify(input));

	let promise = getOne({ type_category_id : input.type_category_id })
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
				throw new ExManager.DuplicateEx('Type Category already exist');
			} if(err.name === 'ValidationError') {
				let detail = [];
				Object.keys(err.errors).map(function(prop) {
					detail.push(err.errors[prop].message);
				});
				throw new ExManager.ValidatorEx(err.message, detail);
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
 * @param  {Json} filters 		Keys : 	- type_category_id
 * @return {TypeCategoryModel}	Object found
 * @throws {ParamEx} 		If params given are wrong
 * @throws {NoResultEx} 		If no result found
 * @throws {Error} 				If an other error is met
 */
function getOne (filters) {

	Logger.debug('[DAO - START] TypeCategoryDao#getOne');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.type_category_id) {
		promise = TypeCategoryModel.findByIdAsync(filters.type_category_id);

	}

	if(!promise) {
		promise = BPromise.reject(new ExManager.ParamEx('Filters missing'));
	}

	let promiseEnd = promise
		.then(function (typeCategory) {
			if (!typeCategory) {
				throw new ExManager.NoResultEx('Type Category not found');
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