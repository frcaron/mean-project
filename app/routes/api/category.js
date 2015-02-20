//Inject services
var responseService = require(global.__service + '/ResponseService');
var categoryService = require(global.__service + '/CategoryService');
var typeCategoryService = require(global.__service + '/TypeCategoryService');

// Properties
var api_prefix = '/categories'; 

module.exports = function(router) {
	
	router.route(api_prefix)
		
		// Get all categories user
		.get(function(req, res) {
			categoryService.getAllByU(req, res);
		})
		
		// Create one category
		.post(function(req, res, next) {
			
			// Validation
			if(!req.body.name) {
				return res.json(responseService.fail('Add failed', 'Param "name" missing'));
			}
			if(!req.body.type_category_id) {
				return res.json(responseService.fail('Add failed', 'Param "type_category_id" missing'));
			} else {
				try {
					typeCategoryService.isExist(req.body.type_category_id);
				} catch(err) {
					return res.json(responseService.fail('Add failed', err.message));
				}
			}
			
			categoryService.create(req, res);
		});
	
	router.route(api_prefix + '/:category_id')
	
		// Get one category
		.get(function(req, res) {
			categoryService.getOneByIdU(req, res);
		})
		
		// Update one category
		.put(function(req, res) {
			categoryService.update(req, res);			
		})
		
		// Delete one category
		.delete(function(req, res) {
			categoryService.remove(req, res);			
		});
	
	router.route(api_prefix + '/typecat/:type_category_id')
		
		// Get all categories user by type
		.get(function(req, res) {
			categoryService.getAllByTypeCategoryU(req, res);
		});
};