"use strict";

// Inject
var BPromise      = require('bluebird');
var Logger        = require(global.__app + '/LoggerManager');
var ErrorManager  = require(global.__app + '/ErrorManager');
var ProgramModel  = require(global.__model + '/ProgramModel');
var CountersModel = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 	Data to create
 * @return {ProgramModel} 	Object created
 * @throws {DuplicateError} If index model is not unique
 * @throws {Error} 			If an other error is met
 */
function create (input) {

	Logger.debug('ProgramDao#create [start]');
	Logger.debug('-- input : ' + input);
	
	var program = new ProgramModel();
	var promise = CountersModel.getNextSequence('program_id')
		.then(function (seq){

			program._id        = seq;
			program._plan      = input._plan;
			program._category  = input._category;
			if( input.budget ) {
				program.budget = input.budget;
			}
			program._user      = input._user;

			return program.saveAsync();
		})
		.then(function () {
			return BPromise.resolve(program);
		})
		.catch(function (err) {
			Logger.error('ProgramDao#create | ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Program already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('ProgramDao#create [end]');

	return promise;
}

/** 
 * @param  {Json} input 	Data to update
 * @param  {Json} filters 	keys : 	- 
 *                         			- 
 * @return {ProgramModel} 	Object updated
 * @throws {DuplicateError} If index model is not unique
 * @throws {NoResultError} 	If id doesn't exist
 * @throws {Error} 			If an other error is met
 */
function update (input, filters) {

	Logger.debug('ProgramDao#update [start]');
	Logger.debug('-- input   : ' + input);
	Logger.debug('-- filters : ' + filters);

	var promise,output;
	if (filters) {
		// TODO
		promise = ProgramModel.update();
	} else {
		promise = getOne({ 
				id      : input._id,
				user_id : input._user
			})
			.then(function (program) {
				if( input.category_id ) {
					program._category = input._category;
				}
				if( input.budget ) {
					program.budget    = input.budget;
				}
				output = program;
				return program.saveAsync();
			});
	}

	var promiseEnd = promise
		.then(function () {
			return BPromise.resolve(output);
		})
		.catch(function (err) {
			Logger.error('ProgramDao#update | ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Program already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('ProgramDao#update [end]');

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : 	- user_id 
 * 									- id / user_id
 * @return {} 
 * @throws {ParamsError} 	If params given are wrong
 * @throws {Error} 			If an other error is met
 */
function remove (filters) {

	Logger.debug('ProgramDao#remove [start]');
	Logger.debug('-- filters : ' + filters);

	var promise;
	if(filters.user_id) {
		if(filters.id) {		
			promise = ProgramModel.removeAsync({ 
				_id   : filters.id,
				_user : filters.user_id
			});

		} else {
			promise = ProgramModel.removeAsync({ _user : filters.user_id });
		}
	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.catch(function (err) {
			Logger.error('ProgramDao#remove | ' + err.message);

			throw err;
		});

	Logger.debug('ProgramDao#remove [end]');

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : - user_id
 * @return {ProgramModel}	List of object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {Error} 			If an other error is met
 */
function getAll (filters) {

	Logger.debug('ProgramDao#getAll [start]');
	Logger.debug('-- filters : ' + filters);

	var promise;
	if(filters.plan_id && filters.user_id) {
		promise = ProgramModel.findAsync({
					_plan : filters.plan_id,
					_user : filters.user_id
				});
	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.catch(function (err) {
			Logger.error('ProgramDao#getAll | ' + err.message);

			throw err;
		});

	Logger.debug('ProgramDao#getAll [end]');

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : 	- id / user_id
 * @return {ProgramModel}	Object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {NoResultError} 	If no result found
 * @throws {Error} 			If an other error is met
 */
function getOne (filters) {

	Logger.debug('ProgramDao#getOne [start]');
	Logger.debug('-- filters : ' + filters);
	
	var promise;
	if(filters.user_id) {
		if(filters.id) {		
			promise = ProgramModel.findOneAsync({
						_id   : filters.id,
						_user : filters.user_id
					});

		} else  {
			promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));			
		}
	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.then(function (program) {
			if (!program ) {
				throw new ErrorManager.NoResultError('Program not found');
			}
			return BPromise.resolve(program);
		})
		.catch(function (err) {
			Logger.error('ProgramDao#getOne | ' + err.message);

			throw err;
		});

	Logger.debug('ProgramDao#getOne [end]');

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