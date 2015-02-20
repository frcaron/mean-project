// Inject models
var PlanModel = require(global.__model + '/PlanModel');

//Inject services
var responseService = require(global.__service + '/ResponseService');

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
				
				// Build object
				if(req.body.month) {
					plan.month = req.body.month;
				}
				if(req.body.year) {
					plan.year = req.body.year;
				}
				
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
		PlanModel.remove({ _id : req.params.plan_id, _user : req.decoded.id }, function(err) {
			if(err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
			return res.json(responseService.success('Remove success'));
		});
	},
	
	// Get plans by user
	getAllByU : function(req, res) {

		// Query find user
		PlanModel.find({ _user : req.decoded.id }, function(err, plans) {
				if(err) {
					return res.json(responseService.fail('Find failed', err.message));
				}
				return res.json(responseService.success('Find success', plans));
			});
	},
	
	// Get one plan by id
	getOneById : function(req, res) {

		// Query find plan by id and user
		PlanModel.findOne({ _id : req.params.plan_id, _user : req.decoded.id}, function(err, plan) {
			if(err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', plan));
		});
	}	,
	
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