// Inject services
var responseService = require(global.__service + '/ResponseService');
var typeCategoryService = require(global.__service + '/TypeCategoryService');

// Propeties
var api_prefix = '/typeCategories'; 

module.exports = function(router) {
	
	router.route(api_prefix)
		
		// Get all type category
		.get(function(req, res) {
			typeCategoryService.getAllByU(req, res);
		});
		
	
	router.route(api_prefix + '/:type_category_id')
	
		// Get one type category
		.get(function(req, res) {
			typeCategoryService.getOneByIdU(req, res);
		});
};