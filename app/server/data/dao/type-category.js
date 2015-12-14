"use strict";

// Inject
var path              = require('path');
var BPromise          = require('bluebird');
var daoManager        = require(path.join(global.__dao, 'manager'))('type_category');
var typeCategoryModel = require(path.join(global.__model, 'type-category'));
var countersModel     = require(path.join(global.__model, 'counters'));
var Exception         = require(path.join(global.__core, 'exception'));
var logger            = require(path.join(global.__core, 'logger'))('dao', __filename);

/**
 * @param  {Json} input 		Data to create
 * @return {TypeCategoryModel} 	Object created
 * @throws {DuplicateEx} 		If index model is not unique
 * @throws {Error} 				If an other error is met
 */
function create (input) {

	logger.debug({ method : 'create', point : logger.pt.start, params : {
		input : input,
	} });

	let typeCategory = new typeCategoryModel();
	let promise = countersModel.getNextSequence('type_category_id')
		.then(function (seq){

			typeCategory._id  = seq;
			typeCategory.name = input.name;

			return typeCategory.saveAsync();
		})
		.then(function () {
			logger.debug({ method : 'create', point : logger.pt.end });

			return BPromise.resolve(typeCategory);
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'create', point : logger.pt.catch });

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

	logger.debug({ method : 'update', point : logger.pt.start, params : {
		input : input
	} });

	let promise = getOne('byId', { type_category_id : input.type_category_id })
		.then(function (typeCategory) {

			if( input.name ) {
				typeCategory.name = input.name;
			}

			return typeCategory.saveAsync()
				.then(function () {
					logger.debug({ method : 'update', point : logger.pt.end });

					return BPromise.resolve(typeCategory);
				});
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'update', point : logger.pt.catch });

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

	return promise;
}

/**
 * @return {TypeCategoryModel}	List of object found
 * @throws {Error} 				If anything error is met
 */
function getAll () {

	logger.debug({ method : 'getAll', point : logger.pt.start });

	let promise = typeCategoryModel.findAsync()
		.then(function (typecategories) {
			logger.debug({ method : 'getAll', point : logger.pt.end });
			return BPromise.resolve(typecategories);
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
 * @return {TypeCategoryModel}	Object found
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
			return typeCategoryModel.findOneAsync(query);
		})
		.then(function (typeCategory) {
			logger.debug({ method : 'getOne', point : logger.pt.end });

			if (!typeCategory) {
				throw new Exception.NoResultEx('No type category found');
			}
			return BPromise.resolve(typeCategory);
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'getOne', point : logger.pt.catch });
			throw err;
		});

	return promise;
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