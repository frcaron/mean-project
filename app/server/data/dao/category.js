"use strict";

// Inject
var path          = require('path');
var BPromise      = require('bluebird');
var daoManager    = require(path.join(global.__dao, 'manager'))('category');
var categoryModel = require(path.join(global.__model, 'category'));
var countersModel = require(path.join(global.__model, 'counters'));
var Exception     = require(path.join(global.__core, 'exception'));
var logger        = require(path.join(global.__core, 'system')).Logger;

/**
 * @param  {Json} input     Data to create
 * @return {CategoryModel}  Object created
 * @throws {DuplicateEx} 	If index model is not unique
 * @throws {Error}          If an other error is met
 */
function create (input) {

	logger.debug('[DAO - START] CategoryDao#create');
	logger.debug('              -- input : ' + JSON.stringify(input));

	let category = new categoryModel();
	let promise = countersModel.getNextSequence('category_id')
		.then(function (seq){

			category._id   = seq;
			category.name  = input.name;
			category._type = input.type_category_id;
			if( input.active !== undefined ) {
				category.active = input.active;
			}
			if( input.neutre !== undefined ) {
				category.neutre = input.neutre;
			}
			category._user = input.user_id;

			return category.saveAsync();
		})
		.then(function () {
			return BPromise.resolve(category);
		})
		.catch(function (err) {
			logger.debug('[DAO - CATCH] CategoryDao#create');
			logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new Exception.DuplicateEx('Category already exist');
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

	logger.debug('[DAO -   END] CategoryDao#create');

	return promise;
}

/**
 * @param  {Json} input     Data to update
 * @param  {Json} filters   Keys :  - NO
 * @return {CategoryModel}  Object updated
 * @throws {DuplicateEx} 	If index model is not unique
 * @throws {NoResultEx}  	If id doesn't exist
 * @throws {Error}          If an other error is met
 */
function update (input, filters) {

	logger.debug('[DAO - START] CategoryDao#update');
	logger.debug('              -- input   : ' + JSON.stringify(input));
	logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters) {
		promise = BPromise.reject(new Exception.ParamEx('Filters forbidden'));
	} else {
		promise = getOne('byIdU', {
				category_id : input.category_id,
				user_id     : input.user_id
			})
			.then(function (category) {
				if( input.name ) {
					category.name   = input.name;
				}
				if( input.type_category_id ) {
					category._type  = input.type_category_id;
				}
				if( input.active !== undefined ) {
					category.active = input.active;
				}
				return category.saveAsync()
					.then(function () {
						return BPromise.resolve(category);
					});
			});
	}

	let promiseEnd = promise
		.catch(function (err) {
			logger.debug('[DAO - CATCH] CategoryDao#update');
			logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new Exception.DuplicateEx('Category already exist');
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

	logger.debug('[DAO -   END] CategoryDao#update');

	return promiseEnd;
}

/**
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {CategoryModel}  	Object found
 * @throws {ParamEx}    		If params given are wrong
 * @throws {NoResultEx}  		If no result found
 * @throws {Error}          	If an other error is met
 */
function remove (name_query, filters) {

	logger.debug('[DAO - START] CategoryDao#remove');
	logger.debug('              -- name_query : ' + name_query);
	logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		promise = daoManager.getQuery('remove', name_query, filters)
			.then(function (query) {
				return categoryModel.removeAsync(query);
			});
	} catch (err) {
		promise = BPromise.reject(err);
	}

	if(!promise) {
		promise = BPromise.reject(new Exception.ParamEx('Filters missing'));
	}

	let promiseEnd = promise
		.catch(function (err) {
			logger.debug('[DAO - CATCH] CategoryDao#remove');
			logger.error('              -- message : ' + err.message);

			throw err;
		});

	logger.debug('[DAO -   END] CategoryDao#remove');

	return promiseEnd;
}

/**
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {CategoryModel}  	List of object found
 * @throws {ParamEx}   			If params given are wrong
 * @throws {Error}          	If an other error is met
 */
function getAll (name_query, filters) {

	logger.debug('[DAO - START] CategoryDao#getAll');
	logger.debug('              -- name_query : ' + name_query);
	logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		promise = daoManager.getQuery('getAll', name_query, filters)
			.then(function (query) {
				return categoryModel.findAsync(query);
			});
	} catch (err) {
		promise = BPromise.reject(err);
	}

	let promiseEnd = promise
		.catch(function (err) {
			logger.debug('[DAO - CATCH] CategoryDao#getAll');
			logger.error('              -- message : ' + err.message);

			throw err;
		});

	logger.debug('[DAO -   END] CategoryDao#getAll');

	return promiseEnd;
}

/**
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {CategoryModel}  	Object found
 * @throws {ParamEx}    		If params given are wrong
 * @throws {NoResultEx}  		If no result found
 * @throws {Error}          	If an other error is met
 */
function getOne (name_query, filters) {

	logger.debug('[DAO - START] CategoryDao#getOne');
	logger.debug('              -- name_query : ' + name_query);
	logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		promise = daoManager.getQuery('getOne', name_query, filters)
			.then(function (query) {
				return categoryModel.findOneAsync(query);
			});
	} catch (err) {
		promise = BPromise.reject(err);
	}

	let promiseEnd = promise
		.then(function (category) {
			if (!category) {
				throw new Exception.NoResultEx('No category found');
			}
			return BPromise.resolve(category);
		})
		.catch(function (err) {
			logger.debug('[DAO - CATCH] CategoryDao#getOne');
			logger.error('              -- message : ' + err.message);

			throw err;
		});

	logger.debug('[DAO -   END] CategoryDao#getOne');

	return promiseEnd;
}

module.exports = {
	create (input) {
		return create(input);
	},
	update (input, filters) {
   		return update(input, filters);
	},
	remove (name_query, filters) {
		return remove(name_query, filters);
	},
	getAll (name_query, filters) {
		return getAll(name_query, filters);
	},
	getOne (name_query, filters) {
		return getOne(name_query, filters);
	}
};