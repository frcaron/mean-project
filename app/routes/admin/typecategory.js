var TypeCategoryModel = require('../../models/TypeCategoryModel');

var api_prefix = '/typeCategories'; 

module.exports = function(router) {
	
	router.route(api_prefix)
		
		// Create type category
		.post(function(req, res) {
			
			// Validation
			if(!req.body.type) {
				return res.json({ success : false, message : 'Param type missing' });
			}
			
			var typeCategory = new TypeCategoryModel();
			
			// Build object
			typeCategory.type = req.body.type;
			
			// Query save
			typeCategory.save(function(err) {
				if(err) {
					return res.json({ success : false, message : 'Add failed' });
				}
				
				return res.json({ success : true, message : 'Add success', result : typeCategory._id });
			});
		});
		
	
	router.route(api_prefix + '/:type_category_id')
	
		// Update one type category
		.put(function(req, res) {
			
			// Query find type category by id
			TypeCategoryModel.findById(req.params.type_category_id, function(err, typeCategory) {
				if(err) {
					return res.json({ success : false, message : 'Type category not found' });
				}

				// Build object
				if(req.body.type) {
					typeCategory.type = req.body.type;
				}
				
				// Query save
				typeCategory.save(function(err) {
					if(err) {
						return res.json({ success : false, message : 'Update failed' });
					}
					
					return res.json({ success : true, message : 'Update success' });
				});
			});
		})
	
		// Delete one type category
		.delete(function(req, res) {
			
			// Query remove
			TypeCategoryModel.remove({ _id : req.params.type_category_id }, function(err) {
				if(err) {
					return res.json({ success : false, message : 'Remode failed' });
				}
				
				return res.json({ success : true, message : 'Remove success' });
			});
		});
};