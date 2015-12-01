"use strict";

//Inject
var Path               = require('path');
var Moment             = require('moment');
var ResponseService    = require(Path.join(global.__service, 'response'));
var TransactionService = require(Path.join(global.__service, 'transaction'));
var Exception          = require(Path.join(global.__core, 'exception'));
var Logger             = require(Path.join(global.__core, 'system')).Logger;

// Properties
var api_prefix = '/transactions';

module.exports = function (router) {

	router.route(api_prefix)

		// Create one transaction
		.post(function (req, res, next) {

			let category_id = req.body.category_id ||req.query.category_id;

			Logger.debug('[WSP - VALID] TransactionRoute#post');
			Logger.debug('              -- req.body.date         : ' + req.body.date);
			Logger.debug('              -- req.body.sum          : ' + req.body.sum);
			Logger.debug('              -- req.query.category_id : ' + category_id);

			// Validation
			let msg = [];
			if (!req.body.date) {
				msg.push('date');
			}
			if (!req.body.sum) {
				msg.push('sum');
			}
			if (!category_id) {
				msg.push('category_id');
			}
			if(msg.length) {
				return next(new Exception.MetierEx('Param missing', msg));
			}

			var moment = Moment(req.body.date, "DD/MM/YYYY", true);
			if(!moment.isValid()) {
				return next(new Exception.MetierEx('Param invalid', [ 'date' ]));
			}
			req.body.date = moment;

			next();

		}, function (req, res, next) {

			TransactionService.create(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:transaction_id')

		// Get one transaction
		.get(function (req, res, next) {
			TransactionService.getByIdU(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		})

		// Update one transaction
		.put(function (req, res, next) {

			let category_id = req.body.category_id ||req.query.category_id;

			Logger.debug('[WSP - VALID] TransactionRoute#put');
			Logger.debug('              -- req.body.date         : ' + req.body.date);
			Logger.debug('              -- req.query.category_id : ' + category_id);

			// Validation
			let msg = [];
			if (!req.body.date) {
				msg.push('date');
			}
			if (!category_id) {
				msg.push('category_id');
			}
			if(msg.length) {
				return next(new Exception.MetierEx('Param missing', msg));
			}

			var moment = Moment(req.body.date, "DD/MM/YYYY", true);
			if(!moment.isValid()) {
				return next(new Exception.MetierEx('Param invalid', [ 'date' ]));
			}
			req.body.date = moment;

			next();

		}, function (req, res, next) {

			TransactionService.update(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res, {
				result  : req.result
			});
		})

		// Delete one transaction
		.delete(function (req, res, next) {
			TransactionService.remove(req, next, req.user.id);

		}, function (req, res) {
			ResponseService.success(res);
		});
};