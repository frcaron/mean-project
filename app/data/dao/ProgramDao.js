// Inject
var Promise       = require('bluebird');
var ProgramModel  = require(global.__model + '/ProgramModel');
var CountersModel = require(global.__model + '/CountersModel');

function create (input) {

	var program = new ProgramModel();
	var promise = CountersModel.getNextSequence('program_id')
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
			return Promise.resolve(program);
		})
		.catch(function (err) {
			if (err.code === 11000) {
				err = new Error('Program already exist');
			} 
			return Promise.reject(err);
		});

	return promise;
}

function update (input) {

	var output;
	var promise = getOne(input)
		.then(function (program) {
			if( input.plan_id ) {
				program._plan     = input.plan_id;
			}
			if( input.category_id ) {
				program._category = input.category_id;
			}
			if( input.budget ) {
				program.budget    = input.budget;
			}
			output = program;
			return program.saveAsync();
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
			promise = ProgramModel.removeAsync({ 
				_id   : filters.id,
				_user : filters.user_id
			});

		} else {
			promise = ProgramModel.removeAsync({ _id : filters.id });

		}
	} else if(filters.user_id) {
		promise = ProgramModel.removeAsync({ _user : filters.user_id });
			
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
		promise = ProgramModel.findAsync({
					_user : filters.user_id
				});

	} else {
		return Promise.reject(new Error('Filters missing'));
	}

	var promiseEnd = promise
		.then(function (programs) {
			return Promise.resolve(programs);
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
			promise = ProgramModel.findOneAsync({
						_id   : filters.id,
						_user : filters.user_id
					});

		} else  {
			promise = ProgramModel.findByIdAsync(filters.id);				
		}
	} else {
		return Promise.reject(new Error('Filters missing'));
	}

	var promiseEnd = promise
		.then(function (program) {
			if (!program ) {
				throw new Error('Program not found');
			}
			return Promise.resolve(program);
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