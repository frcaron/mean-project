// Inject
var Promise          = require('bluebird');
var TransactionModel = require(global.__model + '/TransactionModel');
var CountersModel    = require(global.__model + '/CountersModel');

function create (input) {

		var transaction = new TransactionModel();
		var promise = CountersModel.getNextSequence('transaction_id')
			.then(function (seq){

				transaction._id        = seq;
				transaction.date      = input.date;
				transaction.sum  = input.sum;
				if( input.comment ) {
					transaction.comment = input.comment;
				}
				transaction._program      = input._program;
				transaction._user      = input.user_id;

				return transaction.saveAsync();
			})
			.then(function () {
				return Promise.resolve(transaction);
			})
			.catch(function (err) {
				if (err.code === 11000) {
					throw new Error('Transaction already exist');
				} else {
					throw err;
				}
			});

		return promise;
}

function update (id, input) {

		var output;
		var promise = getOne(id, input.user_id)
			.then(function (transaction) {
				if( input.date ) {
					transaction.date     = input.date;
				}
				if( input.sum ) {
					transaction.sum      = input.sum;
				}
				if( input.comment ) {
					transaction.comment  = input.comment;
				}
				if( input.program_id ) {
					transaction._program = input.program_id;
				}
				output = transaction;
				return transaction.saveAsync();
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
			.then(function (transaction){
				return transaction.removeAsync();
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getAll (user_id) {

		var promise = TransactionModel.findAsync({
						_user : user_id
					})
			.then(function (transactions) {
				Promise.resolve(transactions);
			})
			.catch(function (err) {
				throw err;
			});

		return promise;
}

function getOne (filters) {
	
		var promise;
		if(filters.id) {
			if(filters.user_id) {
				promise = TransactionModel.findByIdAsync({
							_id   : filters.id,
							_user : filters.user_id
						});
				
			} else {
				promise = TransactionModel.findByIdAsync(filters.id);
			}
		}
			
		promise
			.then(function (transaction) {
				if (!transaction) {
					throw new Error('Transaction not found');
				}
				Promise.resolve(transaction);
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

	getAll : function (filters) {
		return getAll(filters);
	},

	getOne : function (filters) {
		return getOne(filters);
	}
};