
var UserModel = require('../../models/UserModel');

module.exports = function(router) {
	
	router.route('/users')
		
		// Get All users
		.get(function(req, res) {
			UserModel.find(function(err, users) {
				if(err) return res.json({ success : false, message : 'User not found' });
				res.json(users);
			});
		})
	
		// Create new user
		.post(function(req, res) {
			var user = new UserModel();
			
			if(!req.body.name) return res.status(403).json({ success : false, message : 'Param name missing' });
			if(!req.body.username) return res.status(403).json({ success : false, message : 'Param username missing' });
			if(!req.body.password) return res.status(403).json({ success : false, message : 'Param password missing' });
			
			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;
			if(req.body.admin) user.admin = req.body.admin;
			
			user.save(function(err) {
				if(err) {
					if(err.code == 11000) {
						return res.json({ success : false, message : 'User exist' });
					} else {
						if(err) return res.json({ success : false, message : 'Add failed' });
					}
				}
				res.json({ success : true, message : 'Add success' });
			});
		});
	
	router.route('/users/:user_id')
		
		// Get one user by ID
		.get(function(req, res) {
			
			if(!req.params.user_id) return res.status(403).json({ success : false, message : 'Param user id missing' });
			
			UserModel.findById(req.params.user_id, function(err, user) {
				if(err) return res.json({ success : false, message : 'User not found' });
				res.json(user);
			});
		})
		
		// Update one user by ID
		.put(function(req, res) {
			
			if(!req.params.user_id) return res.status(403).json({ success : false, message : 'Param user id missing' });
			
			UserModel.findById(req.params.user_id, function(err, user) {
				if(err) return res.json({ success : false, message : 'User not found' });

				if(req.body.name) user.name = req.body.name;
				if(req.body.username) user.username = req.body.username;
				if(req.body.password) user.password = req.body.password;
				if(req.body.admin) user.admin = req.body.admin;
				
				user.save(function(err) {
					if(err) return res.json({ success : false, message : 'Update failed' });
					res.json({ success : true, message : 'Update success' });
				});
			});
		})
		
		// Delete one user by ID
		.delete(function(req, res) {
			
			if(!req.params.user_id) return res.status(403).json({ success : false, message : 'Param user id missing' });
			
			UserModel.remove({ _id : req.params.user_id }, function(err) {
				if(err) return res.json({ success : false, message : 'Remove failed' });
				res.json({ success : true, message : 'Remove success' });
			});
		});
};