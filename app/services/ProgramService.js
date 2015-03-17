// Inject models
var PlanModel = require(global.__model + '/PlanModel');
var ProgramModel = require(global.__model + '/ProgramModel');
var CategoryModel = require(global.__model + '/CategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Create one program
	create     : function (req, res) {

		// Validate category id
		CategoryModel.findById(req.body.category_id, '_id', function (err, category) {
			if (err) {
				return responseService.fail(res, 'Add failed', err.message);
			}
			if (!category) {
				return responseService.fail(res, 'Add failed', 'Category id invalid');
			}

			// Validate plan id
			PlanModel.findById(req.body.plan_id, '_id', function (err, plan) {
				if (err) {
					return responseService.fail(res, 'Add failed', err.message);
				}
				if (!plan) {
					return responseService.fail(res, 'Add failed', 'Plan id invalid');
				}

				var program = new ProgramModel();

				// Build object
				program.category = req.body.category_id;
				if (req.body.sum) {
					program.sum = req.body.sum;
				}
				program._plan = req.body.plan_id;
				program._user = req.decoded.id;

				// Query save
				program.save(function (err) {
					if (err) {
						return responseService.fail(res, 'Add failed', err.message);
					}

					program.addLinkPlan();
					program.addLinkCategory();

					return responseService.success(res, 'Add success', program._id);
				});
			});
		});
	},

	// Update one program
	update     : function (req, res) {

		// Query find prgram by id and user
		ProgramModel.findOne({
			_id   : req.params.program_id,
			_user : req.decoded.id
		}, function (err, program) {
			if (err) {
				return responseService.fail(res, 'Update failed', err.message);
			}
			if (!program) {
				return responseService.fail(res, 'Update failed', 'Program not found');
			}

			// Build object
			if (req.body.sum) {
				program.sum = req.body.sum;
			}

			// Query save
			program.save(function (err) {
				if (err) {
					return responseService.fail(res, 'Update failed', err.message);
				}
				return responseService.success(res, 'Update success');
			});
		});
	},

	// Remove one program
	remove     : function (req, res) {

		// Query remove
		ProgramModel.findOneAndRemove({
			_id   : req.params.program_id,
			_user : req.decoded.id
		}, function (err, program) {
			if (err) {
				return responseService.fail(res, 'Remove failed', err.message);
			}
			if (!program) {
				return responseService.fail(res, 'Remove failed', 'Program not found');
			}

			program.removeLinkPlan();
			program.removeLinkCategory();
			program.resetLinkTransaction();

			return responseService.success(res, 'Remove success');
		});
	},

	// Get programs by plan
	allByPlanU : function (req, res) {

		// Query find programs by user and plan
		ProgramModel.find({
			_user : req.decoded.id,
			_plan : req.params.plan_id
		}, function (err, programs) {
			if (err) {
				return responseService.fail(res, 'Find failed', err.message);
			}
			return responseService.success(res, 'Find success', programs);
		});
	},

	// Get one program by id
	getByIdU   : function (req, res) {

		// Query find program by id and user
		ProgramModel.findOne({
			_id   : req.params.program_id,
			_user : req.decoded.id
		}, function (err, program) {
			if (err) {
				return responseService.fail(res, 'Find failed', err.message);
			}
            if(!program) {
                return responseService.fail(res, 'Find failed', 'Program not found');
            }
			return responseService.success(res, 'Find success', program);
		});
	}
};