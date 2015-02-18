var jwt = require('jsonwebtoken');
var tokenUtils = require('./../../../config/tokenUtils');

var UserModel = require('../../models/UserModel');

module.exports = function(router) {
	
	router.route('/login')
		
		// Get all type category
		.post(function(req, res) {
			
			if(!req.body.username) return res.status(403).json({ success : false, message : 'Param username missing' });
			
			UserModel.findOne({ username : req.body.username })
				.select('_id name username password admin')
				.exec(function(err, user) {
					if(err) throw err;
					
					if(!user) {
						
						// User not exist
						res.json({ success : false, message : 'Authentication failed, User not found'});
						
					} else if(user) {

						if(!req.body.password) return res.status(403).send({ success : false, message : 'Param password missing' });
						
						var validPassword = user.comparePassword(req.body.password);
						if(!validPassword) {
							
							// Wrong password
							res.json({ success : false, message : 'Authentication failed, Wrong password'});
							
						} else {

							// Generate token
							var token = jwt.sign({
								id 			: user._id,
								name 		: user.name,
								username 	: user.username,
								admin 		: user.admin
							}, tokenUtils.secret, { expiresMinutes : 1440 });

							res.json({ success : true, message : 'Authentication success', token : token });
						}
					}					
			});
		});
};