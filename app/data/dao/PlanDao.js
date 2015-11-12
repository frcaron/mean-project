// Inject
var Promise       = require('bluebird');
var ErrorManager  = require(global.__app) + '/ErrorManager');
var PlanModel     = require(global.__model + '/PlanModel');
var CountersModel = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 	Data to create
 * @return {PlanModel} 		Object created
 * @throws {DuplicateError} If index model is not unique
 * @throws {Error} 			If an other error is met
 */
function create (input) {

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
			return Promise.resolve(plan);
		})
		.catch(function (err) {
			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('User already exist');
			} else {
				throw err;
			}
		});

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
			return Promise.resolve(output);
		})
		.catch(function (err) {
			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('User already exist');
			} else {
				throw err;
			}
		});

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
 * @return {PlanModel}		List of object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {Error} 			If an other error is met
 */
function getAll (filters) {

	var promise;
	if(filters.user_id) {
		promise = PlanModel.findAsync({
						_user : filters.user_id
					});

	} else {
		promise = Promise.reject(new ErrorManager.ParamsError('Filters missin'));
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
 * @return {PlanModel}		Object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {NoResultError} 	If no result found
 * @throws {Error} 			If an other error is met
 */
function getOne (filters) {

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
		promise = Promise.reject(new ErrorManager.ParamsError('Filters missing)'));
	}
		
	var promiseEnd = promise
		.then(function (plan) {
			if (!plan) {
				throw new ErrorManager.NoResultError('Plan not found');
			}
			return Promise.resolve(plan);
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