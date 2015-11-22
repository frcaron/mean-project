"use strict";

//Inject
var Moment             = require('moment');
var Logger             = require(global.__server + '/LoggerManager');
var ResponseService    = require(global.__service + '/share/ResponseService');
var TransactionService = require(global.__service + '/TransactionService');

// Properties
var api_prefix = '/transactions';

module.exports = function (router) {

	router.route(api_prefix)

		// Create one transaction
		.post(function (req, res) {

			let category_id = req.body.category_id ||req.query.category_id;

			Logger.debug('[WSP - VALID] TransactionRoute#post');
			Logger.debug('              -- req.body.date         : ' + req.body.date);
			Logger.debug('              -- req.body.sum          : ' + req.body.sum);
			Logger.debug('              -- req.query.category_id : ' + category_id);

			// Validation
			if (!req.body.date) {
				return ResponseService.fail(res, {
							message : 'Add',
							reason  : 'Param "date" missing'
						});
			}
			if (!req.body.sum) {
				return ResponseService.fail(res, {
							message : 'Add',
							reason  : 'Param "sum" missing'
						});
			}
			if (!category_id) {
				return ResponseService.fail(res, {
							message : 'Add',
							reason  : 'Param "category_id" missing'
						});
			}

			var moment = Moment(req.body.date, "DD/MM/YYYY");
			if(!moment.isValid()) {
				ResponseService.fail(res, {
						message : 'Add',
						reason  : 'Date is not valid'
					});
			} else {
				req.body.date = moment.toDate();
			}

			TransactionService.create(req, res);
		});

	router.route(api_prefix + '/:transaction_id')

		// Get one transaction
		.get(function (req, res) {
			TransactionService.getByIdU(req, res);
		})

		// Update one transaction
		.put(function (req, res) {

			let category_id = req.body.category_id ||req.query.category_id;

			Logger.debug('[WSP - VALID] TransactionRoute#put');
			Logger.debug('              -- req.body.date         : ' + req.body.date);
			Logger.debug('              -- req.query.category_id : ' + category_id);

			// Validation
			if (!req.body.date) {
				return ResponseService.fail(res, {
							message : 'Add',
							reason  : 'Param "date" missing'
						});
			}
			if (!category_id) {
				return ResponseService.fail(res, {
							message : 'Add',
							reason  : 'Param "category_id" missing'
						});
			}

			let moment = Moment(req.body.date, "DD/MM/YYYY");
			if(!moment.isValid()) {
				ResponseService.fail(res, {
						message : 'Add',
						reason  : 'Date is not valid'
					});
			} else {
				req.body.date = moment.toDate();
			}

			TransactionService.update(req, res);
		})

		// Delete one transaction
		.delete(function (req, res) {
			TransactionService.remove(req, res);
		});
};