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
					throw new Error('Plan already exist');
				} else {
					throw err;
				}
			});

		return promise;
}

function update (id, input) {

		var output;
		var promise = getOne(id, input.user_id)
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
				Promise.resolve(output);
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function remove (id, user_id) {

		var promise = getOne(id, user_id)
			.then(function (plan){
				return plan.removeAsync();
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getAll (user_id) {

		var promise = PlanModel.findAsync({
						_user : user_id
					})
			.then(function (plans) {
				Promise.resolve(plans);
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getOne (id, user_id) {

		var promise;
		if(user_id) {
			promise = PlanModel.findByIdAsync({
						_id   : id,
						_user : user_id
					});
		} else  {
			promise = PlanModel.findByIdAsync({
						_id : id
					});
		}
			
		promise
			.then(function (plan) {
				if (!plan) {
					throw new Error('Plan not found');
				}
				Promise.resolve(plan);
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

module.exports = {
	create : function (input) {
		return create(input);
	},

	update : function (id, input) {
		return update(id, input);
	},

	remove : function (id, user_id) {
		return remove(id, user_id);
	},

	getAll : function (user_id) {
		return getAll(user_id);
	},

	getOne : function (id, user_id) {
		return getOne(id, user_id);
	}
};