//Inject
var ResponseService    = require(global.__service + '/ResponseService');
var ProgramService     = require(global.__service + '/ProgramService');
var TransactionService = require(global.__service + '/TransactionService');

// Properties
var api_prefix = '/programs';

module.exports = function (router) {

	router.route(api_prefix)

		// Create one program
		.post(function (req, res) {

			// Validation
			if (!req.query.category_id) {
				return ResponseService.fail(res, 'Add failed', 'Param "category_id" missing');
			}
			if (!req.query.plan_id) {
				return ResponseService.fail(res, 'Add failed', 'Param "plan_id" missing');
			}

			ProgramService.create(req, res);
		});

	router.route(api_prefix + '/:program_id')

		// Get one program
		.get(function (req, res) {
			ProgramService.getByIdU(req, res);
		})

		// Update one program
		.put(function (req, res) {
			ProgramService.update(req, res);
		})

		// Delete one program
		.delete(function (req, res) {
			ProgramService.remove(req, res);
		});

	router.route(api_prefix + '/:program_id/transactions')

		// Get all transactions by program
		.get(function (req, res) {
			TransactionService.allByProgramU(req, res);
		});
};