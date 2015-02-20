// Inject application
var jwt = require('jsonwebtoken');
var tokenConfig = require(global.__config + '/token');

// Inject models
var UserModel = require(global.__model + '/UserModel');

//Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {
		
	// =========================================================================================
	// Public ==================================================================================
	// =========================================================================================
	
	// Authenticate user
	login : function(req, res) {
		
		// Query find user by username
		UserModel.findOne({ username : req.body.username })
			.select('_id name username password admin')
			.exec(function(err, user) {
				if(err) {
					return res.json(responseService.fail('Authentication failed', 'Find user failed / ' + err.message));
				}
				
				if(!user) {
					
					// User not exist
					return res.json(responseService.fail('Authentication failed', 'User not found'));
					
				} else if(user) {
					
					var validPassword = user.comparePassword(req.body.password);
					if(!validPassword) {
						
						// Wrong password
						return res.json(responseService.fail('Authentication failed', 'Wrong password'));
						
					} else {

						// Generate token
						var token = jwt.sign({
							id 			: user._id,
							name 		: user.name,
							username 	: user.username,
							admin 		: user.admin
						}, tokenConfig.secret, { expiresMinutes : 1440 });

						return res.json(responseService.success('Authentication success', token));
					}
				}					
		});
	}
};