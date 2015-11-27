"use strict";

//Inject
var Moment             = require('moment');
var Logger             = require(global.__server  + '/LoggerManager');
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
			let msg = [];
			if (!req.body.date) {
				msg.push('date');
			}
			if (!req.body.sum) {
				msg.push('sum');
			}
			if (!category_id) {
				msg.push('category_id');
			}
			if(msg.length) {
				return ResponseService.fail(res, {
					reason : 'Param missing',
					detail : msg
				});
			}

			var moment = Moment(req.body.date, "DD/MM/YYYY", true);
			if(moment.isValid()) {
				req.body.date = moment;
			} else {
				return ResponseService.fail(res, {
					reason  : 'Date is not valid'
				});
			}

			TransactionService.create(req, res, req.user.id);
		});

	router.route(api_prefix + '/:transaction_id')

		// Get one transaction
		.get(function (req, res) {
			TransactionService.getByIdU(req, res, req.user.id);
		})

		// Update one transaction
		.put(function (req, res) {

			let category_id = req.body.category_id ||req.query.category_id;

			Logger.debug('[WSP - VALID] TransactionRoute#put');
			Logger.debug('              -- req.body.date         : ' + req.body.date);
			Logger.debug('              -- req.query.category_id : ' + category_id);

			// Validation
			let msg = [];
			if (!req.body.date) {
				msg.push('date');
			}
			if (!category_id) {
				msg.push('category_id');
			}
			if(msg.length) {
				return ResponseService.fail(res, {
					reason : 'Param missing',
					detail : msg
				});
			}

			var moment = Moment(req.body.date, "DD/MM/YYYY", true);
			if(moment.isValid()) {
				req.body.date = moment;
			} else {
				return ResponseService.fail(res, {
					reason  : 'Date is not valid'
				});
			}

			TransactionService.update(req, res, req.user.id);
		})

		// Delete one transaction
		.delete(function (req, res) {
			TransactionService.remove(req, res, req.user.id);
		});
};