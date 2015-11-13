"use strict";

//Inject
var Logger          = require(global.__app + '/LoggerManager');
var ResponseService = require(global.__service + '/ResponseService');
var CategoryService = require(global.__service + '/CategoryService');

// Properties
var api_prefix = '/categories';

module.exports = function (router) {

	router.route(api_prefix)

		// Get all categories user
		.get(function (req, res) {
			CategoryService.allByU(req, res);
		})

		// Create one category
		.post(function (req, res) {

			Logger.debug('Public#CategoryRoute#post [validation]');
			Logger.debug('-- req.body.name              : ' + req.body.name);
			Logger.debug('-- req.query.type_category_id : ' + req.query.type_category_id);

			// Validation
			if (!req.body.name) {
				return ResponseService.fail(res, {
							message : 'Add', 
							reason  : 'Param "name" missing'
						});
			}
			if (!req.query.type_category_id) {
				return ResponseService.fail(res, {
							message : 'Add', 
							reason  : 'Param "type_category_id" missing'
						});
			}

			CategoryService.create(req, res);
		});

	router.route(api_prefix + '/active')

		// Get all categories user
		.get(function (req, res) {
			CategoryService.allActiveByU(req, res);
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
			CategoryService.remove(req, res);
		});
};