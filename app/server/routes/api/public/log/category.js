"use strict";

//Inject
var path            = require('path');
var responseService = require(path.join(global.__service, 'response'));
var categoryService = require(path.join(global.__service, 'category'));
var Exception       = require(path.join(global.__core, 'exception'));
var logger          = require(path.join(global.__core, 'system')).Logger;

// Properties
var api_prefix = '/categories';

module.exports = function (router, auth) {

	router.route(api_prefix)

		// Create one category
		.post(auth, function (req, res, next) {

			let type_category_id = req.body.type_category_id || req.query.type_category_id;

			logger.debug('[WSP - VALID] CategoryRoute#post');
			logger.debug('              -- req.body.name    : ' + req.body.name);
			logger.debug('              -- type_category_id : ' + type_category_id);

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

			categoryService.create(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/available')

		// Get categories by type category no exist
		.get(auth, function (req, res, next) {

			let plan_id          = req.body.plan_id || req.query.plan_id;
			let type_category_id = req.body.type_category_id || req.query.type_category_id;

			logger.debug('[WSP - VALID] CategoryRoute#post');
			logger.debug('              -- plan_id          : ' + plan_id);
			logger.debug('              -- type_category_id : ' + type_category_id);

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

			categoryService.allByTypeCatUNoUse(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:category_id')

		// Get one category
		.get(auth, function (req, res, next) {
			categoryService.getByIdU(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		})

		// Update one category
		.put(auth, function (req, res, next) {
			categoryService.update(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		})

		// Delete one category
		.delete(auth, function (req, res, next) {
			categoryService.desactivate(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res);
		});
};