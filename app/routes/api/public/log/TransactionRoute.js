"use strict";

//Inject
var ResponseService    = require(global.__service + '/ResponseService');
var TransactionService = require(global.__service + '/TransactionService');

// Properties
var api_prefix = '/transactions';

module.exports = function (router) {

	router.route(api_prefix)

		// Create one transaction
		.post(function (req, res) {

			// Validation
			if (!req.body.date) {
				return ResponseService.fail(res, 'Add failed', 'Param "date" missing');
			}
			if (!req.body.sum) {
				return ResponseService.fail(res, 'Add failed', 'Param "sum" missing');
			}
			if (!req.query.category_id) {
				return ResponseService.fail(res, 'Add failed', 'Param "category_id" missing');
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

			// Validation
			if (!req.body.date) {
				return ResponseService.fail(res, 'Update failed', 'Param "date" missing');
			}
			if (!req.query.category_id) {
				return ResponseService.fail(res, 'Update failed', 'Param "category_id" missing');
			}

			TransactionService.update(req, res);
		})

		// Delete one transaction
		.delete(function (req, res) {
			TransactionService.remove(req, res);
		});
};