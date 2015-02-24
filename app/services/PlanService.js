// Inject models
var PlanModel = require(global.__model + '/PlanModel');
var ProgramModel = require(global.__model + '/ProgramModel');
var TransactionModel = require(global.__model + '/TransactionModel');
var CategoryModel = require(global.__model + '/CategoryModel');
var TypeCategoryModel = require(global.__model + '/TypeCategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

// Add link plan
var addPlanToParentUser = function (child) {

	child.populate('_user', function (err, plan) {
		if (err) {
			throw err;
		}
		if (!plan) {
			throw new Error('Plan not found');
		}

		var user = plan._user;
		if (!user) {
			throw new Error('User not found');
		}

		user.plans.push(child);
		user.save(function (err) {
			if (err) {
				throw err;
			}
		});
	});
};

// Remove link plan
var removePlanToParentUser = function (child, plan) {

	child.populate('_user', function (err) {
		if (err) {
			throw err;
		}
		if (!plan) {
			throw new Error('Plan not found');
		}

		var user = plan._user;
		if (!user) {
			throw new Error('User not found');
		}

		user.plans.pull(child);
		user.save(function (err) {
			if (err) {
				throw err;
			}
		});
	});
};

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
				return res.json(responseService.fail('Add failed', err.message));
			}

			try {
				addPlanToParentUser(plan);
			} catch (err) {
				return res.json(responseService.fail('Add failed', err.message));
			}

			var programUnknow = new ProgramModel();

			// Query find category user unknow
			CategoryModel.findOne({
				_user : plan._user,
				name  : 'unknow'
			}, function (err, category) {
				if (err) {
					return res.json(responseService.fail('Add failed', err.message));
				}
				if (!category) {
					return res.json(responseService.fail('Add failed', 'Category not found'));
				}

				// Build object
				programUnknow.category = category._id;
				programUnknow._plan = plan._id;
				programUnknow._user = plan._user;

				// Save program unknow
				programUnknow.save(function (err) {
					if (err) {
						return res.json(responseService.fail('Add failed', err.message));
					}

					// Save program in child
					category._programs.push(programUnknow);
					category.save(function (err) {
						if (err) {
							return res.json(responseService.fail('Add failed', err.message));
						}

						// Plan update
						plan.update({
							programUnknow : programUnknow._id
						}, function (err) {
							if (err) {
								return res.json(responseService.fail('Add failed', err.message));
							}
							return res.json(responseService.success('Add success', plan._id));
						});
					});
				});
			});
		});
	},

	// Update one plan
	update  : function (req, res) {

		// Query find plan by id and user
		PlanModel.findOne({
			_id   : req.params.plan_id,
			_user : req.decoded.id
		}, function (err, plan) {
			if (err) {
				return res.json(responseService.fail('Update failed', err.message));
			}
			if (!plan) {
				return res.json(responseService.fail('Update failed', 'Plan not found'));
			}

			// TODO param modification ???

			// Query save
			plan.save(function (err) {
				if (err) {
					return res.json(responseService.fail('Update failed', err.message));
				}
				return res.json(responseService.success('Update success'));
			});
		});
	},

	// Remove one plan
	remove  : function (req, res) {

		// Query remove
		PlanModel.findOneAndRemove({
			_id   : req.params.plan_id,
			_user : req.decoded.id
		}).populate('programs', '_id category transaction').exec(function (err, plan) {
			if (err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
			if (!plan) {
				return res.json(responseService.fail('Remove failed', 'Plan not found'));
			}

			try {
				removePlanToParentUser(plan);
			} catch (err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}

			// TODO Remove programs and programUnknow link to category
			// TODO Remove transactions

			return res.json(responseService.success('Remove success'));
		});
	},

	// Get plans by user
	allByU  : function (req, res) {

		// Query find by user
		PlanModel.find({
			_user : req.decoded.id
		}, function (err, plans) {
			if (err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', plans));
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
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', plan));
		});
	}
};