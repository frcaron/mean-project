// Inject models
var PlanModel = require(global.__model + '/PlanModel');

//Inject services
var responseService = require(global.__service + '/ResponseService');
var userService = require(global.__service + '/UserService');
var programService = require(global.__service + '/ProgramService');

module.exports = {
		
	// =========================================================================================
	// Public ==================================================================================
	// =========================================================================================
	
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
				userService.addChildPlan(plan._user, plan);
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
						userService.removeChildPlan(plan._user, plan);
						programService.removeByPlan(req.params.plan_id, req.decoded.id);
					} catch(err) {
						return res.json(responseService.fail('Remove failed', err.message));
					}
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
	
	// =========================================================================================
	// Private =================================================================================
	// =========================================================================================
	
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
	},
	
	// Add link program
	addChildProgram : function(id_parent, child) {

		PlanModel.findOne({ _id : id_parent, _user : child._user }, function(err, plan) {
				if(err) {
					throw err;
				}
				
				if(!plan) {
					throw new Error('Plan not found');
				} else if(plan) {
					plan.programs.push(child);
					plan.save(function(err){
						if(err) {
							throw err;
						}
					});
				}
		});
	},
	
	// Remove link program
	removeChildProgram : function(id_parent, child) {

		PlanModel.findOne({ _id : id_parent, _user : child._user }, function(err, plan) {
				if(err) {
					throw err;
				}
				
				if(!plan) {
					throw new Error('Plan not found');
				} else if(plan) {
					plan.programs.pull(child);
					plan.save(function(err){
						if(err) {
							throw err;
						}
					});
				}
		});
	}
};