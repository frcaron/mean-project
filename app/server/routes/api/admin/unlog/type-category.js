"use strict";

// Inject
var path                = require('path');
var responseService     = require(path.join(global.__service, 'response'));
var typeCategoryService = require(path.join(global.__service, 'type-category'));

// Propeties
var api_prefix = '/typecategories';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all type category
		.get(function (req, res, next) {
			typeCategoryService.all(req, next);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:type_category_id')

		// Get one type category
		.get(function (req, res, next) {
			typeCategoryService.getById(req, next);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});
};