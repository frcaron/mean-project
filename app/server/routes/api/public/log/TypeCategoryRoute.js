"use strict";

// Inject
var ResponseService    = require(global.__service + '/ResponseService');
var CategoryService    = require(global.__service + '/CategoryService');
var TransactionService = require(global.__service + '/TransactionService');

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