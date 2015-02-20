var UserModel = require('../../models/UserModel');

var api_prefix = '/users';

module.exports = function(router) {
	
	router.route(api_prefix)
		
		// Get All users
		.get(function(req, res) {
			
			// Query find users
			UserModel.find(function(err, users) {
				if(err) {
					return res.json({ success : false, message : 'User not found' });
				}
				
				return res.json({ success : true, result : users });
			});
		})
	
		// Create new user
		.post(function(req, res) {
			
			// Validation
			if(!req.body.name) {
				return res.json({ success : false, message : 'Param name missing' });
			}
			if(!req.body.username) {
				return res.json({ success : false, message : 'Param username missing' });
			}
			if(!req.body.password) {
				return res.json({ success : false, message : 'Param password missing' });
			}
			
			var user = new UserModel();
			
			// Build object
			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;
			if(req.body.admin) {
				user.admin = req.body.admin;
			}
			
			// Query savec
			user.save(function(err) {
				if(err) {
					if(err.code == 11000) {
						return res.json({ success : false, message : 'User exist' });
					}
					
					return res.json({ success : false, message : 'Add failed' });
				}
				
				return res.json({ success : true, message : 'Add success', result : user._id });
			});
		});
	
	router.route(api_prefix + '/:user_id')
		
		// Get one user
		.get(function(req, res) {
			
			// Validation
			if(!req.params.user_id) {
				return res.json({ success : false, message : 'Param user id missing' });
			}
			
			// Query find user by id
			UserModel.findById(req.params.user_id, function(err, user) {
				if(err) {
					return res.json({ success : false, message : 'User not found' });
				}
				
				return res.json({ success : true, result : user });
			});
		})
		
		// Update one user by ID
		.put(function(req, res) {
			
			// Validation
			if(!req.params.user_id) {
				return res.json({ success : false, message : 'Param user id missing' });
			}
			
			// Query find user by id
			UserModel.findById(req.params.user_id, function(err, user) {
				if(err) {
					return res.json({ success : false, message : 'User not found' });
				}

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
						return res.json({ success : false, message : 'Update failed' });
					}
					
					return res.json({ success : true, message : 'Update success' });
				});
			});
		})
		
		// Delete one user by ID
		.delete(function(req, res) {
			
			// Validation
			if(!req.params.user_id) {
				return res.json({ success : false, message : 'Param user id missing' });
			}
			
			// Query remove
			UserModel.remove({ _id : req.params.user_id }, function(err) {
				if(err) {
					return res.json({ success : false, message : 'Remove failed' });
				}
				
				return res.json({ success : true, message : 'Remove success' });
			});
		});
};