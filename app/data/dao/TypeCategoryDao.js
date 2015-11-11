// Inject
var Promise           = require('bluebird');
var TypeCategoryModel = require(global.__model + '/TypeCategoryModel');
var CountersModel     = require(global.__model + '/CountersModel');

function create (input) {

	var typeCategory = new TypeCategoryModel();
	var promise = CountersModel.getNextSequence('type_category_id')
		.then(function (seq){

			typeCategory._id  = seq;
			typeCategory.type = input.type;
			if( input.active !== undefined ) {
				typeCategory.active = input.active;
			}

			return typeCategory.saveAsync();
		})
		.then(function () {
			return Promise.resolve(typeCategory);
		})
		.catch(function (err) {
			if (err.code === 11000) {
				err = new Error('Type Category already exist');
			}
			return Promise.reject(err);
		});

	return promise;
}

function update (input) {

	var output;
	var promise = getOne(input)
		.then(function (typeCategory) {
			if( input.type ) {
				typeCategory.type   = input.type;
			}
			if( input.active !== undefined ) {
				typeCategory.active = input.active;
			}
			output = typeCategory;
			return typeCategory.saveAsync();
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

function getAll (filters) {

	var promise;
	if(filters.active) {
		promise = TypeCategoryModel.findAsync({
					active : filters.active
				});

	} else {
		promise = TypeCategoryModel.findAsync();
	}

	var promiseEnd = promise
		.then(function (typeCategories) {
			return Promise.resolve(typeCategories);
		})
		.catch(function (err) {
			return Promise.reject(err);
		});

	return promiseEnd;
}

function getOne (filters) {
	
	var promise;
	if(filters.id) {
		promise = TypeCategoryModel.findByIdAsync(filters.id);

	} else if(filters.type) {
		promise = TypeCategoryModel.findOneAsync({
					type : filters.type
				});

	} else {
		return Promise.reject(new Error('Filters missing'));
	}

	var promiseEnd = promise
		.then(function (typeCategory) {
			if (!typeCategory) {
				throw new Error('Type Category not found');
			}
			return Promise.resolve(typeCategory);
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

	getAll : function (filters) {
		return getAll(filters);
	},

	getOne : function (filters) {
		return getOne(filters);
	}
};