"use strict";

// Inject
var Path               = require('path');
var ResponseService    = require(Path.join(global.__service, 'response'));
var CategoryService    = require(Path.join(global.__service, 'category'));
var TransactionService = require(Path.join(global.__service, 'transaction'));

// Propeties
var api_prefix = '/typecategories';

module.exports = function (router) {

	router.route(api_prefix + '/:type_category_id/categories')

		// Get categories by type category no exist
		.get(function (req, res, next) {
			CategoryService.allByTypeU(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:type_category_id/transactions')

		// Get all transaction by type transactions
		.get(function (req, res, next) {
			TransactionService.allByTypeU(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});
};