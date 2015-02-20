// Inject models
var UserModel = require(global.__model + '/UserModel');

//Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {
		
	// =========================================================================================
	// Public ==================================================================================
	// =========================================================================================
	
	// Create one user
	create : function(req, res) {

		var user = new UserModel();
		
		// Build object
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;
		if(req.body.admin) {
			user.admin = req.body.admin;
		}
		
		// Query save
		user.save(function(err) {
			if(err) {
				if(err.code == 11000) {
					return res.json(responseService.fail('Add failed', 'User exist'));
				}
				return res.json(responseService.fail('Add failed', err.message));
			}
			return res.json(responseService.success('Add success', user._id));
		});
	},
	
	// Update one user
	update : function(req, res) {
	
		// Query find user by id
		UserModel.findById(req.params.user_id, function(err, user) {
			if(err) {
				return res.json(responseService.fail('Update failed', 'Find user failed / ' + err.message));
			}

			if(!user) {
				
				// User not exist
				return res.json(responseService.fail('Update failed', 'User not found'));
				
			} else if(user) {
				
				// Build object
				if(req.body.name) {
					user.name = req.body.name;
				}
				if(req.body.username) {
					user.username = req.body.username;
				}
				if(req.body.password) {
					user.password = req.body.password;
				}
				if(req.body.admin) {
					user.admin = req.body.admin;
				}
				
				// Query save
				user.save(function(err) {
					if(err) {
						return res.json(responseService.fail('Update failed', err.message));
					}
					return res.json(responseService.success('Update success'));
				});
			}
		});
	},
	
	// Remove one user
	remove : function(req, res) {

		// Query remove
		UserModel.remove({ _id : req.params.user_id }, function(err) {
			if(err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
			return res.json(responseService.success('Remove success'));
		});
	},
	
	// Get all users
	all : function(req, res) {
	
		// Query find users
		UserModel.find(function(err, users) {
			if(err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', users));
		});
	},
	
	// Get one user by id
	getById : function(req, res) {
	
		// Query find user by id
		UserModel.findById(req.params.user_id, function(err, user) {
			if(err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', user));
		});
	},
	
	// =========================================================================================
	// Private =================================================================================
	// =========================================================================================
	
	// Add link plan
	addChildPlan : function(id_parent, child) {

		UserModel.findOne({ _id : id_parent }, function(err, user) {
				if(err) {
					throw err;
				}
				
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
		});
	},
	
	// Remove link plan
	removeChildPlan : function(id_parent, child) {

		UserModel.findOne({ _id : id_parent }, function(err, user) {
				if(err) {
					throw err;
				}
				
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
		});
	}
};