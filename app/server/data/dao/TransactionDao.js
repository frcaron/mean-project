"use strict";

// Inject
var BPromise         = require('bluebird');
var ExManager        = require(global.__server + '/ExceptionManager');
var Logger           = require(global.__server + '/LoggerManager');
var TransactionModel = require(global.__model + '/TransactionModel');
var CountersModel    = require(global.__model + '/CountersModel');

/**
 * @param  {Json} input 		Data to create
 * @return {TransactionModel} 	Object created
 * @throws {DuplicateEx} 	If index model is not unique
 * @throws {Error} 				If an other error is met
 */
function create (input) {

	Logger.debug('[DAO - START] TransactionDao#create');
	Logger.debug('              -- input : ' + JSON.stringify(input));

	let transaction = new TransactionModel();
	let promise = CountersModel.getNextSequence('transaction_id')
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
			Logger.debug('[DAO - CATCH] TransactionDao#create');
			Logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new ExManager.DuplicateEx('Transaction already exist');
			} if(err.name === 'ValidationError') {
				let detail = [];
				Object.keys(err.errors).map(function(prop) {
					detail.push(err.errors[prop].message);
				});
				throw new ExManager.ValidatorEx(err.message, detail);
			} else {
				throw err;
			}
		});

	Logger.debug('[DAO -   END] TransactionDao#create');

	return promise;
}

/**
 * @param  {Json} input 		Data to update
 * @param  {Json} filters 		keys : 	- program_id
 *                          			- user_id
 * @return {TransactionModel} 	Object updated
 * @throws {DuplicateEx} 	If index model is not unique
 * @throws {NoResultEx} 		If id doesn't exist
 * @throws {Error} 				If an other error is met
 */
function update (input, filters) {

	Logger.debug('[DAO - START] TransactionDao#update');
	Logger.debug('              -- input   : ' + JSON.stringify(input));
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters) {
		if(filters.user_id && filters.program_id) {
			promise = TransactionModel.updateAsync({
					_program : filters.program_id,
					_user    : filters.user_id
				},{
					_program : input.program_id
				})
				.then(function (transactions) {
					BPromise.resolve(transactions);
				});

		} else {
			promise = BPromise.reject(new ExManager.ParamEx('Filters missing'));
		}
	} else {
		promise = getOne({
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
						BPromise.resolve(transaction);
					});
			});
	}

	let promiseEnd = promise
		.then(function (transaction) {
			if(transaction) {
				return BPromise.resolve(transaction);
			}
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] TransactionDao#update');
			Logger.error('              -- message : ' + err.message);

			if (err.code === 11000) {
				throw new ExManager.DuplicateEx('Transaction already exist');
			} if(err.name === 'ValidationError') {
				let detail = [];
				Object.keys(err.errors).map(function(prop) {
					detail.push(err.errors[prop].message);
				});
				throw new ExManager.ValidatorEx(err.message, detail);
			} else {
				throw err;
			}
		});

	Logger.debug('[DAO -   END] TransactionDao#update');

	return promiseEnd;
}

/**
 * @param  {Json} filters 	Keys : 	- transaction_id
 * 									- user_id
 * 									- plan_id
 * @return {}
 * @throws {ParamEx} 	If params given are wrong
 * @throws {Error} 			If an other error is met
 */
function remove (filters) {

	Logger.debug('[DAO - START] TransactionDao#remove');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		if(filters.transaction_id) {
			promise = TransactionModel.removeAsync({
				_id   : filters.transaction_id,
				_user : filters.user_id
			});
		} else if(filters.plan_id) {
			promise = TransactionModel.removeAsync({
				_plan : filters.plan_id,
				_user : filters.user_id
			});
		} else {
			promise = TransactionModel.removeAsync({ _user : filters.user_id });
		}
	}

	if(!promise) {
		promise = BPromise.reject(new ExManager.ParamEx('Filters missing'));
	}

	let promiseEnd = promise
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] TransactionDao#remove');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] TransactionDao#remove');

	return promiseEnd;
}

/**
 * @param  {Json} filters 		Keys : 	- user_id
 *                          			- [ programs_id ]
 * @return {TransactionModel}	List of object found
 * @throws {ParamEx} 		If params given are wrong
 * @throws {Error} 				If an other error is met
 */
function getAll (filters) {

	Logger.debug('[DAO - START] TransactionDao#getAll');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		if(filters.programs_id && filters.programs_id.length) {
			promise = TransactionModel.findAsync({
				_program : { $in : filters.programs_id },
				_user    : filters.user_id
			});
		} else {
			promise = TransactionModel.findAsync({
				_user : filters.user_id
			});
		}
	}

	if(!promise) {
		promise = BPromise.reject(new ExManager.ParamEx('Filters missing'));
	}

	let promiseEnd = promise
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] TransactionDao#getAll');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] TransactionDao#getAll');

	return promiseEnd;
}

/**
 * @param  {Json} filters 		Keys : 	- transaction_id
 *										- user_id
 * @return {TransactionModel}	Object found
 * @throws {ParamEx} 		If params given are wrong
 * @throws {NoResultEx} 		If no result found
 * @throws {Error} 				If an other error is met
 */
function getOne (filters) {

	Logger.debug('[DAO - START] TransactionDao#getOne');
	Logger.debug('              -- filters : ' + JSON.stringify(filters));

	let promise;
	if(filters.user_id) {
		if(filters.transaction_id) {
			promise = TransactionModel.findOneAsync({
				_id   : filters.transaction_id,
				_user : filters.user_id
			});
		}
	}

	if(!promise) {
		promise = BPromise.reject(new ExManager.ParamEx('Filters missing "user_id"'));
	}

	let promiseEnd = promise
		.then(function (transaction) {
			if (!transaction) {
				throw new ExManager.NoResultEx('Transaction not found');
			}
			return BPromise.resolve(transaction);
		})
		.catch(function (err) {
			Logger.debug('[DAO - CATCH] TransactionDao#getOne');
			Logger.error('              -- message : ' + err.message);

			throw err;
		});

	Logger.debug('[DAO -   END] TransactionDao#getOne');

	return promiseEnd;
}

module.exports = {
	name   : 'TransactionDao',
	create : function (input) {
		return create(input);
	},
	update : function (input, filters) {
		return update(input, filters);
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