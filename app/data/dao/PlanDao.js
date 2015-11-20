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

	Logger.debug('[DAO - START] PlanDao#create');
	Logger.debug('              -- input : ' + JSON.stringify(input));

	let plan = new PlanModel();
	let promise = CountersModel.getNextSequence('plan_id')
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
			Logger.debug('[DAO - CATCH] PlanDao#create');
			Logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Plan already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('[DAO -   END] PlanDao#create');

	return promise;
}

/**
 * @param  {Json} input 	Data to update
 * @param  {Json} filters 	keys : 	- NO
 * @return {PlanModel} 		Object updated
 * @throws {DuplicateError} If index model is not unique
 * @throws {NoResultError} 	If id doesn't exist
 * @throws {Error} 			If an other error is met
 */
function update (input, filters) {

	Logger.debug('[DAO - START] PlanDao#update');
	Logger.debug('              -- input   : ' + JSON.stringify(input));
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters) {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters forbidden'));
	} else {
		promise = getOne({
				id      : input.id,
				user_id : input.user_id
			})
			.then(function (plan) {
				if ( input.month ) {
					plan.month = input.month;
				}
				if ( input.year ) {
					plan.year  = input.year;
				}
				return plan.saveAsync()
					.then(function () {
						return BPromise.resolve(plan);
					});
			});
	}

	let promiseEnd = promise
		.then(function (plan) {
			return BPromise.resolve(plan);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] PlanDao#update');
			Logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Plan already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('[DAO -   END] PlanDao#update');

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

	Logger.debug('[DAO - START] PlanDao#remove');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		let id = filters.id || filters.plan_id;
		if(id) {
			promise = PlanModel.removeAsync({
				_id   : id,
				_user : filters.user_id
			});

		} else {
			promise = PlanModel.removeAsync({ _user : filters.user_id });
		}
	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	let promiseEnd = promise
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] PlanDao#remove');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] PlanDao#remove');

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : - user_id
 * @return {PlanModel}		List of object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {Error} 			If an other error is met
 */
function getAll (filters) {

	Logger.debug('[DAO - START] PlanDao#getAll');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		promise = PlanModel.findAsync({
						_user : filters.user_id
					});

	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing "user_id"'));
	}

	let promiseEnd = promise
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] PlanDao#getAll');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] PlanDao#getAll');

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : 	- id
 *                         			- user_id
 * 									- month
 * 									- year
 * @return {PlanModel}		Object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {NoResultError} 	If no result found
 * @throws {Error} 			If an other error is met
 */
function getOne (filters) {

	Logger.debug('[DAO - START] PlanDao#getOne');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		if(filters.id) {
			promise = PlanModel.findOneAsync({
						_id   : filters.id,
						_user : filters.user_id
					});

		} else if(filters.month && filters.year) {
			promise = PlanModel.findOneAsync({
						month : filters.month,
						year  : filters.year,
						_user : filters.user_id
					});
		} else {
			promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
		}
	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing "user_id"'));
	}

	let promiseEnd = promise
		.then(function (plan) {
			if (!plan) {
				throw new ErrorManager.NoResultError('Plan not found');
			}
			return BPromise.resolve(plan);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] PlanDao#getOne');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] PlanDao#getOne');

	return promiseEnd;
}

module.exports = {
	name   : 'PlanDao',
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