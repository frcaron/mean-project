"use strict";

// Inject
var BPromise      = require('bluebird');
var Logger        = require(global.__app + '/LoggerManager');
var ErrorManager  = require(global.__app + '/ErrorManager');
var PlanModel     = require(global.__model + '/PlanModel');
var CountersModel = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 	Data to create
 * @return {PlanModel} 		Object created
 * @throws {DuplicateError} If index model is not unique
 * @throws {Error} 			If an other error is met
 */
function create (input) {

	Logger.debug('PlanDao#create [Start]');

	var plan = new PlanModel();
	var promise = CountersModel.getNextSequence('plan_id')
		.then(function (seq){

			plan._id   = seq;
			plan.month = input.month;
			plan.year  = input.year;
			plan._user = input.user_id;

			return plan.saveAsync();
		})
		.then(function () {
			return BPromise.resolve(plan);
		})
		.catch(function (err) {
			Logger.error('PlanDao#create | ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Plan already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('PlanDao#create [end]');

	return promise;
}

/** 
 * @param  {Json} input 	Data to update
 * @return {PlanModel} 		Object updated
 * @throws {DuplicateError} If index model is not unique
 * @throws {NoResultError} 	If id doesn't exist
 * @throws {Error} 			If an other error is met
 */
function update (input) {

	Logger.debug('PlanDao#update [Start]');

	var output;
	var promise = getOne(input)
		.then(function (plan) {
			if ( input.month ) { 
				plan.month = input.month;
			}
			if ( input.year ) { 
				plan.year  = input.year;
			}
			output = plan;
			return plan.saveAsync();
		})
		.then(function () {
			return BPromise.resolve(output);
		})
		.catch(function (err) {
			Logger.error('PlanDao#update | ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Plan already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('PlanDao#update [end]');

	return promise;
}

/**
 * @param  {Json} filters 	Keys : 	- id
 * 									- user_id 
 * 									- id / user_id
 * @return {} 
 * @throws {ParamsError} 	If params given are wrong
 * @throws {Error} 			If an other error is met
 */
function remove (filters) {

	Logger.debug('PlanDao#remove [Start]');

	var promise;
	if(filters.id) {
		if(filters.user_id) {
			promise = PlanModel.removeAsync({ 
				_id   : filters.id,
				_user : filters.user_id
			});

		} else {
			promise = PlanModel.removeAsync({ _id : filters.id });

		}
	} else if(filters.user_id) {
		promise = PlanModel.removeAsync({ _user : filters.user_id });
			
	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.catch(function (err) {
			Logger.error('PlanDao#remove | ' + err.message);

			throw err;
		});

	Logger.debug('PlanDao#remove [end]');

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : - user_id
 * @return {PlanModel}		List of object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {Error} 			If an other error is met
 */
function getAll (filters) {

	Logger.debug('PlanDao#getAll [Start]');

	var promise;
	if(filters.user_id) {
		promise = PlanModel.findAsync({
						_user : filters.user_id
					});

	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missin'));
	}

	var promiseEnd = promise
		.catch(function (err) {
			Logger.error('PlanDao#getAll | ' + err.message);

			throw err;
		});

	Logger.debug('PlanDao#getAll [end]');

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : 	- id
 * 									- id / user_id
 * @return {PlanModel}		Object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {NoResultError} 	If no result found
 * @throws {Error} 			If an other error is met
 */
function getOne (filters) {

	Logger.debug('PlanDao#getOne [Start]');

	var promise;
	if(filters.id) {
		if(filters.user_id) {
			promise = PlanModel.findOneAsync({
						_id   : filters.id,
						_user : filters.user_id
					});

		} else  {
			promise = PlanModel.findByIdAsync(filters.id);
		}
	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing)'));
	}
		
	var promiseEnd = promise
		.then(function (plan) {
			if (!plan) {
				throw new ErrorManager.NoResultError('Plan not found');
			}
			return BPromise.resolve(plan);
		})
		.catch(function (err) {
			Logger.error('PlanDao#getOne | ' + err.message);

			throw err;
		});

	Logger.debug('PlanDao#getOne [end]');

	return promiseEnd;
}

module.exports = {
	name   : 'PlanDao',
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