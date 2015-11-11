// Inject
var Promise           = require('bluebird');
var TypeCategoryModel = require(global.__model + '/TypeCategoryModel');
var CountersModel     = require(global.__model + '/CountersModel');

function create (input) {

		var typeCategory = new TypeCategoryModel();
		var promise = CountersModel.getNextSequence('type_category_id')
			.then(function (seq){

				typeCategory._id    = seq;
				typeCategory.type   = input.type;
				if( input.active ) {
					typeCategory.active = input.active;
				}

				return typeCategory.saveAsync();
			})
			.then(function () {
				return Promise.resolve(typeCategory);
			})
			.catch(function (err) {
				if (err.code === 11000) {
					throw new Error('Type Category already exist');
				} else {
					throw err;
				}
			});

		return promise;
}

function update (input) {

		var filters = {
			type : input.type
		};

		var output;
		var promise = getOne(filters)
			.then(function (typeCategory) {
				if( input.type ) {
					typeCategory.type   = input.type;
				}
				if( input.active ) {
					typeCategory.active = input.active;
				}
				output = typeCategory;
				return typeCategory.saveAsync();
			})
			.then(function () {
				Promise.resolve(output);
			})
			.catch(function (err) {
				throw err;
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

		promise
			.then(function (typeCategories) {
				Promise.resolve(typeCategories);
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getOne (filters) {
	
		var promise;
		if(filters.id) {
			promise = TypeCategoryModel.findByIdAsync(filters.id);
			
		} else if(filters.type) {
			promise = TypeCategoryModel.findAsync({
						type : filters.type
					});
		}

		promise
			.then(function (typeCategory) {
				if (!typeCategory) {
					throw new Error('Type Category not found');
				}
				Promise.resolve(typeCategory);
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