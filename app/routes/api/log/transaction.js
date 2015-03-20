//Inject services
var responseService = require(global.__service + '/ResponseService');
var transactionService = require(global.__service + '/TransactionService');

// Properties
var api_prefix = '/transactions';

module.exports = function (router) {

	router.route(api_prefix)

		// Create one transaction
		.post(function (req, res) {

			// Validation
			if (!req.body.date) {
				return responseService.fail(res, 'Add failed', 'Param "date" missing');
			}
			if (!req.body.sum) {
				return responseService.fail(res, 'Add failed', 'Param "sum" missing');
			}
			if (!req.query.category_id) {
				return responseService.fail(res, 'Add failed', 'Param "category_id" missing');
			}

			transactionService.create(req, res);
		});

	router.route(api_prefix + '/:transaction_id')

		// Get one transaction
		.get(function (req, res) {
			transactionService.getByIdU(req, res);
		})

		// Update one transaction
		.put(function (req, res) {

			// Validation
			if (!req.body.date) {
				return responseService.fail(res, 'Update failed', 'Param "date" missing');
			}
			if (!req.query.category_id) {
				return responseService.fail(res, 'Update failed', 'Param "category_id" missing');
			}

			transactionService.update(req, res);
		})

		// Delete one transaction
		.delete(function (req, res) {
			transactionService.remove(req, res);
		});
};