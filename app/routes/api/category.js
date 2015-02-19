var UserModel = require('../../models/UserModel');
var CategoryModel = require('../../models/CategoryModel');
var TypeCategoryModel = require('../../models/TypeCategoryModel');

var api_prefix = '/categories'; 

module.exports = function(router) {
	
	// Validate param category_id
	router.param('category_id', function(req, res, next, category_id) {
		if(!category_id) {
			return res.status(403).json({ success : false, message : 'Param category missing' });
		}
		next();
	});
	
	// Validate param type_id
	router.param('type_cat_id', function(req, res, next, type_cat_id) {
		if(!type_cat_id) {
			return res.status(403).json({ success : false, message : 'Param type category missing' });
		}
		next();
	});
	
	// Validation token exist
	router.use(function(req, res, next){
		
		// Get token user
		var decoded = req.decoded;
		if(!decoded) {
			return res.status(403).json({ success : false, message : 'Error token' });
		} else {
			UserModel.findById(decoded.id, '_id', function(err, user) {
				if(err || !user) {
					return res.status(403).json({ success : false, message : 'User id invalid' });
				}
			});
		}
		
		if(req.body.type_cat_id) {
			TypeCategoryModel.findById(req.body.type_cat_id, '_id', function(err, typeCategory) {
				if(err || !typeCategory) {
					 res.status(403).json({ success : false, message : 'Type category id invalid' });
					res.end();
				}
			});
		}
		
		next();
	});
	
	router.route(api_prefix)
		
		// Get all categories user
		.get(function(req, res) {
			
			console.log('get');
			
			// Query find categories by user
			CategoryModel.find({ _user : req.decoded.id }, function(err, categories) {
					if(err) {
						return res.json({ success : false, message : 'Category not found' });
					}
					
					return res.json({ success : true, result : categories });
				});
		})
		
		// Create one category
		.post(function(req, res) {
			
			console.log('post');
			
			// Validation
			if(!req.body.name) {
				return res.status(403).json({ success : false, message : 'Param name missing' });
			}
			if(!req.body.type_cat_id) {
				return res.status(403).json({ success : false, message : 'Param type category id missing' });
			}

			var category = new CategoryModel();
			
			// Build object
			category.name = req.body.name;
			category._type = req.body.type_cat_id;
			category._user = req.decoded.id;
			
			// Query save
			category.save(function(err) {
				if(err) {
					return res.json({ success : false, message : 'Add failed' });
				}
				
				return res.json({ success : true, message : 'Add success', result : category._id });
			});
		});
	
	router.route(api_prefix + '/:category_id')
	
		// Get one category
		.get(function(req, res) {
			
			// Query find category by id and user
			CategoryModel.findOne({ _id : req.params.category_id, _user : req.decoded.id}, function(err, category) {
				if(err) {
					return res.json({ success : false, message : 'Category not found' });
				}
				
				return res.json({ success : true, result : category});
			});
		})
		
		// Update one category
		.put(function(req, res) {
			
			// Query find category by id and user
			CategoryModel.findOne({ _id : req.params.category_id, _user : req.decoded.id}, function(err, category) {
				if(err) {
					return res.json({ success : false, message : 'Category not found' });
				}

				// Build object
				if(req.body.name) {
					category.name = req.body.name;
				}
				if(req.body.type_id) {
					category._type = req.body.type_id;
				}
				
				// Query save
				category.save(function(err) {
					if(err) {
						return res.json({ success : false, message : 'Update failed' });
					}
					
					return res.json({ success : true, message : 'Update success' });
				});
			});
		})
		
		// Delete one category
		.delete(function(req, res) {
			
			// Query remove
			CategoryModel.remove({ _id : req.params.category_id, _user : req.decoded.id}, function(err) {
				if(err) {
					return res.json({ success : false, message : 'Remove failed' });
				}
				
				return res.json({ success : true, message : 'Remove success' });
			});
		});
	
	router.route(api_prefix + '/typecat/:type_cat_id')
		
		// Get all categories user by type
		.get(function(req, res) {
			
			// Query find categories by id and type category
			CategoryModel.find({ _user : req.decoded.id, _type : req.params.type_cat_id }, function(err, categories) {
					if(err) {
						return res.json({ success : false, message : 'Category not found' });
					}
					
					return res.json({ success : true, result : categories });
				});
		});
};