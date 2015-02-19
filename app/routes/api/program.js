var ProgramModel = require('../../models/ProgramModel');
var TransactionModel = require('../../models/TransactionModel');

var api_prefix = '/programs'; 

module.exports = function(router) {
	
	// Validate param program_id
	router.param('program_id', function(req, res, next, program_id) {
		if(!program_id) {
			return res.status(403).json({ success : false, message : 'Param program missing' });
		}
		next();
	});
	
	// Validate param plan_id
	router.param('plan_id', function(req, res, next, plan_id) {
		if(!plan_id) {
			return res.status(403).json({ success : false, message : 'Param plan id missing' });
		}
		next();
	});
	
	// Validation token exist
	router.route(api_prefix + '/*')
			
		.all(function(req, res, next){
			
			// Get token user
			var decoded = req.decoded;
			if(!decoded) {
				return res.json({ success : false, message : 'Error token' });
			}
			
			next();
		});
	
	router.route(api_prefix)
	
		// Create one program
		.post(function(req, res) {
			
			// Validation
			if(!req.body.category_id) {
				return res.status(403).json({ success : false, message : 'Param category id missing' });
			}
			if(!req.body.plan_id) {
				return res.status(403).json({ success : false, message : 'Param type plan id missing' });
			}
	
			var program = new ProgramModel();
			
			// Build object
			program._category = req.body.category_id;
			if(req.body.sum) {
				program.sum = req.body.sum;
			}
			program._plan = req.params.plan_id;
			program._user = req.decoded.id;
			
			// Query save
			program.save(function(err) {
				if(err) {
					return res.json({ success : false, message : 'Add failed' });
				}
				
				return res.json({ success : true, message : 'Add success', result : program._id });
			});
		});
	
	router.route(api_prefix + '/:program_id')
	
		// Get one program
		.get(function(req, res) {
			
			// Query find program by id and user
			ProgramModel.findOne({ _id : req.params.program_id, _user : req.decoded.id}, function(err, program) {
				if(err) {
					return res.json({ success : false, message : 'Program not found' });
				}
				
				return res.json({ success : true, result : program});
			});
		})
		
		// Update one program
		.put(function(req, res) {
			
			// Query find prgram by id and user
			ProgramModel.findOne({ _id : req.params.program_id, _user : req.decoded.id}, function(err, program) {
				if(err) {
					return res.json({ success : false, message : 'Program not found' });
				}

				// Build object
				if(req.body.category_id) {
					program._category = req.body.category_id;
				}
				if(req.body.sum) {
					program.sum = req.body.sum;
				}
				if(req.body.plan_id) {
					program._plan = req.body.plan_id;
				}
				
				// Query save
				program.save(function(err) {
					if(err) {
						return res.json({ success : false, message : 'Update failed' });
					}
					
					return res.json({ success : true, message : 'Update success' });
				});
			});
		})
	
		// Delete one program
		.delete(function(req, res) {
			
			// Query remove
			ProgramModel.remove({ _id : req.params.program_id, _user : req.decoded.id }, function(err) {
				if(err) {
					return res.json({ success : false, message : 'Remove failed' });
				}
				
				return res.json({ success : true, message : 'Remove success' });
			});
			
		});
			
	router.route(api_prefix + '/plan/:plan_id')
			
		// Get all programs by plan
		.get(function(req, res) {
			
			// Query find programs by user and plan
			ProgramModel.find({ _user : req.decoded.id, _plan : req.params.plan_id }, function(err, programs) {
					if(err) {
						return res.json({ success : false, message : 'Program not found' });
					}
					
					return res.json({ success : true, result : programs });
				});
		});
};