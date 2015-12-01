"use strict";

//Inject
var Path            = require('path');
var ResponseService = require(Path.join(global.__service, 'response'));
var CategoryService = require(Path.join(global.__service, 'category'));
var Exception       = require(Path.join(global.__core, 'exception'));
var Logger          = require(Path.join(global.__core, 'system')).Logger;

// Properties
var api_prefix = '/categories';

module.exports = function (router) {

	router.route(api_prefix)

		// Create one category
		.post(function (req, res, next) {

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
				return next(new Exception.MetierEx('Param missing', msg));
			}
			next();

		}, function (req, res, next) {

			CategoryService.create(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/available')

		// Get categories by type category no exist
		.get(function (req, res, next) {

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
				return next(new Exception.MetierEx('Param missing', msg));
			}
			next();

		}, function (req, res, next) {

			CategoryService.allByTypeCatUNoUse(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:category_id')

		// Get one category
		.get(function (req, res, next) {
			CategoryService.getByIdU(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		})

		// Update one category
		.put(function (req, res, next) {
			CategoryService.update(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		})

		// Delete one category
		.delete(function (req, res, next) {
			CategoryService.desactivate(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res);
		});
};