"use strict";

//Inject
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service_trans + '/ResponseService');
var CategoryService = require(global.__service + '/CategoryService');

// Properties
var api_prefix = '/categories';

module.exports = function (router) {

	router.route(api_prefix)

		// Get categories by type category no exist
		.get(function (req, res) {

			let plan_id          = req.body.plan_id || req.query.plan_id;
			let type_category_id = req.body.type_category_id || req.query.type_category_id;

			Logger.debug('Public#CategoryRoute#post [validation]');
			Logger.debug('-- plan_id          : ' + plan_id);
			Logger.debug('-- type_category_id : ' + type_category_id);

			// Validation
			if (!plan_id) {
				return ResponseService.fail(res, {
							message : 'Add', 
							reason  : 'Param "plan_id" missing'
						});
			}
			if (!type_category_id) {
				return ResponseService.fail(res, {
							message : 'Add', 
							reason  : 'Param "type_category_id" missing'
						});
			}

			CategoryService.allByTypeCatUNoUse(req, res);
		})

		// Create one category
		.post(function (req, res) {

			let type_category_id = req.body.type_category_id || req.query.type_category_id;

			Logger.debug('Public#CategoryRoute#post [validation]');
			Logger.debug('-- req.body.name    : ' + req.body.name);
			Logger.debug('-- type_category_id : ' + type_category_id);

			// Validation
			if (!req.body.name) {
				return ResponseService.fail(res, {
							message : 'Add', 
							reason  : 'Param "name" missing'
						});
			}
			if (!type_category_id) {
				return ResponseService.fail(res, {
							message : 'Add', 
							reason  : 'Param "type_category_id" missing'
						});
			}

			CategoryService.create(req, res);
		});

	router.route(api_prefix + '/:category_id')

		// Get one category
		.get(function (req, res) {
			CategoryService.getByIdU(req, res);
		})

		// Update one category
		.put(function (req, res) {
			CategoryService.update(req, res);
		})

		// Delete one category
		.delete(function (req, res) {
			CategoryService.desactivate(req, res);
		});
};