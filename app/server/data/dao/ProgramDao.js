"use strict";

// Inject
var Path          = require('path');
var BPromise      = require('bluebird');
var Exception     = require(Path.join(global.__server, 'ExceptionManager'));
var Logger        = require(Path.join(global.__server, 'LoggerManager'));
var DaoManager    = require(Path.join(global.__dao, 'DaoManager'))('program');
var ProgramModel  = require(Path.join(global.__model, 'ProgramModel'));
var CountersModel = require(Path.join(global.__model, 'CountersModel'));

/**
 * @param  {Json} input 	Data to create
 * @return {ProgramModel} 	Object created
 * @throws {DuplicateEx} 	If index model is not unique
 * @throws {Error} 			If an other error is met
 */
function create (input) {

	Logger.debug('[DAO - START] ProgramDao#create');
	Logger.debug('              -- input : ' + JSON.stringify(input));

	let program = new ProgramModel();
	let promise = CountersModel.getNextSequence('program_id')
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
			return BPromise.resolve(program);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] ProgramDao#create');
			Logger.error('              -- message : ' + err.message);

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

	Logger.debug('[DAO -   END] ProgramDao#create');

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

	Logger.debug('[DAO - START] ProgramDao#update');
	Logger.debug('              -- input   : ' + JSON.stringify(input));
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

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
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] ProgramDao#update');
			Logger.error('              -- message : ' + err.message);

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

	Logger.debug('[DAO -   END] ProgramDao#update');

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

	Logger.debug('[DAO - START] ProgramDao#remove');
	Logger.debug('              -- name_query : ' + name_query);
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		let query = DaoManager.getQuery('remove', name_query, filters);
		promise = ProgramModel.removeAsync(query);
	} catch (err) {
		promise = BPromise.reject(err);
	}

	let promiseEnd = promise
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] ProgramDao#remove');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] ProgramDao#remove');

	return promiseEnd;
}

/**
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {ProgramModel}		List of object found
 * @throws {ParamEx} 			If params given are wrong
 * @throws {Error} 				If an other error is met
 */
function getAll (name_query, filters) {

	Logger.debug('[DAO - START] ProgramDao#getAll');
	Logger.debug('              -- name_query : ' + name_query);
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		let query = DaoManager.getQuery('getAll', name_query, filters);
		promise = ProgramModel.findAsync(query);
	} catch (err) {
		promise = BPromise.reject(err);
	}

	let promiseEnd = promise
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] ProgramDao#getAll');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] ProgramDao#getAll');

	return promiseEnd;
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

	Logger.debug('[DAO - START] ProgramDao#getOne');
	Logger.debug('              -- name_query : ' + name_query);
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		let query = DaoManager.getQuery('getOne', name_query, filters);
		promise = ProgramModel.findOneAsync(query);
	} catch (err) {
		promise = BPromise.reject(err);
	}

	let promiseEnd = promise
		.then(function (program) {
			if (!program ) {
				throw new Exception.NoResultEx('No program found');
			}
			return BPromise.resolve(program);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] ProgramDao#getOne');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] ProgramDao#getOne');

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