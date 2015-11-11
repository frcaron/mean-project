// Inject
var Promise          = require('bluebird');
var TransactionModel = require(global.__model + '/TransactionModel');
var CountersModel    = require(global.__model + '/CountersModel');

function create (input) {

	var transaction = new TransactionModel();
	var promise = CountersModel.getNextSequence('transaction_id')
		.then(function (seq){

			transaction._id      = seq;
			transaction.date     = input.date;
			transaction.sum      = input.sum;
			if( input.comment ) {
				transaction.comment = input.comment;
			}
			transaction._program = input._program;
			transaction._user    = input.user_id;

			return transaction.saveAsync();
		})
		.then(function () {
			return Promise.resolve(transaction);
		})
		.catch(function (err) {
			if (err.code === 11000) {
				err = new Error('Transaction already exist');
			}
			return Promise.reject(err);
		});

	return promise;
}

function update (input) {

	var output;
	var promise = getOne(input)
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
			promise = TransactionModel.removeAsync({ 
				_id   : filters.id,
				_user : filters.user_id
			});

		} else {
			promise = TransactionModel.removeAsync({ _id : filters.id });

		}
	} else if(filters.user_id) {
		promise = TransactionModel.removeAsync({ _user : filters.user_id });
			
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
		promise = TransactionModel.findAsync({
					_user : filters.user_id
				});

	} else {
		return Promise.reject(new Error('Filters missing'));
	}

	var promiseEnd = promise
		.then(function (transactions) {
			return Promise.resolve(transactions);
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
			promise = TransactionModel.findOneAsync({
						_id   : filters.id,
						_user : filters.user_id
					});

		} else {
			promise = TransactionModel.findByIdAsync(filters.id);
		}
	} else {
		return Promise.reject(new Error('Filters missing'));
	}
		
	var promiseEnd = promise
		.then(function (transaction) {
			if (!transaction) {
				throw new Error('Transaction not found');
			}
			return Promise.resolve(transaction);
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