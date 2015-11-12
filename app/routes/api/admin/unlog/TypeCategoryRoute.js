"use strict";

// Inject
var TypeCategoryService = require(global.__service + '/TypeCategoryService');

// Propeties
var api_prefix = '/typecategories';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all type category
		.get(function (req, res) {
			TypeCategoryService.all(req, res);
		});

	router.route(api_prefix + '/active')

		// Get all type category active
		.get(function (req, res) {
			TypeCategoryService.allActive(req, res);
		});

	router.route(api_prefix + '/:type_category_id')

		// Get one type category
		.get(function (req, res) {
			TypeCategoryService.getById(req, res);
		});
};