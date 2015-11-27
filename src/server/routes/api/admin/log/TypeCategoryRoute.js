"use strict";

// Inject
var Exception           = require(global.__server  + '/ExceptionManager');
var Logger              = require(global.__server  + '/LoggerManager');
var ResponseService     = require(global.__service + '/ResponseService');
var TypeCategoryService = require(global.__service + '/TypeCategoryService');

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