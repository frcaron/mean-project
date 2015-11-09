// Inject
var responseService     = require(global.__service + '/ResponseService');
var typeCategoryService = require(global.__service + '/TypeCategoryService');

// Properties
var api_prefix = '/typeCategories';

module.exports = function (router) {

	router.route(api_prefix)

		// Create type category
		.post(function (req, res) {

			// Validation
			if (!req.body.type) {
				return responseService.fail(res, 'Add failed', 'Param "type" missing');
			}

			typeCategoryService.create(req, res);
		});

	router.route(api_prefix + '/:type_category_id')

		// Update one type category
		.put(function (req, res) {
			typeCategoryService.update(req, res);
		})

		// Delete one type category
		.delete(function (req, res) {
			typeCategoryService.remove(req, res);
		});
};