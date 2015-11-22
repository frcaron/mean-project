"use strict";

// Inject
var CategoryService    = require(global.__service + '/CategoryService');
var TransactionService = require(global.__service + '/TransactionService');

// Propeties
var api_prefix = '/typecategories';

module.exports = function (router) {

	router.route(api_prefix + '/:type_category_id/categories')

		// Get all categories by type category
		.get(function (req, res) {
			CategoryService.allByTypeCatU(req, res);
		});

	router.route(api_prefix + '/:type_category_id/transactions')

		// Get all transaction by type transactions
		.get(function (req, res) {
			TransactionService.allByTypeCatU(req, res);
		});
};