// Inject models
var PlanModel = require(global.__model + '/PlanModel');
var ProgramModel = require(global.__model + '/ProgramModel');
var TransactionModel = require(global.__model + '/TransactionModel');
var CategoryModel = require(global.__model + '/CategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Create one program
	create     : function (req, res) {

		// Validate category id
		CategoryModel.findById(req.body.category_id, '_id', function (err, category) {
			if (err) {
				return res.json(responseService.fail('Add failed', err.message));
			}
			if (!category) {
				return res.json(responseService.fail('Add failed', 'Category id invalid'));
			}

			// Validate plan id
			PlanModel.findById(req.body.plan_id, '_id', function (err, plan) {
				if (err) {
					return res.json(responseService.fail('Add failed', err.message));
				}
				if (!plan) {
					return res.json(responseService.fail('Add failed', 'Plan id invalid'));
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
						return res.json(responseService.fail('Add failed', err.message));
					}

					program.addLinkPlan();
					program.addLinkCategory();

					return res.json(responseService.success('Add success', program._id));
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
				return res.json(responseService.fail('Update failed', err.message));
			}
			if (!program) {
				return res.json(responseService.fail('Update failed', 'Program not found'));
			}

			var last_program = program;

			// Build object
			if (req.body.category_id) {

				try { // TODO 

					// Validate category id
					CategoryModel.findById(req.body.category_id, '_id', function (err, category) {
						if (err) {
							throw err;
						}
						if (!category) {
							throw new Error('Category id invalid');
						}
					});

				} catch (err) {
					return res.json(responseService.fail('Update failed', err.message));
				}

				program.category = req.body.category_id;
			}
			if (req.body.sum) {
				program.sum = req.body.sum;
			}

			// Query save
			program.save(function (err) {
				if (err) {
					return res.json(responseService.fail('Update failed', err.message));
				}

				if (program.isModified('category')) {
					last_program.removeLinkCategory();
					program.addLinkCategory();
				}

				return res.json(responseService.success('Update success'));
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
				return res.json(responseService.fail('Remove failed', err.message));
			}
			if (!program) {
				return res.json(responseService.fail('Remove failed', 'Program not found'));
			}

			program.removeLinkPlan();
			program.removeLinkCategory();
			program.resetLinkTransaction();

			return res.json(responseService.success('Remove success'));
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
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', programs));
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
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', program));
		});
	}
};