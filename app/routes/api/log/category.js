//Inject services
var responseService = require(global.__service + '/ResponseService');
var categoryService = require(global.__service + '/CategoryService');

// Properties
var api_prefix = '/categories';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all categories user
		.get(function (req, res) {
			categoryService.allByU(req, res);
		})

		// Create one category
		.post(function (req, res, next) {

			// Validation
			if (!req.body.name) {
				return res.json(responseService.fail('Add failed', 'Param "name" msing'));
			}
			if (!req.body.type_category_id) {
				return res.json(responseService.fail('Add failed', 'Param "type_category_id" missing'));
			}

			categoryService.create(req, res);
		});

	router.route(api_prefix + '/active')

		// Get all categories user
		.get(function (req, res) {
			categoryService.allActiveByU(req, res);
		});

	router.route(api_prefix + '/:category_id')

		// Get one category
		.get(function (req, res) {
			categoryService.getByIdU(req, res);
		})

		// Update one category
		.put(function (req, res) {
			categoryService.update(req, res);
		})

		// Delete one category
		.delete(function (req, res) {
			categoryService.remove(req, res);
		});
};