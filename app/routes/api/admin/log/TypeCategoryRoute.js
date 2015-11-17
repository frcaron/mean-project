"use strict";

// Inject
var Logger              = require(global.__app + '/LoggerManager');
var ResponseService     = require(global.__service_trans + '/ResponseService');
var TypeCategoryService = require(global.__service + '/TypeCategoryService');

// Properties
var api_prefix = '/typeCategories';

module.exports = function (router) {

	router.route(api_prefix)

		// Create type category
		.post(function (req, res) {

			Logger.debug('Admin#TypeCategoryRoute#post [validation]');
			Logger.debug('-- req.body.name : ' + req.body.name);

			// Validation
			if (!req.body.name) {
				return ResponseService.fail(res, {
							message : 'Add', 
							reason  : 'Param "name" missing'
						});
			}

			TypeCategoryService.create(req, res);
		});

	router.route(api_prefix + '/:type_category_id')

		// Update one type category
		.put(function (req, res) {
			TypeCategoryService.update(req, res);
		});
};