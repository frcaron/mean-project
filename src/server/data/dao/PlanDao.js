"use strict";

// Inject
var Path          = require('path');
var BPromise      = require('bluebird');
var Exception     = require(Path.join(global.__server, 'ExceptionManager'));
var Logger        = require(Path.join(global.__server, 'LoggerManager'));
var DaoManager    = require(Path.join(global.__dao, 'DaoManager'))('plan');
var PlanModel     = require(Path.join(global.__model, 'PlanModel'));
var CountersModel = require(Path.join(global.__model, 'CountersModel'));

/**
 * @param  {Json} input 	Data to create
 * @return {PlanModel} 		Object created
 * @throws {DuplicateEx} 	If index model is not unique
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
				throw new Exception.DuplicateEx('Plan already exist');
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

	Logger.debug('[DAO -   END] PlanDao#create');

	return promise;
}

/**
 * @param  {Json} input 	Data to update
 * @param  {Json} filters 	keys : 	- NO
 * @return {PlanModel} 		Object updated
 * @throws {DuplicateEx} 	If index model is not unique
 * @throws {NoResultEx} 	If id doesn't exist
 * @throws {Error} 			If an other error is met
 */
function update (input, filters) {

	Logger.debug('[DAO - START] PlanDao#update');
	Logger.debug('              -- input   : ' + JSON.stringify(input));
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters) {
		promise = BPromise.reject(new Exception.ParamEx('Filters forbidden'));
	} else {
		promise = getOne('byIdU', {
				plan_id : input.plan_id,
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
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] PlanDao#update');
			Logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new Exception.DuplicateEx('Plan already exist');
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

	Logger.debug('[DAO -   END] PlanDao#update');

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

	Logger.debug('[DAO - START] PlanDao#remove');
	Logger.debug('              -- name_query : ' + name_query);
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		let query = DaoManager.getQuery('remove', name_query, filters);
		promise = PlanModel.removeAsync(query);
	} catch (err) {
		promise = BPromise.reject(err);
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
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {PlanModel}			List of object found
 * @throws {ParamEx} 			If params given are wrong
 * @throws {Error} 				If an other error is met
 */
function getAll (name_query, filters) {

	Logger.debug('[DAO - START] PlanDao#getAll');
	Logger.debug('              -- name_query : ' + name_query);
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		let query = DaoManager.getQuery('getAll', name_query, filters);
		promise = PlanModel.findAsync(query);
	} catch (err) {
		promise = BPromise.reject(err);
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
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {PlanModel}			Object found
 * @throws {ParamEx} 			If params given are wrong
 * @throws {NoResultEx} 		If no result found
 * @throws {Error} 				If an other error is met
 */
function getOne (name_query, filters) {

	Logger.debug('[DAO - START] PlanDao#getOne');
	Logger.debug('              -- name_query : ' + name_query);
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		let query = DaoManager.getQuery('getOne', name_query, filters);
		promise = PlanModel.findOneAsync(query);
	} catch (err) {
		promise = BPromise.reject(err);
	}

	let promiseEnd = promise
		.then(function (plan) {
			if (!plan) {
				throw new Exception.NoResultEx('No plan found');
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