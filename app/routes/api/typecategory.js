// Inject services
var responseService = require(global.__service + '/ResponseService');
var typeCategoryService = require(global.__service + '/TypeCategoryService');

// Propeties
var api_prefix = '/typecategories';

module.exports = function(router) {

	router.route(api_prefix)

	// Get all type category
	.get(function(req, res) {
		typeCategoryService.allByU(req, res);
	});

	router.route(api_prefix + '/active')

	// Get all type category active
	.get(function(req, res) {
		typeCategoryService.allActiveByU(req, res);
	});

	router.route(api_prefix + '/id/:type_category_id')

	// Get one type category
	.get(function(req, res) {
		typeCategoryService.getByIdU(req, res);
	});
};