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
				category.type   = input.type;
				if( input.active ) {
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
					throw new Error('Category already exist');
				} else {
					throw err;
				}
			});

		return promise;
}

function update (id, input) {

		var output;
		var promise = getOne(id, input.user_id)
			.then(function (category) {
				if( input.name ) {
					category.name   = input.name;
				}
				if( input.type ) {
					category.type   = input.type;
				}
				if( input.active ) {
					category.active = input.active;
				}
				output = category;
				return category.saveAsync();
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
			.then(function (category){
				return category.removeAsync();
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getAll (user_id) {

		var promise = CategoryModel.findAsync({
						_user : user_id
					})
			.then(function (categories) {
				Promise.resolve(categories);
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getOne (id, user_id) {
	
		var promise;
		if(user_id) {
			promise = CategoryModel.findByIdAsync({
						_id   : id,
						_user : user_id
					});
		} else  {
			promise = CategoryModel.findByIdAsync({
						_id : id
					});
		}
			
		promise
			.then(function (category) {
				if (!category) {
					throw new Error('Category not found');
				}
				Promise.resolve(category);
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