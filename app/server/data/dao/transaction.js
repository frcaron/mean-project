"use strict";

// Inject
var path             = require('path');
var BPromise         = require('bluebird');
var daoManager       = require(path.join(global.__dao, 'manager'))('transaction');
var transactionModel = require(path.join(global.__model, 'transaction'));
var countersModel    = require(path.join(global.__model, 'counters'));
var Exception        = require(path.join(global.__core, 'exception'));
var logger           = require(path.join(global.__core, 'logger'))('dao', __filename);

/**
 * @param  {Json} input 		Data to create
 * @return {TransactionModel} 	Object created
 * @throws {DuplicateEx} 		If index model is not unique
 * @throws {Error} 				If an other error is met
 */
function create (input) {

	logger.debug({ method : 'create', point : logger.pt.start, params : {
		input : input
	} });

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
			logger.debug({ method : 'create', point : logger.pt.end });

			return BPromise.resolve(transaction);
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'create', point : logger.pt.catch });

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

	logger.debug({ method : 'update', point : logger.pt.start, params : {
		input      : input,
		name_query : name_query,
		filters    : filters
	} });

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
		.then(function (transaction) {
			logger.debug({ method : 'update', point : logger.pt.end });

			return BPromise.resolve(transaction);
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'update', point : logger.pt.catch });

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

	logger.debug({ method : 'remove', point : logger.pt.start, params : {
		name_query : name_query,
		filters    : filters
	} });

	let promise = daoManager.getQuery('remove', name_query, filters)
			.then(function (query) {
				return transactionModel.removeAsync(query);
			})
		.then(function () {
			logger.debug({ method : 'remove', point : logger.pt.end });
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'remove', point : logger.pt.catch });
			throw err;
		});

	return promise;
}

/**
 * @param  {String} name_query	Name query
 * @param  {Json} filters 		Filters query
 * @return {TransactionModel}	List of object found
 * @throws {ParamEx} 			If params given are wrong
 * @throws {Error} 				If an other error is met
 */
function getAll (name_query, filters) {

	logger.debug({ method : 'getAll', point : logger.pt.start, params : {
		name_query : name_query,
		filters    : filters
	} });

	let promise = daoManager.getQuery('getAll', name_query, filters)
			.then(function (query) {
				return transactionModel.findAsync(query);
			})
		.then(function (transactions) {
			logger.debug({ method : 'getAll', point : logger.pt.end });

			return BPromise.resolve(transactions);
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'getAll', point : logger.pt.catch });
			throw err;
		});

	return promise;
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

	logger.debug({ method : 'getOne', point : logger.pt.start, params : {
		name_query : name_query,
		filters    : filters
	} });

	let promise = daoManager.getQuery('getOne', name_query, filters)
			.then(function (query) {
				return transactionModel.findOneAsync(query);
			})
		.then(function (transaction) {
			logger.debug({ method : 'getOne', point : logger.pt.end });

			if (!transaction) {
				throw new Exception.NoResultEx('No transaction found');
			}
			return BPromise.resolve(transaction);
		})
		.catch(function (err) {
			logger.debug(err.message, { method : 'getOne', point : logger.pt.catch });
			throw err;
		});

	return promise;
}

module.exports = {
	create (input) {
		return create(input);
	},
	update (input,name_query, filters) {
		return update(input,name_query, filters);
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