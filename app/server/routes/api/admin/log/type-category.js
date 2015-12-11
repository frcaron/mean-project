"use strict";

// Inject
var path                = require('path');
var responseService     = require(path.join(global.__service, 'response'));
var typeCategoryService = require(path.join(global.__service, 'type-category'));
var Exception           = require(path.join(global.__core, 'exception'));
var logger              = require(path.join(global.__core, 'system')).Logger;

// Properties
var api_prefix = '/typeCategories';

module.exports = function (router, auth) {

	router.route(api_prefix)

		// Create type category
		.post(auth, function (req, res, next) {

			logger.debug('[WSA - VALID] TypeCategoryRoute#post');
			logger.debug('              -- req.body.name : ' + req.body.name);

			// Validation
			if (!req.body.name) {
				return next(new Exception.MetierEx('Param missing',  [ 'name' ]));
			}
			next();

		}, function (req, res, next) {
			typeCategoryService.create(req, next);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:type_category_id')

		// Update one type category
		.put(auth, function (req, res, next) {
			typeCategoryService.update(req, next);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});
};