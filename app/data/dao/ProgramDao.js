// Inject
var Promise       = require('bluebird');
var ErrorManager  = require(global.__app) + '/ErrorManager');
var ProgramModel  = require(global.__model + '/ProgramModel');
var CountersModel = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 	Data to create
 * @return {ProgramModel} 	Object created
 * @throws {DuplicateError} If index model is not unique
 * @throws {Error} 			If an other error is met
 */
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
				throw new ErrorManager.DuplicateError('Program already exist');
			} else {
				throw err;
			}
		});

	return promise;
}

/** 
 * @param  {Json} input 	Data to update
 * @return {ProgramModel} 	Object updated
 * @throws {DuplicateError} If index model is not unique
 * @throws {NoResultError} 	If id doesn't exist
 * @throws {Error} 			If an other error is met
 */
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
				throw new ErrorManager.DuplicateError('Program already exist');
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
 * @return {ProgramModel}	List of object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {Error} 			If an other error is met
 */
function getAll (filters) {

	var promise;
	if(filters.user_id) {
		promise = ProgramModel.findAsync({
					_user : filters.user_id
				});

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
 * @param  {Json} filters 	Keys : 	- id
 * 									- id / user_id
 * @return {ProgramModel}	Object found
 * @throws {ParamsError} 	If params given are wrong
 * @throws {NoResultError} 	If no result found
 * @throws {Error} 			If an other error is met
 */
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
		promise = Promise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.then(function (program) {
			if (!program ) {
				throw new ErrorManager.NoResultError('Program not found');
			}
			return Promise.resolve(program);
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