"use strict";

// Inject
var BPromise         = require('bluebird');
var Logger           = require(global.__app + '/LoggerManager');
var ErrorManager     = require(global.__app + '/ErrorManager');
var TransactionModel = require(global.__model + '/TransactionModel');
var CountersModel    = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 		Data to create
 * @return {TransactionModel} 	Object created
 * @throws {DuplicateError} 	If index model is not unique
 * @throws {Error} 				If an other error is met
 */
function create (input) {

	Logger.debug('TransactionDao#create [start]');

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
			return BPromise.resolve(transaction);
		})
		.catch(function (err) {
			Logger.error('TransactionDao#create | ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Transaction already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('TransactionDao#create [end]');

	return promise;
}

/** 
 * @param  {Json} input 		Data to update
 * @return {TransactionModel} 	Object updated
 * @throws {DuplicateError} 	If index model is not unique
 * @throws {NoResultError} 		If id doesn't exist
 * @throws {Error} 				If an other error is met
 */
function update (input) {

	Logger.debug('TransactionDao#update [start]');

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
			return BPromise.resolve(output);
		})
		.catch(function (err) {
			Logger.error('TransactionDao#update | ' + err.message);

			if (err.code === 11000) {
				throw new ErrorManager.DuplicateError('Transaction already exist');
			} else {
				throw err;
			}
		});

	Logger.debug('TransactionDao#update [end]');

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

	Logger.debug('TransactionDao#remove [start]');

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
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.catch(function (err) {
			Logger.error('TransactionDao#remove | ' + err.message);

			throw err;
		});

	Logger.debug('TransactionDao#remove [end]');

	return promiseEnd;
}

/**
 * @param  {Json} filters 		Keys : - user_id
 * @return {TransactionModel}	List of object found
 * @throws {ParamsError} 		If params given are wrong
 * @throws {Error} 				If an other error is met
 */
function getAll (filters) {

	Logger.debug('TransactionDao#getAll [start]');

	var promise;
	if(filters.user_id) {
		promise = TransactionModel.findAsync({
					_user : filters.user_id
				});

	} else {
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}

	var promiseEnd = promise
		.catch(function (err) {
			Logger.error('TransactionDao#getAll | ' + err.message);

			throw err;
		});

	Logger.debug('TransactionDao#getAll [end]');

	return promiseEnd;
}

/**
 * @param  {Json} filters 		Keys : 	- id
 * 										- id / user_id
 * @return {TransactionModel}	Object found
 * @throws {ParamsError} 		If params given are wrong
 * @throws {NoResultError} 		If no result found
 * @throws {Error} 				If an other error is met
 */
function getOne (filters) {

	Logger.debug('TransactionDao#getOne [Start]');
	
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
		promise = BPromise.reject(new ErrorManager.ParamsError('Filters missing'));
	}
		
	var promiseEnd = promise
		.then(function (transaction) {
			if (!transaction) {
				throw new ErrorManager.NoResultError('Transaction not found');
			}
			return BPromise.resolve(transaction);
		})
		.catch(function (err) {
			Logger.error('TransactionDao#getOne | ' + err.message);

			throw err;
		});

	Logger.debug('TransactionDao#getOne [end]');

	return promiseEnd;
}

module.exports = {
	name   : 'TransactionDao',
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