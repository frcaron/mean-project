// Inject models
var ProgramModel = require(global.__model + '/ProgramModel');

//Inject services
var responseService = require(global.__service + '/ResponseService');
var transactionService = require(global.__service + '/TransactionService');
var categoryService = require(global.__service + '/CategoryService');

// Add link program
var addProgramToParent = function(child) {

	ProgramModel
		.findOne({ _id : child._id })
		.select('_plan')
		.populate('_plan')
		.exec(function(err, program) {
			if(err) {
				throw err;
			}
			
			if(!program) {
				throw new Error('Program not found');
			} else if(program) {
				var plan = program._plan;
				
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
			}
		});
};

// Remove link program
var removeProgramToParent = function(id_parent, child) {

	ProgramModel
		.findOne({ _id : child._id })
		.select('_plan')
		.populate('_plan')
		.exec(function(err, program) {
			if(err) {
				throw err;
			}
			
			if(!program) {
				throw new Error('Program not found');
			} else if(program) {
				var plan = program._plan;
				
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
			}
		});
};

module.exports = {
	
	// Create one program
	create : function(req, res) {

		var program = new ProgramModel();
		
		// Build object
		program.category = req.body.category_id;
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

			try {
				addProgramToParent(program);
				categoryService.addParentProgram(program._category, program);
			} catch(err) {
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
				
				var last_program = program;
			
				// Build object
				if(req.body.category_id) {

					try {
						categoryService.isExist(req.body.category_id);
					} catch(err) {
						return res.json(responseService.fail('Update failed', err.message));
					}
					
					program.category = req.body.category_id;
				}
				if(req.body.sum) {
					program.sum = req.body.sum;
				}
				
				try{
					categoryService.removeParentProgram(last_program._category, last_program);
					categoryService.addParentProgram(program._category, program);
				} catch(err) {
					return res.json(responseService.fail('Update failed', err.message));
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
		
		var planService = require(global.__service + '/PlanService');

		// Query remove
		ProgramModel.findOneAndRemove({ _id : req.params.program_id, _user : req.decoded.id }, function(err, program) {
				
			if(err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
			
			if(!program) {
				return res.json(responseService.fail('Remove failed', 'Program not found' ));
			} else if(program) {
				
				try {
					planService.removeChildProgram(program._plan, program);
					categoryService.removeParentProgram(program._category, program);
					transactionService.removeByProgram(program._id, program._user);
				} catch(err) {
					return res.json(responseService.fail('Remove failed', err.message));
				}
				
				return res.json(responseService.success('Remove success'));				
			}
		});
	},
	
	// Get programs by plan
	allByPlanU : function(req, res) {

		// Query find programs by user and plan
		ProgramModel.find({ _user : req.decoded.id, _plan : req.params.plan_id }, function(err, programs) {
				if(err) {
					return res.json(responseService.fail('Find failed', err.message));
				}
				return res.json(responseService.success('Find success', programs));
			});
	},
	
	// Get one program by id
	getByIdU : function(req, res) {
		
		// Query find program by id and user
		ProgramModel.findOne({ _id : req.params.program_id, _user : req.decoded.id}, function(err, program) {
			if(err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', program));
		});
	},
	
	// =========================================================================================
	// Private =================================================================================
	// =========================================================================================

	// Add link transaction
	addChildTransaction : function(id_parent, child) {

		ProgramModel.findOne({ _id : id_parent, _user : child._user }, function(err, program) {
				if(err) {
					throw err;
				}
				
				if(!program) {
					throw new Error('Program not found');
				} else if(program) {
					program.transactions.push(child);
					program.save(function(err){
						if(err) {
							throw err;
						}
					});
				}
		});
	},
	
	// Remove link transaction
	removeChildTransaction : function(id_parent, child) {

		ProgramModel.findOne({ _id : id_parent, _user : child._user }, function(err, program) {
				if(err) {
					throw err;
				}
				
				if(!program) {
					throw new Error('Program not found');
				} else if(program) {
					program.transactions.pull(child);
					program.save(function(err){
						if(err) {
							throw err;
						}
					});
				}
		});
	},
	
	// Remove programs plan owner
	removeByPlan : function(plan_id, user_id) {
		
		// Query remove
		ProgramModel.find({ _plan : plan_id, _user : user_id }, function(err, programs) {
			if(err) {
				throw new Error('Remove failed');
			}

			if(programs) {
				for(var program in programs) {
					try {
						transactionService.removeByProgram(program._id, user_id);
					} catch(err){
						throw new Error('Remove failed', err.message);
					}
				}	
			}
			
			ProgramModel.remove({ _plan : plan_id, _user : user_id }, function(err){
				if(err) {
					throw new Error('Remove failed', err.message);
				}
			});			
		});
	}		
};