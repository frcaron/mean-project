"use strict";

// Inject
var ResponseService     = require(global.__service + '/ResponseService');
var TypeCategoryService = require(global.__service + '/TypeCategoryService');

// Properties
var api_prefix = '/typeCategories';

module.exports = function (router) {

	router.route(api_prefix)

		// Create type category
		.post(function (req, res) {

			// Validation
			if (!req.body.type) {
				return ResponseService.fail(res, 'Add failed', 'Param "type" missing');
			}

			TypeCategoryService.create(req, res);
		});

	router.route(api_prefix + '/:type_category_id')

		// Update one type category
		.put(function (req, res) {
			TypeCategoryService.update(req, res);
		})

		// Delete one type category
		.delete(function (req, res) {
			TypeCategoryService.remove(req, res);
		});
};