var express = require('express');

var UserModel = require('../models/userModel');

var apiRouter = express.Router();

	// ============================
	// Middleware =================
	// ============================

	apiRouter.use(function(req, res, next) {
		next();
	});
	
	// ============================
	// Users ======================
	// ============================
	
	apiRouter.route('/users')
		
		.get(function(req, res) {
			UserModel.find(function(err, users) {				
				if(err) {
					return res.send(err);
				}
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
				res.send({ success : true, message : 'Save success' });
			});
		});
	
	apiRouter.route('/user/:user_id')
		
		.get(function(req, res) {			
			UserModel.findById(req.params.user_id, function(err, user) {
				if(err) {
					return res.send(err);
				}
				res.json(user);
			});
		});

module.exports = function(app) {
	app.use('/api', apiRouter);
};