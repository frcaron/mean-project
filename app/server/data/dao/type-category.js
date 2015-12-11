"use strict";

// Inject
var path              = require('path');
var BPromise          = require('bluebird');
var daoManager        = require(path.join(global.__dao, 'manager'))('type_category');
var typeCategoryModel = require(path.join(global.__model, 'type-category'));
var countersModel     = require(path.join(global.__model, 'counters'));
var Exception         = require(path.join(global.__core, 'exception'));
var logger            = require(path.join(global.__core, 'system')).Logger;

/**
 * @param  {Json} input 		Data to create
 * @return {TypeCategoryModel} 	Object created
 * @throws {DuplicateEx} 		If index model is not unique
 * @throws {Error} 				If an other error is met
 */
function create (input) {

	logger.debug('[DAO - START] TypeCategoryDao#create');
	logger.debug('              -- input : ' + JSON.stringify(input));

	let typeCategory = new typeCategoryModel();
	let promise = countersModel.getNextSequence('type_category_id')
		.then(function (seq){

			typeCategory._id  = seq;
			typeCategory.name = input.name;

			return typeCategory.saveAsync();
		})
		.then(function () {
			return BPromise.resolve(typeCategory);
		})
		.catch(function (err) {
			logger.debug('[DAO - CATCH] TypeCategoryDao#create');
			logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new Exception.DuplicateEx('Type Category already exist');
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

	logger.debug('[DAO -   END] TypeCategoryDao#create');

	return promise;
}

/**
 * @param  {Json} input 		Data to update
 * @return {TypeCategoryModel} 	Object updated
 * @throws {DuplicateEx} 		If index model is not unique
 * @throws {NoResultEx} 		If id doesn't exist
 * @throws {Error} 				If an other error is met
 */
function update (input) {

	logger.debug('[DAO - START] TypeCategoryDao#update');
	logger.debug('              -- input : ' + JSON.stringify(input));

	let promise = getOne('byId', { type_category_id : input.type_category_id })
		.then(function (typeCategory) {

			if( input.name ) {
				typeCategory.name = input.name;
			}

			return typeCategory.saveAsync()
				.then(function () {
					return BPromise.resolve(typeCategory);
				});
		})
		.catch(function (err) {
			logger.debug('[DAO - CATCH] TypeCategoryDao#update');
			logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new Exception.DuplicateEx('Type Category already exist');
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

	logger.debug('[DAO -   END] TypeCategoryDao#update');

	return promise;
}

/**
 * @return {TypeCategoryModel}	List of object found
 * @throws {Error} 				If anything error is met
 */
function getAll () {

	logger.debug('[DAO - START] TypeCategoryDao#getAll');

	let promise = typeCategoryModel.findAsync()
		.catch(function (err) {
			logger.debug('[DAO - CATCH] TypeCategoryDao#getAll');
			logger.error('              -- message : ' + err.message);

			throw err;
		});

	logger.debug('[DAO -   END] TypeCategoryDao#getAll');

	return promise;
}

/**
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {TypeCategoryModel}	Object found
 * @throws {ParamEx} 			If params given are wrong
 * @throws {NoResultEx} 		If no result found
 * @throws {Error} 				If an other error is met
 */
function getOne (name_query, filters) {

	logger.debug('[DAO - START] TypeCategoryDao#getOne');
	logger.debug('              -- name_query : ' + name_query);
	logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		promise = daoManager.getQuery('getOne', name_query, filters)
			.then(function (query) {
				return typeCategoryModel.findOneAsync(query);
			});
	} catch (err) {
		promise = BPromise.reject(err);
	}

	let promiseEnd = promise
		.then(function (typeCategory) {
			if (!typeCategory) {
				throw new Exception.NoResultEx('No type category found');
			}
			return BPromise.resolve(typeCategory);
		})
		.catch(function (err) {
			logger.debug('[DAO - CATCH] TypeCategoryDao#getOne');
			logger.error('              -- message : ' + err.message);

			throw err;
		});

	logger.debug('[DAO -   END] TypeCategoryDao#getOne');

	return promiseEnd;
}

module.exports = {
	create (input) {
		return create(input);
	},
	update (input) {
		return update(input);
	},
	getAll () {
		return getAll();
	},
	getOne (name_query, filters) {
		return getOne(name_query, filters);
	}
};