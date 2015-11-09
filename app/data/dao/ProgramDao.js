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
					throw new Error('Program already exist');
				} else {
					throw err;
				}
			});

		return promise;
}

function update (id, input) {

		var output;
		var promise = getOne(id, input.user_id)
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
				Promise.resolve(output);
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function remove (id, user_id) {

		var promise = getOne(id, user_id)
			.then(function (program){
				return program.removeAsync();
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getAll (user_id) {

		var promise = ProgramModel.findAsync({
						_user : user_id
					})
			.then(function (programs) {
				Promise.resolve(programs);
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getOne (id, user_id) {
	
		var promise;
		if(user_id) {
			promise = ProgramModel.findByIdAsync({
						_id   : id,
						_user : user_id
					});
		} else  {
			promise = ProgramModel.findByIdAsync({
						_id : id
					});
		}
			
		promise
			.then(function (program) {
				if (!program) {
					throw new Error('Program not found');
				}
				Promise.resolve(program);
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