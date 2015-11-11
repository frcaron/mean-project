// Inject
var Promise       = require('bluebird');
var CategoryModel = require(global.__model + '/CategoryModel');
var CountersModel = require(global.__model + '/CountersModel');

function create (input) {

	var category = new CategoryModel();
	var promise = CountersModel.getNextSequence('category_id')
		.then(function (seq){

			category._id    = seq;
			category.name   = input.name;
			category._type   = input.type_id;
			if( input.active !== undefined ) {
				category.active = input.active;
			}
			category._user  = input.user_id;

			return category.saveAsync();
		})
		.then(function () {
			return Promise.resolve(category);
		})
		.catch(function (err) {
			if (err.code === 11000) {
				err = new Error('Category already exist');
			}
			return Promise.reject(err);
		});

	return promise;
}

function update (input) {

	var output;
	var promise = getOne(input)
		.then(function (category) {
			if( input.name ) {
				category.name   = input.name;
			}
			if( input.type ) {
				category.type   = input.type;
			}
			if( input.active !== undefined ) {
				category.active = input.active;
			}
			output = category;
			return category.saveAsync();
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
			promise = CategoryModel.removeAsync({ 
				_id   : filters.id,
				_user : filters.user_id
			});

		} else {
			promise = CategoryModel.removeAsync({ _id : filters.id });

		}
	} else if(filters.user_id) {
		promise = CategoryModel.removeAsync({ _user : filters.user_id });
			
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
		promise = CategoryModel.findAsync({
					_user : filters.user_id
				});
	} else {
		return Promise.reject(new Error('Filters missing'));
	}

	var promiseEnd = promise
		.then(function (categories) {
			return Promise.resolve(categories);
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
			promise = CategoryModel.findOneAsync({
						_id   : filters.id,
						_user : filters.user_id
					});
		} else  {
			promise = CategoryModel.findByIdAsync(filters.id);
		}	
	} else if(filters.type && filters.user_id) {
		promise = CategoryModel.findOneAsync({
			_type : filters.type,
			_user : filters.user_id
		});
		
	} else {
		return Promise.reject(new Error('Filters missing'));
	}
		
	var promiseEnd = promise
		.then(function (category) {
			if (!category) {
				throw new Error('Category not found');
			}
			return Promise.resolve(category);
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