"use strict";

// Inject
var path             = require('path');
var BPromise         = require('bluebird');
var daoManager       = require(path.join(global.__dao, 'manager'))('transaction');
var transactionModel = require(path.join(global.__model, 'transaction'));
var countersModel    = require(path.join(global.__model, 'counters'));
var Exception        = require(path.join(global.__core, 'exception'));
var logger           = require(path.join(global.__core, 'system')).Logger;

/**
 * @param  {Json} input 		Data to create
 * @return {TransactionModel} 	Object created
 * @throws {DuplicateEx} 		If index model is not unique
 * @throws {Error} 				If an other error is met
 */
function create (input) {

	logger.debug('[DAO - START] TransactionDao#create');
	logger.debug('              -- input : ' + JSON.stringify(input));

	let transaction = new transactionModel();
	let promise = countersModel.getNextSequence('transaction_id')
		.then(function (seq){

			transaction._id      = seq;
			transaction.sum      = input.sum;
			if( input.comment ) {
				transaction.comment = input.comment;
			}
			transaction.date     = input.date;
			transaction._program = input.program_id;
			transaction._user    = input.user_id;

			return transaction.saveAsync();
		})
		.then(function () {
			return BPromise.resolve(transaction);
		})
		.catch(function (err) {
			logger.debug('[DAO - CATCH] TransactionDao#create');
			logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new Exception.DuplicateEx('Transaction already exist');
			} if(err.name === 'ValidationError') {
				let detail = [];
				Object.keys(err.errors).map(function(prop) {
					detail.push(err.errors[prop].message);
				});
				throw new Exception.ValidatorEx(err.message, detail);
			} else {
				throw err;
			}
		});

	logger.debug('[DAO -   END] TransactionDao#create');

	return promise;
}

/**
 * @param  {Json} input 		Data to update
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {TransactionModel} 	Object updated
 * @throws {DuplicateEx} 		If index model is not unique
 * @throws {NoResultEx} 		If id doesn't exist
 * @throws {Error} 				If an other error is met
 */
function update (input, name_query, filters) {

	logger.debug('[DAO - START] TransactionDao#update');
	logger.debug('              -- input   : ' + JSON.stringify(input));
	logger.debug('              -- name_query : ' + name_query);
	logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters) {
		try {
			promise = daoManager.getQuery('update', name_query, filters)
				.then(function (query) {
					return transactionModel.updateAsync(query,{
						_program : input.program_id
					});
				});
		} catch (err) {
			promise = BPromise.reject(err);
		}
	} else {
		promise = getOne('byIdU', {
				transaction_id : input.transaction_id,
				user_id        : input.user_id
			})
			.then(function (transaction) {
				if(input.date) {
					transaction.date     = input.date;
				}
				if(input.sum) {
					transaction.sum      = input.sum;
				}
				if(input.comment) {
					transaction.comment  = input.comment;
				}
				if(input.program_id) {
					transaction._program = input.program_id;
				}
				return transaction.saveAsync()
					.then(function () {
						return BPromise.resolve(transaction);
					});
			});
	}

	let promiseEnd = promise
		.catch(function (err) {
			logger.debug('[DAO - CATCH] TransactionDao#update');
			logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new Exception.DuplicateEx('Transaction already exist');
			} if(err.name === 'ValidationError') {
				let detail = [];
				Object.keys(err.errors).map(function(prop) {
					detail.push(err.errors[prop].message);
				});
				throw new Exception.ValidatorEx(err.message, detail);
			} else {
				throw err;
			}
		});

	logger.debug('[DAO -   END] TransactionDao#update');

	return promiseEnd;
}

/**
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {}
 * @throws {ParamEx} 			If params given are wrong
 * @throws {Error} 				If an other error is met
 */
function remove (name_query, filters) {

	logger.debug('[DAO - START] TransactionDao#remove');
	logger.debug('              -- name_query : ' + name_query);
	logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		promise = daoManager.getQuery('remove', name_query, filters)
			.then(function (query) {
				return transactionModel.removeAsync(query);
			});
	} catch (err) {
		promise = BPromise.reject(err);
	}

	let promiseEnd = promise
		.catch(function (err) {
			logger.debug('[DAO - CATCH] TransactionDao#remove');
			logger.error('              -- message : ' + err.message);

			throw err;
		});

	logger.debug('[DAO -   END] TransactionDao#remove');

	return promiseEnd;
}

/**
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {TransactionModel}	List of object found
 * @throws {ParamEx} 			If params given are wrong
 * @throws {Error} 				If an other error is met
 */
function getAll (name_query, filters) {

	logger.debug('[DAO - START] TransactionDao#getAll');
	logger.debug('              -- name_query : ' + name_query);
	logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		promise = daoManager.getQuery('getAll', name_query, filters)
			.then(function (query) {
				return transactionModel.findAsync(query);
			});
	} catch (err) {
		promise = BPromise.reject(err);
	}

	let promiseEnd = promise
		.catch(function (err) {
			logger.debug('[DAO - CATCH] TransactionDao#getAll');
			logger.error('              -- message : ' + err.message);

			throw err;
		});

	logger.debug('[DAO -   END] TransactionDao#getAll');

	return promiseEnd;
}

/**
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {TransactionModel}	Object found
 * @throws {ParamEx} 			If params given are wrong
 * @throws {NoResultEx} 		If no result found
 * @throws {Error} 				If an other error is met
 */
function getOne (name_query, filters) {

	logger.debug('[DAO - START] TransactionDao#getOne');
	logger.debug('              -- name_query : ' + name_query);
	logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	try {
		promise = daoManager.getQuery('getOne', name_query, filters)
			.then(function (query) {
				return transactionModel.findOneAsync(query);
			});
	} catch (err) {
		promise = BPromise.reject(err);
	}

	let promiseEnd = promise
		.then(function (transaction) {
			if (!transaction) {
				throw new Exception.NoResultEx('No transaction found');
			}
			return BPromise.resolve(transaction);
		})
		.catch(function (err) {
			logger.debug('[DAO - CATCH] TransactionDao#getOne');
			logger.error('              -- message : ' + err.message);

			throw err;
		});

	logger.debug('[DAO -   END] TransactionDao#getOne');

	return promiseEnd;
}

module.exports = {
	create (input) {
		return create(input);
	},
	update (input,name_query,  filters) {
		return update(input,name_query,  filters);
	},
	remove (name_query, filters) {
		return remove(name_query, filters);
	},
	getAll (name_query, filters) {
		return getAll(name_query, filters);
	},
	getOne (name_query, filters) {
		return getOne(name_query, filters);
	}
};