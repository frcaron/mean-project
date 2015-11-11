// Inject
var Promise       = require('bluebird');
var PlanModel     = require(global.__model + '/PlanModel');
var CountersModel = require(global.__model + '/CountersModel');

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
				err = new Error('Plan already exist');
			} 
			return Promise.reject(err);
		});

	return promise;
}

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
				err = new Error('User already exist');
			}
			return Promise.reject(err);
		});

	return promise;
}

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
		return Promise.reject(new Error('Filters missing'));
	}

	var promiseEnd = promise
		.catch(function (err) {
			return Promise.reject(err);
		});

	return promiseEnd;
}

function getAll (filters) {

	var promise;
	if(filters.user_id) {
		promise = PlanModel.findAsync({
						_user : filters.user_id
					});

	} else {
		return Promise.reject(new Error('Filters missin'));
	}

	var promiseEnd = promise
		.then(function (plans) {
			return Promise.resolve(plans);
		})
		.catch(function (err) {
			return Promise.reject(err);
		});

	return promiseEnd;
}

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
		return Promise.reject(new Error('Filters missing)'));
	}
		
	var promiseEnd = promise
		.then(function (plan) {
			if (!plan) {
				throw new Error('Plan not found');
			}
			return Promise.resolve(plan);
		})
		.catch(function (err) {
			return Promise.reject(err);
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