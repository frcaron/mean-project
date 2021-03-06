"use strict";

// Inject
var path          = require('path');
var BPromise      = require('bluebird');
var daoManager    = require(path.join(global.__dao, 'manager'))('program');
var programModel  = require(path.join(global.__model, 'program'));
var countersModel = require(path.join(global.__model, 'counters'));
var Exception     = require(path.join(global.__core, 'exception'));
var logger        = require(path.join(global.__core, 'logger'))('dao', __filename);

/**
 * @param  {Json} input 	Data to create
 * @return {ProgramModel} 	Object created
 * @throws {DuplicateEx} 	If index model is not unique
 * @throws {Error} 			If an other error is met
 */
function create (input) {

	logger.debug({ method : 'create', point : logger.pt.start, params : {
		input : input
	} });

	let program = new programModel();
	let promise = countersModel.getNextSequence('program_id')
		.then(function (seq){

			program._id        = seq;
			program._plan      = input.plan_id;
			program._category  = input.category_id;
			if( input.budget ) {
				program.budget = input.budget;
			}
			program._user      = input.user_id;

			return program.saveAsync();
		})
		.then(function () {
			logger.debug({ method : 'create', point : logger.pt.end });

			return BPromise.resolve(program);
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'create', point : logger.pt.catch });

			if (err.code === 11000) {
				throw new Exception.DuplicateEx('Program already exist');
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
 * @param  {Json} filters 	keys : 	- NO
 * @return {ProgramModel} 	Object updated
 * @throws {DuplicateEx} 	If index model is not unique
 * @throws {NoResultEx} 	If id doesn't exist
 * @throws {Error} 			If an other error is met
 */
function update (input, filters) {

	logger.debug({ method : 'update', point : logger.pt.start, params : {
		input   : input,
		filters : filters
	} });

	let promise;
	if (filters) {
		promise = BPromise.reject(new Exception.ParamEx('Filters forbidden'));
	} else {
		promise = getOne('byIdU', {
				program_id : input.program_id,
				user_id    : input.user_id
			})
			.then(function (program) {
				if( input.category_id ) {
					program._category = input.category_id;
				}
				if( input.budget ) {
					program.budget    = input.budget;
				}
				return program.saveAsync()
					.then(function () {
						return BPromise.resolve(program);
					});
			});
	}

	let promiseEnd = promise
		.then(function (program) {
			logger.debug({ method : 'update', point : logger.pt.end });

			return BPromise.resolve(program);
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'update', point : logger.pt.catch });

			if (err.code === 11000) {
				throw new Exception.DuplicateEx('Program already exist');
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

	return promiseEnd;
}

/**
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {}
 * @throws {ParamEx} 			If params given are wrong
 * @throws {Error} 				If an other error is met
 */
function remove (name_query, filters) {

	logger.debug({ method : 'remove', point : logger.pt.start, params : {
		name_query : name_query,
		filters    : filters
	} });

	let promise = daoManager.getQuery('remove', name_query, filters)
			.then(function (query) {
				return programModel.removeAsync(query);
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
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {ProgramModel}		List of object found
 * @throws {ParamEx} 			If params given are wrong
 * @throws {Error} 				If an other error is met
 */
function getAll (name_query, filters) {

	logger.debug({ method : 'getAll', point : logger.pt.start, params : {
		name_query : name_query,
		filters    : filters
	} });

	let promise = daoManager.getQuery('getAll', name_query, filters)
		.then(function (query) {
			return programModel.findAsync(query);
		})
		.then(function (programs) {
			logger.debug({ method : 'getAll', point : logger.pt.end });

			return BPromise.resolve(programs);
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
 * @return {ProgramModel}		Object found
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
			return programModel.findOneAsync(query);
		})
		.then(function (program) {
			logger.debug({ method : 'getOne', point : logger.pt.end });

			if (!program) {
				throw new Exception.NoResultEx('No program found');
			}
			return BPromise.resolve(program);
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