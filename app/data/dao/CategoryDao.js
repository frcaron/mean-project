// Inject
var Promise       = require('bluebird');
var ErrorManager  = require(global.__app) + '/ErrorManager');
var CategoryModel = require(global.__model + '/CategoryModel');
var CountersModel = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 	Data to create
 * @return {CategoryModel} 	Object created
 * @throws {DuplicateError} If index model is not unique
 * @throws {Error} 			If an other error is met
 */
function create (input) {

	var category = new CategoryModel();
	var promise = CountersModel.getNextSequence('category_id')
		.then(function (seq){

			category._id    = seq;
			category.name   = input.name;
			category._type   = input.type_id;
			if( input.active !== undefined ) {
				category.active = input.active;
			}
			category._user  = input.user_id;

			return category.saveAsync();
		})
		.then(function () {
			return Promise.resolve(category);
		})
		.catch(function (err) {
			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Category already exist');
			} else {
				throw err;
			}
		});

	return promise;
}

/** 
 * @param  {Json} input 	Data to update
 * @return {CategoryModel} 	Object updated
 * @throws {DuplicateError} If index model is not unique
 * @throws {NoResultError} 	If id doesn't exist
 * @throws {Error} 			If an other error is met
 */
function update (input) {

	var output;
	var promise = getOne(input)
		.then(function (category) {
			if( input.name ) {
				category.name   = input.name;
			}
			if( input.type ) {
				category.type   = input.type;
			}
			if( input.active !== undefined ) {
				category.active = input.active;
			}
			output = category;
			return category.saveAsync();
		})
		.then(function () {
			return Promise.resolve(output);
		})
		.catch(function (err) {
			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Category already exist');
			} else {
				throw err;
			}
		});

	return promise;
}

/**
 * @param  {Json} filters 	Keys : 	- id
 * 									- id / user_id
 * @return {CategoryModel}	Object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {NoResultError} 	If no result found
 * @throws {Error} 			If an other error is met
 */
function remove (filters) {

	var promise;
	if(filters.id) {
		if(filters.user_id) {
			promise = CategoryModel.removeAsync({ 
				_id   : filters.id,
				_user : filters.user_id
			});

		} else {
			promise = CategoryModel.removeAsync({ _id : filters.id });

		}
	} else if(filters.user_id) {
		promise = CategoryModel.removeAsync({ _user : filters.user_id });
			
	} else {
		promise = Promise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.catch(function (err) {
			throw err;
		});

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : - user_id
 * @return {CategoryModel}	List of object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {Error} 			If an other error is met
 */
function getAll (filters) {

	var promise;
	if(filters.user_id) {
		promise = CategoryModel.findAsync({
					_user : filters.user_id
				});
	} else {
		promise = Promise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.catch(function (err) {
			throw err;
		});

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : 	- id
 * 									- id / user_id
 * 									- type / user_id
 * @return {CategoryModel}	Object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {NoResultError} 	If no result found
 * @throws {Error} 			If an other error is met
 */
function getOne (filters) {

	var promise;
	if(filters.id) {
		if(filters.user_id) {
			promise = CategoryModel.findOneAsync({
						_id   : filters.id,
						_user : filters.user_id
					});
		} else  {
			promise = CategoryModel.findByIdAsync(filters.id);
		}	
	} else if(filters.type && filters.user_id) {
		promise = CategoryModel.findOneAsync({
			_type : filters.type,
			_user : filters.user_id
		});
		
	} else {
		promise = Promise.reject(new ErrorManager.ParamsError('Filters missing'));
	}
		
	var promiseEnd = promise
		.then(function (category) {
			if (!category) {
				throw new ErrorManager.NoResultError('Category not found');
			}
			return Promise.resolve(category);
		})
		.catch(function (err) {
			throw err;
		});

	return promiseEnd;
}

module.exports = {
	create : function (input) {
		return create(input);
	},

	update : function (input) {
		return update(input);
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