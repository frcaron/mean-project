// Inject models
var PlanModel = require(global.__model + '/PlanModel');

//Inject services
var responseService = require(global.__service + '/ResponseService');
var programService = require(global.__service + '/ProgramService');

// Add link plan
var addPlanToParent = function(child) {

	PlanModel
		.findOne({ _id : child._id })
		.select('_user')
		.populate('_user')
		.exec(function(err, plan) {
			if(err) {
				throw err;
			}

			if(!plan) {
				throw new Error('Plan not found');
			} else if(plan) {
				var user = plan._user;
				
				if(!user) {
					throw new Error('User not found');
				} else if(user) {
					user.plans.push(child);
					user.save(function(err){
						if(err) {
							throw err;
						}
					});
				}
			}
		});
};

// Remove link plan
var removePlanToParent = function(child) {

	PlanModel
		.findOne({ _id : child._id })
		.select('_user')
		.populate('_user')
		.exec(function(err, plan) {
			if(err) {
				throw err;
			}
			
			if(!plan) {
				throw new Error('Plan not found');
			} else if(plan) {
				var user = plan._user;
				
				if(!user) {
					throw new Error('User not found');
				} else if(user) {
					user.plans.pull(child);
					user.save(function(err){
						if(err) {
							throw err;
						}
					});
				}
			}
		});
};

module.exports = {
	
	// Create one plan
	create : function(req, res) {

		var plan = new PlanModel();
		
		// Build object
		plan.month = req.body.month;
		plan.year = req.body.year;
		plan._user = req.decoded.id;
		
		// Query save
		plan.save(function(err) {
			if(err) {
				return res.json(responseService.fail('Add failed', err.message));
			}
			
			try {
				addPlanToParent(plan);
			} catch(err) {
				return res.json(responseService.fail('Add failed', err.message));
			}
			
			return res.json(responseService.success('Add success', plan._id));
		});
	},
	
	// Update one plan
	update : function(req, res) {

		// Query find plan by id and user
		PlanModel.findOne({ _id : req.params.plan_id, _user : req.decoded.id}, function(err, plan) {
			if(err) {
				return res.json(responseService.fail('Update failed', 'Find plan failed / ' + err.message));
			}

			if(!plan) {
				
				// Plan not exist
				return res.json(responseService.fail('Update failed', 'Plan not found'));
				
			} else if(plan) {
				
				// TODO param modification ???
				
				// Query save
				plan.save(function(err) {
					if(err) {
						return res.json(responseService.fail('Update failed', err.message));
					}
					return res.json(responseService.success('Update success'));
				});
			}
		});
	},
	
	// Remove one plan
	remove : function(req, res) {

		// Query remove
		PlanModel
			.findOneAndRemove({ _id : req.params.plan_id, _user : req.decoded.id })
			.populate('programs', '_id')
			.exec(function(err, plan) {
				if(err) {
					return res.json(responseService.fail('Remove failed', err.message));
				}
				
				if(!plan) {
					return res.json(responseService.fail('Remove failed', 'Plan not found'));
				} else if(plan) {
					
					try {
						removePlanToParent(plan);
						programService.removeByPlan(req.params.plan_id, req.decoded.id);
					} catch(err) {
						return res.json(responseService.fail('Remove failed', err.message));
					}
					
					return res.json(responseService.success('Remove success'));
				}
		});
	},
	
	// Get plans by user
	allByU : function(req, res) {

		// Query find by user
		PlanModel.find({ _user : req.decoded.id}, function(err, plans) {
			if(err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', plans));
		});
	},
	
	// Get one plan by id
	getById : function(req, res) {

		// Query find plan by id and user
		PlanModel.findOne({ _id : req.params.plan_id, _user : req.decoded.id}, function(err, plan) {
			if(err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', plan));
		});
	},
	
	// Test plan existing
	isExist : function(plan_id) {
		
		PlanModel.findById(plan_id, '_id', function(err, plan) {
			if(err) {
				throw new Error('Find plan failed');
			}
			if(!plan) {
				throw new Error('Plan id invalid');
			}
		});
	}
};