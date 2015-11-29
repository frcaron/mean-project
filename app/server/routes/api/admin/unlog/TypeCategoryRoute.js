"use strict";

// Inject
var Path                = require('path');
var ResponseService     = require(Path.join(global.__service, 'ResponseService'));
var TypeCategoryService = require(Path.join(global.__service, 'TypeCategoryService'));

// Propeties
var api_prefix = '/typecategories';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all type category
		.get(function (req, res, next) {
			TypeCategoryService.all(req, next);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:type_category_id')

		// Get one type category
		.get(function (req, res, next) {
			TypeCategoryService.getById(req, next);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});
};