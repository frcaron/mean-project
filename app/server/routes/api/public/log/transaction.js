"use strict";

//Inject
var path               = require('path');
var moment             = require('moment');
var responseService    = require(path.join(global.__service, 'response'));
var transactionService = require(path.join(global.__service, 'transaction'));
var Exception          = require(path.join(global.__core, 'exception'));
var logger             = require(path.join(global.__core, 'logger'))('route', __filename);

// Properties
var api_prefix = '/transactions';

module.exports = function (router, auth) {

	router.route(api_prefix)

		// Create one transaction
		.post(auth, function (req, res, next) {

			let category_id = req.body.category_id ||req.query.category_id;

			logger.debug({ method : 'transactions@post', point : logger.pt.valid, params : {
				'req.body.date' : req.body.date,
				'req.body.sum'  : req.body.sum,
				'category_id'   : category_id
			} });

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

			var m = moment(req.body.date, "DD/MM/YYYY", true);
			if(!m.isValid()) {
				return next(new Exception.MetierEx('Param invalid', [ 'date' ]));
			}
			req.body.date = m;

			next();

		}, function (req, res, next) {

			transactionService.create(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		});

	router.route(api_prefix + '/:transaction_id')

		// Get one transaction
		.get(auth, function (req, res, next) {
			transactionService.getByIdU(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		})

		// Update one transaction
		.put(auth, function (req, res, next) {

			let category_id = req.body.category_id ||req.query.category_id;

			logger.debug({ method : 'transactions/:id@put', point : logger.pt.valid, params : {
				'req.body.date' : req.body.date,
				'category_id'   : category_id
			} });

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

			var m = moment(req.body.date, "DD/MM/YYYY", true);
			if(!m.isValid()) {
				return next(new Exception.MetierEx('Param invalid', [ 'date' ]));
			}
			req.body.date = m;

			next();

		}, function (req, res, next) {

			transactionService.update(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res, {
				result  : req.result
			});
		})

		// Delete one transaction
		.delete(auth, function (req, res, next) {
			transactionService.remove(req, next, req.user.id);

		}, function (req, res) {
			responseService.success(res);
		});
};