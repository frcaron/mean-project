"use strict";

// Inject
var BPromise      = require('bluebird');
var Logger        = require(global.__server + '/LoggerManager');
var ErrorManager  = require(global.__server + '/ErrorManager');
var ProgramModel  = require(global.__model + '/ProgramModel');
var CountersModel = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 	Data to create
 * @return {ProgramModel} 	Object created
 * @throws {DuplicateError} If index model is not unique
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
				throw new ErrorManager.DuplicateError('Program already exist');
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
 * @throws {DuplicateError} If index model is not unique
 * @throws {NoResultError} 	If id doesn't exist
 * @throws {Error} 			If an other error is met
 */
function update (input, filters) {

	Logger.debug('[DAO - START] ProgramDao#update');
	Logger.debug('              -- input   : ' + JSON.stringify(input));
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if (filters) {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters forbidden'));
	} else {
		promise = getOne({
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
			return BPromise.resolve(program);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] ProgramDao#update');
			Logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Program already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('[DAO -   END] ProgramDao#update');

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : 	- program_id
 * 									- user_id
 * 									- plan_id
 * @return {}
 * @throws {ParamsError} 	If params given are wrong
 * @throws {Error} 			If an other error is met
 */
function remove (filters) {

	Logger.debug('[DAO - START] ProgramDao#remove');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		if(filters.program_id) {
			promise = ProgramModel.removeAsync({
				_id   : filters.program_id,
				_user : filters.user_id
			});

		} else if(filters.plan_id) {
			promise = ProgramModel.removeAsync({
				_plan : filters.plan_id,
				_user : filters.user_id
			});

		}
	}

	if(!promise) {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
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
 * @param  {Json} filters 	Keys : 	- user_id
 *                         			- plan_id
 *                         			- [ categories_id ]
 * @return {ProgramModel}	List of object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {Error} 			If an other error is met
 */
function getAll (filters) {

	Logger.debug('[DAO - START] ProgramDao#getAll');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		if(filters.plan_id) {
			if(filters.categories_id && filters.categories_id.length) {
				promise = ProgramModel.findAsync({
					_category : { $in : filters.categories_id },
					_plan     : filters.plan_id,
					_user     : filters.user_id
				});
			} else {
				promise = ProgramModel.findAsync({
					_plan : filters.plan_id,
					_user : filters.user_id
				});
			}
		} else if(filters.categories_id && filters.categories_id.length) {
			promise = ProgramModel.findAsync({
				_category : { $in : filters.categories_id },
				_user     : filters.user_id
			});
		}
	}

	if(!promise) {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
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
 * @param  {Json} filters 	Keys : 	- id
 *                         			- user_id
 *                         			- category_id
 *                         			- plan_id
 * @return {ProgramModel}	Object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {NoResultError} 	If no result found
 * @throws {Error} 			If an other error is met
 */
function getOne (filters) {

	Logger.debug('[DAO - START] ProgramDao#getOne');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		if(filters.program_id) {
			promise = ProgramModel.findOneAsync({
						_id   : filters.program_id,
						_user : filters.user_id
					});

		} else if(filters.category_id && filters.plan_id) {
			promise = ProgramModel.findOneAsync({
						_category : filters.category_id,
						_plan     : filters.plan_id,
						_user     : filters.user_id
					});

		}
	}

	if(!promise) {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	let promiseEnd = promise
		.then(function (program) {
			if (!program ) {
				throw new ErrorManager.NoResultError('Program not found');
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
	name   : 'ProgramDao',
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