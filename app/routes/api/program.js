//Inject services
var responseService = require(global.__service + '/ResponseService');
var programService = require(global.__service + '/ProgramService');
var planService = require(global.__service + '/PlanService');
var categoryService = require(global.__service + '/CategoryService');

// Properties
var api_prefix = '/programs'; 

module.exports = function(router) {
	
	router.route(api_prefix)
	
		// Create one program
		.post(function(req, res) {
			
			// Validation
			if(!req.body.category_id) {
				return res.json(responseService.fail('Add failed', 'Param "category_id" missing'));
			} else {
				try {
					categoryService.isExist(req.body.category_id);
				} catch(err) {
					return res.json(responseService.fail('Add failed', err.message));
				}
			}
			if(!req.body.plan_id) {
				return res.json(responseService.fail('Add failed', 'Param "plan_id" missing'));
			} else {
				try {
					planService.isExist(req.body.plan_id);
				} catch(err) {
					return res.json(responseService.fail('Add failed', err.message));
				}
			}
	
			programService.create(req, res);
		});
	
	router.route(api_prefix + '/:program_id')
	
		// Get one program
		.get(function(req, res) {
			programService.getByIdU(req, res);
		})
		
		// Update one program
		.put(function(req, res) {
			programService.update(req, res);
		})
	
		// Delete one program
		.delete(function(req, res) {
			programService.remove(req, res);		
		});
			
	router.route(api_prefix + '/plan/:plan_id')
			
		// Get programs by plan
		.get(function(req, res) {
			programService.allByPlanU(req, res);
		});
};