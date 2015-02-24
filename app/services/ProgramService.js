// Inject models
var PlanModel = require(global.__model + '/PlanModel');
var ProgramModel = require(global.__model + '/ProgramModel');
var TransactionModel = require(global.__model + '/TransactionModel');
var CategoryModel = require(global.__model + '/CategoryModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

// Add link program
var addProgramToParentPlan = function (child) {

	child.populate('_plan', function (err, program) {
		if (err) {
			throw err;
		}
		if (!program) {
			throw new Error('Program not found');
		}

		var plan = program._plan;
		if (!plan) {
			throw new Error('Plan not found');
		}

		plan.programs.push(child);
		plan.save(function (err) {
			if (err) {
				throw err;
			}
		});
	});
};

// Remove link program
var removeProgramToParentPlan = function (child) {

	child.populate('_plan', function (err, program) {
		if (err) {
			throw err;
		}
		if (!program) {
			throw new Error('Program not found');
		}

		var plan = program._plan;
		if (!plan) {
			throw new Error('Plan not found');
		}

		plan.programs.pull(child);
		plan.save(function (err) {
			if (err) {
				throw err;
			}
		});
	});
};

// Add link program
var addProgramToChildCategory = function (parent) {

	parent.populate('category', function (err, program) {
		if (err) {
			throw err;
		}
		if (!program) {
			throw new Error('Program not found');
		}

		var category = program.category;
		if (!category) {
			throw new Error('Category not found');
		}

		category._programs.push(parent);
		category.save(function (err) {
			if (err) {
				throw err;
			}
		});
	});
};

// Remove link program
var removeProgramToChildCategory = function (parent) {

	parent.populate('category', function (err, program) {
		if (err) {
			throw err;
		}
		if (!program) {
			throw new Error('Program not found');
		}

		var category = program.category;
		if (!category) {
			throw new Error('Category not found');
		}

		category._programs.pull(parent);
		category.save(function (err) {
			if (err) {
				throw err;
			}
		});
	});
};

// Change link program
var changeProgramToChildTransaction = function (parent) {

	parent.populate({
		path   : '_plan',
		select : 'programUnknow'
	}, function (err, program) {
		if (err) {
			throw err;
		}
		if (!program) {
			throw new Error('Program not found');
		}

		var transactions = program.transactions;
		if (transactions) {
			TransactionModel.update({
				_id : {
					$in : transactions
				}
			}, {
				_program : program._plan.programUnknow
			}, {
				multi : true
			}, function (err) {
				if (err) {
					throw err;
				}
			});
		}
	});
};

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

					try {
						addProgramToParentPlan(program);
						addProgramToChildCategory(program);
					} catch (err) {
						return res.json(responseService.fail('Add failed', err.message));
					}

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

				try {

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

				try {
					if (program.isModified('category')) {
						removeProgramToChildCategory(last_program);
						addProgramToChildCategory(program);
					}
				} catch (err) {
					return res.json(responseService.fail('Update failed', err.message));
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

			try {
				removeProgramToParentPlan(program);
				removeProgramToChildCategory(program);
				changeProgramToChildTransaction(program);
			} catch (err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}

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