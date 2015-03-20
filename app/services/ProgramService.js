// Inject models
var PlanModel = require(global.__model + '/PlanModel');
var ProgramModel = require(global.__model + '/ProgramModel');
var CategoryModel = require(global.__model + '/CategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Create one program
	create     : function (req, res) {

		var program = new ProgramModel();

		var promise = CategoryModel.findByIdAsync(req.query.category_id, '_id');

		promise
			.then(function (category) {

				if (!category) {
					throw new Error('Category id invalid');
				}

				return PlanModel.findByIdAsync(req.query.plan_id, '_id');
			})

			.then(function (plan) {

				if (!plan) {
					throw new Error('Plan id invalid');
				}

				program.category = req.query.category_id;
				if (req.body.sum) {
				program.sum      = req.body.sum;
				}
				program._plan    = req.query.plan_id;
				program._user    = req.decoded.id;

				return program.saveAsync();
			})

			.then(function () {

				program.addLinkPlan();
				program.addLinkCategory();

				responseService.success(res, 'Add success', program._id);
			})

			.catch(function (err) {

				// Rollback
				if (program._id) {
					program.removeLinkPlan();
					program.removeLinkCategory();
					ProgramModel.remove({ _id : program._id }).exec();
				}

				responseService.fail(res, 'Add failed', err.message);
			});
	},

	// Update one program
	update     : function (req, res) {

		var promise = ProgramModel.findOneAsync({
			_id   : req.params.program_id,
			_user : req.decoded.id
		});

		promise
			.then(function (program) {

				if (!program) {
					throw new Error('Program not found');
				}
				if (req.body.sum) {
					program.sum = req.body.sum;
				}

				return program.saveAsync();
			})

			.then(function () {
				responseService.success(res, 'Update success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Update failed', err.message);
			});
	},

	// Remove one program
	remove     : function (req, res) {

		var promise = ProgramModel.findOneAndRemoveAsync({
			_id   : req.params.program_id,
			_user : req.decoded.id
		});

		promise
			.then(function (program) {

				if (!program) {
					throw new Error('Program not found');
				}

				program.removeLinkPlan();
				program.removeLinkCategory();
				program.resetLinkTransaction();

				responseService.success(res, 'Remove success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Remove failed', err.message);
			});
	},

	// Get programs by plan
	allByPlanU : function (req, res) {

		var promise = ProgramModel.findAsync({
			_user : req.decoded.id,
			_plan : req.params.plan_id
		});

		promise
			.then(function (programs) {
				responseService.success(res, 'Find success', programs);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get one program by id
	getByIdU   : function (req, res) {

		var promise = ProgramModel.findOneAsync({
			_id   : req.params.program_id,
			_user : req.decoded.id
		});

		promise
			.then(function (program) {

				if (!program) {
					throw new Error('Program not found');
				}
				responseService.success(res, 'Find success', program);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	}
};