"use strict";

// Inject
var path            = require('path');
var typeCategoryDao = require(path.join(global.__dao, 'type-category'));
var logger          = require(path.join(global.__core, 'logger'))('service', __filename);

module.exports = {

	// Create one type category
	create (req, next) {

		logger.debug({ method : 'create', point : logger.pt.start });

		typeCategoryDao.create({
				name : req.body.name
			})
			.then(function (typeCategory){
				req.result = typeCategory;
				next();
			})
			.catch(function (err){
				next(err);
			});

		logger.debug({ method : 'create', point : logger.pt.end });
	},

	// Update one type category
	update (req, next) {

		logger.debug({ method : 'update', point : logger.pt.start });

		typeCategoryDao.update({
				type_category_id : req.params.type_category_id,
				name             : req.body.name
			})
			.then(function (typeCategory) {
				req.result = typeCategory;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug({ method : 'update', point : logger.pt.end });
	},

	// Get all type category
	all (req, next) {

		logger.debug({ method : 'all', point : logger.pt.start });

		typeCategoryDao.getAll()
			.then(function (typeCategories) {
				req.result = typeCategories;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug({ method : 'all', point : logger.pt.end });
	},

	// Get one type category by id
	getById (req, next) {

		logger.debug({ method : 'getById', point : logger.pt.start });

		typeCategoryDao.getOne('byId', { type_category_id : req.params.type_category_id })
			.then(function (typeCategory) {
				req.result = typeCategory;
				next();
			})
			.catch(function (err) {
				next(err);
			});

		logger.debug({ method : 'getById', point : logger.pt.end });
	}
};