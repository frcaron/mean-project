// Inject
var categoryService    = require(global.__service + '/CategoryService');
var transactionService = require(global.__service + '/TransactionService');

// Propeties
var api_prefix = '/typecategories';

module.exports = function (router) {

	router.route(api_prefix + '/:type_category_id/categories')

		// Get all categories by type category
		.get(function (req, res) {
			categoryService.allByTypeCategoryU(req, res);
		});

	router.route(api_prefix + '/:type_category_id/transactions')

		// Get all transaction by type transactions
		.get(function (req, res) {
			transactionService.allByTypeCategoryU(req, res);
		});
};