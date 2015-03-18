// Inject models
var PlanModel = require(global.__model + '/PlanModel');
var ProgramModel = require(global.__model + '/ProgramModel');
var CategoryModel = require(global.__model + '/CategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Create one plan
	create  : function (req, res) {

		var plan = new PlanModel();
		var programUnknow = new ProgramModel();

		plan.month = req.body.month;
		plan.year = req.body.year;
		plan._user = req.decoded.id;

		var promise = plan.saveAsync();

		promise
			.then(function () {

				plan.addLinkUser();

				return CategoryModel.findOneAsync({
							_user : plan._user,
							name  : 'unknow'
						});
			})

			.then(function (category) {

				if (!category) {
					throw new Error('Category not found');
				}	

				programUnknow.category = category._id;
				programUnknow._plan = plan._id;
				programUnknow._user = plan._user;

				programUnknow.saveAsync();

				category._programs.push(programUnknow);
				
				return category.saveAsync();
			})

			.then(function () {
				return plan.update({
					programUnknow : programUnknow._id
				});
			})

			.then(function () {
				responseService.success(res, 'Add success', plan._id);
			})

			.catch(function (err) {

				// Rollback
				if(plan._id) {
					PlanModel.remove({ _id : plan._id}).execAsync();
				}
				if(programUnknow._id) {
					ProgramModel.remove({ _id : programUnknow._id }).execAsync();
					CategoryModel.findOne({ _programs : programUnknow._id }, function (err, category) {
						if(!err && category) {
							category._programs.pull(programUnknow);
							category.saveAsync();
						}
					});
				}

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

			.catch(function(err) {
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

			.catch(function(err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	}
};