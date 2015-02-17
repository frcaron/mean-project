
var UserModel = require('../../models/UserModel');

module.exports = function(router) {
	
	router.route('/users')
		
		.get(function(req, res) {
			UserModel.find(function(err, users) {				
				if(err) return res.send(err);
				res.json(users);
			});
		})
	
		.post(function(req, res) {			
			var user = new UserModel();
			
			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;
			
			user.save(function(err) {
				if(err) {
					if(err.code == 11000) {
						return res.json({ success : false, message : 'User exist' });
					} else {
						return res.send(err);
					}
				}
				res.json({ success : true, message : 'Add success' });
			});
		});
	
	router.route('/users/:user_id')
		
		.get(function(req, res) {			
			UserModel.findById(req.params.user_id, function(err, user) {
				if(err) return res.send(err);
				res.json(user);
			});
		})
		
		.put(function(req, res) {
			UserModel.findById(req.params.user_id, function(err, user) {
				if(err) return res.send(err);

				if(req.body.name) {
					user.name = req.body.name;
				}
				if(req.body.username) {
					user.username = req.body.username;
				}
				if(req.body.password) {
					user.password = req.body.password;
				}
				
				user.save(function(err) {
					if(err) return res.send(err);
					res.json({ success : true, message : 'Update success' })
				});
			});
		})
		
		.delete(function(req, res) {
			UserModel.remove({ _id : req.params.user_id }, function(err, user) {
				if(err) return res.send(err);
				res.json({ success : true, message : 'Remove success' });
			});
		});
};