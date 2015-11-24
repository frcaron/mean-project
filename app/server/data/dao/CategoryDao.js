"use strict";

// Inject
var BPromise      = require('bluebird');
var ExManager     = require(global.__server + '/ExceptionManager');
var Logger        = require(global.__server + '/LoggerManager');
var CategoryModel = require(global.__model + '/CategoryModel');
var CountersModel = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input     Data to create
 * @return {CategoryModel}  Object created
 * @throws {DuplicateEx} If index model is not unique
 * @throws {Error}          If an other error is met
 */
function create (input) {

	Logger.debug('[DAO - START] CategoryDao#create');
	Logger.debug('              -- input : ' + JSON.stringify(input));

	let category = new CategoryModel();
	let promise = CountersModel.getNextSequence('category_id')
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
			Logger.debug('[DAO - CATCH] CategoryDao#create');
			Logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new ExManager.DuplicateEx('Category already exist');
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

	Logger.debug('[DAO -   END] CategoryDao#create');

	return promise;
}

/**
 * @param  {Json} input     Data to update
 * @param  {Json} filters   Keys :  - NO
 * @return {CategoryModel}  Object updated
 * @throws {DuplicateEx} If index model is not unique
 * @throws {NoResultEx}  If id doesn't exist
 * @throws {Error}          If an other error is met
 */
function update (input, filters) {

	Logger.debug('[DAO - START] CategoryDao#update');
	Logger.debug('              -- input   : ' + JSON.stringify(input));
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters) {
		promise = BPromise.reject(new ExManager.ParamEx('Filters forbidden'));
	} else {
		promise = getOne({
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
		.then(function (category) {
			return BPromise.resolve(category);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] CategoryDao#update');
			Logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new ExManager.DuplicateEx('Category already exist');
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

	Logger.debug('[DAO -   END] CategoryDao#update');

	return promiseEnd;
}

/**
 * @param  {Json} filters   Keys :  - user_id
 *                                  - id / user_id
 * @return {CategoryModel}  Object found
 * @throws {ParamEx}    If params given are wrong
 * @throws {NoResultEx}  If no result found
 * @throws {Error}          If an other error is met
 */
function remove (filters) {

	Logger.debug('[DAO - START] CategoryDao#remove');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		if(filters.category_id) {
			promise = CategoryModel.removeAsync({
				_id   : filters.category_id,
				_user : filters.user_id
			});

		} else {
			promise = CategoryModel.removeAsync({ _user : filters.user_id });

		}
	}

	if(!promise) {
		promise = BPromise.reject(new ExManager.ParamEx('Filters missing'));
	}

	let promiseEnd = promise
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] CategoryDao#remove');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] CategoryDao#remove');

	return promiseEnd;
}

/**
 * @param  {Json} filters   Keys :  - user_id
 *                                  - type_category_id
 *                                  - no_categories_id
 *                                  - neutre
 * @return {CategoryModel}  List of object found
 * @throws {ParamEx}    If params given are wrong
 * @throws {Error}          If an other error is met
 */
function getAll (filters) {

	Logger.debug('[DAO - START] CategoryDao#getAll');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		if(filters.type_category_id) {
			if(filters.no_categories_id) {
				if(filters.no_categories_id.length) {
					promise = CategoryModel.findAsync({
						_id    : { $nin : filters.no_categories_id },
						_type  : filters.type_category_id,
						active : true,
						_user  : filters.user_id
					});
				}
			} else {
				promise = CategoryModel.findAsync({
					_type  : filters.type_category_id,
					active : true,
					_user  : filters.user_id
				});
			}
		} else if(filters.neutre !== undefined) {
			promise = CategoryModel.findAsync({
				active : true,
				neutre : filters.neutre,
				_user  : filters.user_id
			});
		} else {
			promise = CategoryModel.findAsync({
				active : true,
				_user  : filters.user_id
			});
		}
	}

	if(!promise) {
		promise = BPromise.reject(new ExManager.ParamEx('Filters missing'));
	}

	let promiseEnd = promise
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] CategoryDao#getAll');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] CategoryDao#getAll');

	return promiseEnd;
}

/**
 * @param  {Json} filters   Keys :  - category_id
 *                                  - type_category_id
 *                                  - neutre
 *                                  - user_id
 *                                  - name
 * @return {CategoryModel}  Object found
 * @throws {ParamEx}    If params given are wrong
 * @throws {NoResultEx}  If no result found
 * @throws {Error}          If an other error is met
 */
function getOne (filters) {

	Logger.debug('[DAO - START] CategoryDao#getOne');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		if(filters.category_id) {
			promise = CategoryModel.findOneAsync({
				_id    : filters.category_id,
				_user  : filters.user_id
			});
		} else if(filters.neutre) {
			if(filters.type_category_id) {
				promise = CategoryModel.findOneAsync({
					_type  : filters.type_category_id,
					active : true,
					neutre : true,
					_user  : filters.user_id
				});
			} else {
				promise = CategoryModel.findOneAsync({
					active : true,
					neutre : true,
					_user  : filters.user_id
				});
			}
		} if(filters.name && filters.type_category_id) {
				promise = CategoryModel.findOneAsync({
					name  : filters.name,
					_type : filters.type_category_id,
					_user : filters.user_id
				});
		}
	}

	if(!promise) {
		promise = BPromise.reject(new ExManager.ParamEx('Filters missing'));
	}

	let promiseEnd = promise
		.then(function (category) {
			if (!category) {
				throw new ExManager.NoResultEx('Category not found');
			}
			return BPromise.resolve(category);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] CategoryDao#getOne');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] CategoryDao#getOne');

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