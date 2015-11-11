// Inject
var Promise         = require('bluebird');
var ResponseService = require(global.__service + '/ResponseService');
var PlanDao         = require(global.__dao + '/PlanDao');
var ProgramDao      = require(global.__dao + '/ProgramDao');
var CategoryDao     = require(global.__dao + '/CategoryDao');
var TypeCategoryDao = require(global.__dao + '/TypeCategoryDao');

module.exports = {

	// Create one plan
	create  : function (req, res) {

		var planTmp, typeCategoryTmp;

		var inputPlan = {
			month   : req.body.month,
			year    : req.body.year,
			user_id : req.decoded.id
		};

		PlanDao.create(inputPlan)
			.then(function (plan) {
				planTmp = plan;

				return TypeCategoryDao.getOne({ type : 'unknow' })
					.then(function (typeCategory) {
						return Promise.resolve(typeCategory);

					}, function () {
						var inputTypeCategory = {					
							type   : 'unknow',
							active : false
						};

						return TypeCategoryDao.create(inputTypeCategory);
					})
					.then(function (typeCategory) {
						typeCategoryTmp = typeCategory;

						var filtersCategory = {
							type  : typeCategory._id,
							user_id : req.decoded.id
						} ;

						return CategoryDao.getOne(filtersCategory);
					})
					.then(function (category) {				
						return Promise.resolve(category);

					}, function () {
						var inputCategory = {
							name    : 'unknow',
							type_id : typeCategoryTmp._id,
							user_id : req.decoded.id,
							active  : false
						};

						return CategoryDao.create(inputCategory);
					})
					.then(function (category) {
						var inputProgram = {
							category_id : category._id,
							plan_id     : planTmp._id,
							user_id     : req.decoded.id
						};

						return ProgramDao.create(inputProgram);
					})
					.catch(function (err) {
						PlanDao.remove({ id : planTmp._id });
						throw err;
					});
			})
			.then(function () {
				ResponseService.success(res, 'Add success', planTmp);
			})
			.catch(function (err) {
				ResponseService.fail(res, 'Add failed', err.message);
			});
	},

	// Get plans by user
	allByU  : function (req, res) {

		var filters = {
			user_id : req.decoded.id
		};

		PlanDao.getAll(filters)
			.then(function (plans) {
				ResponseService.success(res, 'Find success', plans);
			})
			.catch(function (err) {
				ResponseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get one plan by id
	getById : function (req, res) {

		var filters = {
			id      : req.params.plan_id,
			user_id : req.decoded.id
		};

		PlanDao.getOne(filters)
			.then(function (plan) {
				ResponseService.success(res, 'Find success', plan);
			})
			.catch(function (err) {
				ResponseService.fail(res, 'Find failed', err.message);
			});
	}
};