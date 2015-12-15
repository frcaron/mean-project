"use strict";

// Inject
var path               = require('path');
var responseService    = require(path.join(global.__service, 'response'));
var categoryService    = require(path.join(global.__service, 'category'));
var transactionService = require(path.join(global.__service, 'transaction'));

// Propeties
var api_prefix = '/typecategories';

module.exports = function (router, auth) {

	router.route(api_prefix + '/:type_category_id/categories')

		// Get categories by type category no exist
		.get(auth, function (req, res, next) {
			categoryService.allByTypeU(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:type_category_id/transactions')

		// Get all transaction by type transactions
		.get(auth, function (req, res, next) {
			transactionService.allByTypeU(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});
};