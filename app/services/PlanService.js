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

		// Build object
		plan.month = req.body.month;
		plan.year = req.body.year;
		plan._user = req.decoded.id;

		// Query save
		plan.save(function (err) {
			if (err) {
				return responseService.fail(res, 'Add failed', err.message);
			}

			plan.addLinkUser();

			// Query find category user unknow
			CategoryModel.findOne({
				_user : plan._user,
				name  : 'unknow'
			}, function (err, category) {
				if (err) {
					return responseService.fail(res, 'Add failed', err.message);
				}
				if (!category) {
					return responseService.fail(res, 'Add failed', 'Category not found');
				}

				var programUnknow = new ProgramModel();

				// Build object
				programUnknow.category = category._id;
				programUnknow._plan = plan._id;
				programUnknow._user = plan._user;

				// Save program unknow
				programUnknow.save(function (err) {
					if (err) {
						return responseService.fail(res, 'Add failed', err.message);
					}

					// Save program in child
					category._programs.push(programUnknow);
					category.save(function (err) {
						if (err) {
							return responseService.fail(res, 'Add failed', err.message);
						}

						// Plan update
						plan.update({
							programUnknow : programUnknow._id
						}, function (err) {
							if (err) {
								return responseService.fail(res, 'Add failed', err.message);
							}
							return responseService.success(res, 'Add success', plan._id);
						});
					});
				});
			});
		});
	},

	// Remove one plan
	remove  : function (req, res) {

		// Query remove
        /*PlanModel.findOneAndRemove({
			_id   : req.params.plan_id,
			_user : req.decoded.id
		}).populate('programs', '_id category transaction').exec(function (err, plan) {
			if (err) {
				return responseService.fail(res, 'Remove failed', err.message);
			}
			if (!plan) {
				return responseService.fail(res, 'Remove failed', 'Plan not found');
			}

			plan.removeLinkUser();

			// TODO Remove programs and programUnknow link to category
			// TODO Remove transactions

			return responseService.success(res, 'Remove success');
		});*/
	},

	// Get plans by user
	allByU  : function (req, res) {

		// Query find by user
		PlanModel.find({
			_user : req.decoded.id
		}, function (err, plans) {
			if (err) {
				return responseService.fail(res, 'Find failed', err.message);
			}
			return responseService.success(res, 'Find success', plans);
		});
	},

	// Get one plan by id
	getById : function (req, res) {

		// Query find plan by id and user
		PlanModel.findOne({
			_id   : req.params.plan_id,
			_user : req.decoded.id
		}, function (err, plan) {
			if (err) {
				return responseService.fail(res, 'Find failed', err.message);
			}
			return responseService.success(res, 'Find success', plan);
		});
	}
};