var mongoose = require('mongoose');

var CategoryModel = require('../../models/CategoryModel');

module.exports = function(router) {
	
	router.route('/categories')
		
		// Get all categories user
		.get(function(req, res) {
			
			var decoded = req.decoded;
			if(!decoded) return res.json({ success : false, message : 'Error token' });
			
			CategoryModel.find({ _user : decoded.id }, function(err, categories) {
					if(err) return res.json({ success : false, message : 'Category not found' });
					res.json(categories);
				});
		})
		
		// Create one category
		.post(function(req, res) {
			
			var decoded = req.decoded;
			if(!decoded) return res.json({ success : false, message : 'Error token' });

			var category = new CategoryModel();
			
			if(!req.body.name) return res.status(403).json({ success : false, message : 'Param name missing' });
			if(!req.body.type_category_id) return res.status(403).json({ success : false, message : 'Param type category id missing' });
			
			category.name = req.body.name;
			category._type = req.body.type_category_id;
			category._user = decoded.id;
			
			category.save(function(err) {
				if(err) return res.json({ success : false, message : 'Add failed' });
				res.json({ success : true, message : 'Add success' });
			});
		});
	
	router.route('/categories/:category_id')
	
		// Get one category by ID
		.get(function(req, res) {
			
			var decoded = req.decoded;
			if(!decoded) return res.json({ success : false, message : 'Error token' });
			
			if(!req.params.category_id) return res.status(403).json({ success : false, message : 'Param category id missing' });
			
			CategoryModel.find({ _id : req.params.category_id, _user : decoded.id}, function(err, category) {
				if(err) return res.json({ success : false, message : 'Category not found' });
				res.json(category);
			});
		})
		
		// Update one category by ID
		.put(function(req, res) {
			
			var decoded = req.decoded;
			if(!decoded) return res.json({ success : false, message : 'Error token' });
			
			if(!req.params.category_id) return res.status(403).json({ success : false, message : 'Param category id missing' });
			
			CategoryModel.find({ _id : req.params.category_id, _user : decoded.id}, function(err, category) {
				if(err) return res.json({ success : false, message : 'Category not found' });

				if(req.body.name) category.name = req.body.name;
				if(req.body.type_id) category._type = req.body.type_id;
				
				category.save(function(err) {
					if(err) return res.json({ success : false, message : 'Update failed' });
					res.json({ success : true, message : 'Update success' });
				});
			});
		})
		
		// Delete one category by ID
		.delete(function(req, res) {
			
			var decoded = req.decoded;
			if(!decoded) return res.json({ success : false, message : 'Error token' });
			
			if(!req.params.category_id) return res.status(403).json({ success : false, message : 'Param category id missing' });
			
			CategoryModel.remove({ _id : req.params.category_id, _user : decoded.id}, function(err) {
				if(err) return res.json({ success : false, message : 'Remove failed' });
				res.json({ success : true, message : 'Remove success' });
			});
		});
	
		router.route('/categories/type/:type_id')
			
			// Get all categories user by type
			.get(function(req, res) {
				
				var decoded = req.decoded;
				if(!decoded) return res.json({ success : false, message : 'Error token' });
				
				if(!req.params.type_id) return res.status(403).json({ success : false, message : 'Param type category id missing' });
				
				CategoryModel.find({ _user : decoded.id, _type : req.params.type_id }, function(err, categories) {
						if(err) return res.json({ success : false, message : 'Category not found' });
						res.json(categories);
					});
			});
};