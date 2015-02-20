// Inject models
var ProgramModel = require(global.__model + '/ProgramModel');

//Inject services
var responseService = require(global.__service + '/ResponseService');
var planService = require(global.__service + '/PlanService');
var categoryService = require(global.__service + '/CategoryService');

module.exports = {
	
	// Create one program
	create : function(req, res) {

		var program = new ProgramModel();
		
		// Build object
		program._category = req.body.category_id;
		if(req.body.sum) {
			program.sum = req.body.sum;
		}
		program._plan = req.body.plan_id;
		program._user = req.decoded.id;
		
		// Query save
		program.save(function(err) {
			if(err) {
				return res.json(responseService.fail('Add failed', err.message));
			}
			return res.json(responseService.success('Add success', program._id));
		});
	},
	
	// Update one program
	update : function(req, res) {

		// Query find prgram by id and user
		ProgramModel.findOne({ _id : req.params.program_id, _user : req.decoded.id}, function(err, program) {
			if(err) {
				return res.json(responseService.fail('Update failed', 'Find program failed / ' + err.message));
			}

			if(!program) {
				
				// Program not exist
				return res.json(responseService.fail('Update failed', 'Program not found'));
				
			} else if(program) {
			
				// Build object
				if(req.body.category_id) {

					try {
						categoryService.isExist(req.body.category_id);
					} catch(err) {
						return res.json(responseService.fail('Update failed', err.message));
					}
					
					program._category = req.body.category_id;
				}
				if(req.body.sum) {
					program.sum = req.body.sum;
				}
				if(req.body.plan_id) {

					try {
						planService.isExist(req.body.plan_id);
					} catch(err) {
						return res.json(responseService.fail('Update failed', err.message));
					}
					
					program._plan = req.body.plan_id;
				}
				
				// Query save
				program.save(function(err) {
					if(err) {
						return res.json(responseService.fail('Update failed', err.message));
					}
					return res.json(responseService.success('Update success'));
				});
			}
		});
	},
	
	// Remove one program
	remove : function(req, res) {

		// Query remove
		ProgramModel.remove({ _id : req.params.program_id, _user : req.decoded.id }, function(err) {
			if(err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
			return res.json(responseService.success('Remove success'));
		});
	},
	
	// Get programs by plan
	getAllByPlanU : function(req, res) {

		// Query find programs by user and plan
		ProgramModel.find({ _user : req.decoded.id, _plan : req.params.plan_id }, function(err, programs) {
				if(err) {
					return res.json(responseService.fail('Find failed', err.message));
				}
				return res.json(responseService.success('Find success', programs));
			});
	},
	
	// Get one program by id
	getOneByIdU : function(req, res) {
		
		// Query find program by id and user
		ProgramModel.findOne({ _id : req.params.program_id, _user : req.decoded.id}, function(err, program) {
			if(err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', program));
		});
	}		
};