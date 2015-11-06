// Inject models
var PlanModel          = require(global.__model + '/PlanModel');
var ProgramModel       = require(global.__model + '/ProgramModel');
var CategoryModel      = require(global.__model + '/CategoryModel');
var TypeCategoryModel  = require(global.__model + '/TypeCategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Create one plan
	create  : function (req, res) {

		var plan = new PlanModel();

		plan.month = req.body.month;
		plan.year  = req.body.year;
		plan._user = req.decoded.id;

		var promise = plan.saveAsync();

		promise
			.then(function () {
				return TypeCategoryModel.findOneAsync({
					type  : 'unknow'
				});
			})

			.then(function (typeCategory) {
				
				if (!typeCategory) {
					responseService.fail(res, 'Add failed', 'TypeCategory unknow missing');
				}

				return CategoryModel.findOneAsync({
					_type : typeCategory._id,
					_user : req.decoded.id
				});
			})			

			.then(function (category) {
				if(!category) {
					responseService.fail(res, 'Add failed', 'Category unknow missing');
				}
				
				var program = new ProgramModel();

				program._category = category._id;
				program._plan     = plan._id;
				program._user     = req.decoded.id;

				return program.saveAsync();
			})

			.then(function () {
				responseService.success(res, 'Add success', plan._id);
			})

			.catch(function (err) {
				responseService.fail(res, 'Add failed', err.message);
			});
	},

	// Get plans by user
	allByU  : function (req, res) {

		var promise = PlanModel.findAsync({
			_user : req.decoded.id
		});

		promise
			.then(function (plans) {
				responseService.success(res, 'Find success', plans);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get one plan by id
	getById : function (req, res) {

		var promise = PlanModel.findOneAsync({
			_id   : req.params.plan_id,
			_user : req.decoded.id
		});

		promise
			.then(function (plan) {
				responseService.success(res, 'Find success', plan);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	}
};