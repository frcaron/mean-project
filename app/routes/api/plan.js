var PlanModel = require('../../models/PlanModel');

var api_prefix = '/plans'; 

module.exports = function(router) {
	
	router.route(api_prefix)
		
		// Get all plans
		.get(function(req, res) {
			
			// Query find user
			PlanModel.find({ _user : req.decoded.id }, function(err, plans) {
					if(err) {
						return res.json({ success : false, message : 'Plan not found' });
					}
					
					return res.json({ success : true, result : plans });
				});
		})
	
		// Create one plan
		.post(function(req, res) {
			
			// Validation
			if(!req.body.month) {
				return res.json({ success : false, message : 'Param month missing' });
			}
			if(!req.body.year) {
				return res.json({ success : false, message : 'Param year missing' });
			}
	
			var plan = new PlanModel();
			
			// Build object
			plan.month = req.body.month;
			plan.year = req.body.year;
			plan._user = req.decoded.id;
			
			// Query save
			plan.save(function(err) {
				if(err) {
					return res.json({ success : false, message : 'Add failed' });
				}
				
				return res.json({ success : true, message : 'Add success', result : plan._id });
			});
		});
	
	router.route(api_prefix + '/:plan_id')
	
		// Get one program
		.get(function(req, res) {
			
			// Query find plan by id and user
			PlanModel.findOne({ _id : req.params.plan_id, _user : req.decoded.id}, function(err, plan) {
				if(err) {
					return res.json({ success : false, message : 'Plan not found' });
				}
				
				return res.json({ success : true, result : plan });
			});
		})
		
		// Update one plan
		.put(function(req, res) {
			
			// Query find plan by id and user
			PlanModel.findOne({ _id : req.params.plan_id, _user : req.decoded.id}, function(err, plan) {
				if(err) {
					return res.json({ success : false, message : 'Plan not found' });
				}

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
						return res.json({ success : false, message : 'Update failed' });
					}
					
					return res.json({ success : true, message : 'Update success' });
				});
			});
		})
	
		// Delete one plan
		.delete(function(req, res) {
			
			// Query remove
			PlanModel.remove({ _id : req.params.plan_id, _user : req.decoded.id }, function(err) {
				if(err) {
					return res.json({ success : false, message : 'Remove failed' });
				}
				
				return res.json({ success : true, message : 'Remove success' });
			});
		});
};