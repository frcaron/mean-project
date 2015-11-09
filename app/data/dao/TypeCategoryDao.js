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

function update (id, input) {

		var output;
		var promise = getOne(id, input.user_id)
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

function remove (id) {

		var promise = getOne(id)
			.then(function (typeCategory){
				return typeCategory.removeAsync();
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getAll () {

		var promise = TypeCategoryModel.findAsync()
			.then(function (typeCategories) {
				Promise.resolve(typeCategories);
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getOne (id) {
	
		var promise = TypeCategoryModel.findByIdAsync({
						_id : id
					})
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

	update : function (id, input) {
		return update(id, input);
	},

	remove : function (id) {
		return remove(id);
	},

	getAll : function () {
		return getAll();
	},

	getOne : function (id) {
		return getOne(id);
	}
};