//Inject services
var responseService = require(global.__service + '/ResponseService');
var planService = require(global.__service + '/PlanService');
var programService = require(global.__service + '/ProgramService');

// Inject properties
var api_prefix = '/plans';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all plans
		.get(function (req, res) {
			planService.allByU(req, res);
		})

		// Create one plan
		.post(function (req, res) {

			// Validation
			if (!req.body.month) {
				return res.json(responseService.fail('Add failed', 'Param "month" missing'));
			}
			if (!req.body.year) {
				return res.json(responseService.fail('Add failed', 'Param "year" missing'));
			}

			planService.create(req, res);
		});

	router.route(api_prefix + '/:plan_id')

		// Get one program
		.get(function (req, res) {
			planService.getById(req, res);
		})

		// Delete one plan
		.delete(function (req, res) {
			planService.remove(req, res);
		});

	router.route(api_prefix + '/:plan_id/programs')

		// Get all programs by plan
		.get(function (req, res) {
			programService.allByPlanU(req, res);
		});
};