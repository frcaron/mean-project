"use strict";

// Inject
var Path                = require('path');
var Exception           = require(Path.join(global.__server, 'ExceptionManager'));
var ResponseService     = require(Path.join(global.__service, 'response'));
var TypeCategoryService = require(Path.join(global.__service, 'type-category'));
var Logger              = require(Path.join(global.__core, 'system')).Logger;

// Properties
var api_prefix = '/typeCategories';

module.exports = function (router) {

	router.route(api_prefix)

		// Create type category
		.post(function (req, res, next) {

			Logger.debug('[WSA - VALID] TypeCategoryRoute#post');
			Logger.debug('              -- req.body.name : ' + req.body.name);

			// Validation
			if (!req.body.name) {
				return next(new Exception.MetierEx('Param missing',  [ 'name' ]));
			}
			next();

		}, function (req, res, next) {

			TypeCategoryService.create(req, next);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:type_category_id')

		// Update one type category
		.put(function (req, res, next) {
			TypeCategoryService.update(req, next);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});
};