"use strict";

//Inject
var Logger          = require(global.__server + '/LoggerManager');
var ResponseService = require(global.__service + '/share/ResponseService');
var CategoryService = require(global.__service + '/CategoryService');

// Properties
var api_prefix = '/categories';

module.exports = function (router) {

	router.route(api_prefix)

		// Create one category
		.post(function (req, res) {

			let type_category_id = req.body.type_category_id || req.query.type_category_id;

			Logger.debug('[WSP - VALID] CategoryRoute#post');
			Logger.debug('              -- req.body.name    : ' + req.body.name);
			Logger.debug('              -- type_category_id : ' + type_category_id);

			// Validation
			var msg = [];
			if (!req.body.name) {
				msg.push('name');
			}
			if (!type_category_id) {
				msg.push('type_category_id');
			}
			if(msg.length) {
				return ResponseService.fail(res, {
					reason : 'Param missing',
					detail : msg
				});
			}

			CategoryService.create(req, res, req.user.id);
		});

	router.route(api_prefix + '/available')

		// Get categories by type category no exist
		.get(function (req, res) {

			let plan_id          = req.body.plan_id || req.query.plan_id;
			let type_category_id = req.body.type_category_id || req.query.type_category_id;

			Logger.debug('[WSP - VALID] CategoryRoute#post');
			Logger.debug('              -- plan_id          : ' + plan_id);
			Logger.debug('              -- type_category_id : ' + type_category_id);

			// Validation
			var msg = [];
			if (!plan_id) {
				msg.push('plan_id');
			}
			if (!type_category_id) {
				msg.push('type_category_id');
			}
			if(msg.length) {
				return ResponseService.fail(res, {
					reason : 'Param missing',
					detail : msg
				});
			}

			CategoryService.allByTypeCatUNoUse(req, res, req.user.id);
		});

	router.route(api_prefix + '/:category_id')

		// Get one category
		.get(function (req, res) {
			CategoryService.getByIdU(req, res, req.user.id);
		})

		// Update one category
		.put(function (req, res) {
			CategoryService.update(req, res, req.user.id);
		})

		// Delete one category
		.delete(function (req, res) {
			CategoryService.desactivate(req, res, req.user.id);
		});
};