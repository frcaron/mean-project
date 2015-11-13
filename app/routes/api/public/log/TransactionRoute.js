"use strict";

//Inject
var Logger             = require(global.__app + '/LoggerManager');
var ResponseService    = require(global.__service + '/ResponseService');
var TransactionService = require(global.__service + '/TransactionService');

// Properties
var api_prefix = '/transactions';

module.exports = function (router) {

	router.route(api_prefix)

		// Create one transaction
		.post(function (req, res) {

			Logger.debug('Public#TransactionRoute#post [validation]');
			Logger.debug('-- req.body.date         : ' + req.body.date);
			Logger.debug('-- req.body.sum          : ' + req.body.sum);
			Logger.debug('-- req.query.category_id : ' + req.query.category_id);

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
			if (!req.query.category_id) {
				return ResponseService.fail(res, {
							message : 'Add', 
							reason  : 'Param "category_id" missing'
						});
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

			Logger.debug('Public#TransactionRoute#put [validation]');
			Logger.debug('-- req.body.date         : ' + req.body.date);
			Logger.debug('-- req.query.category_id : ' + req.query.category_id);

			// Validation
			if (!req.body.date) {
				return ResponseService.fail(res, {
							message : 'Add', 
							reason  : 'Param "date" missing'
						});
			}
			if (!req.query.category_id) {
				return ResponseService.fail(res, {
							message : 'Add', 
							reason  : 'Param "category_id" missing'
						});
			}

			TransactionService.update(req, res);
		})

		// Delete one transaction
		.delete(function (req, res) {
			TransactionService.remove(req, res);
		});
};