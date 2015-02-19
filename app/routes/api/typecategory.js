var TypeCategoryModel = require('../../models/TypeCategoryModel');

var api_prefix = '/typeCategories'; 

module.exports = function(router) {
	
	// Validate param type_cat_id
	router.param('type_cat_id', function(req, res, next, type_cat_id) {
		if(!type_cat_id) {
			return res.status(403).json({ success : false, message : 'Param type category missing' });
		}
		next();
	});
	
	router.route(api_prefix)
		
		// Get all type category
		.get(function(req, res) {
			
			// Query find categories
			TypeCategoryModel.find(function(err, typeCategories) {
				if(err) {
					return res.json({ success : false, message : 'Type category not found' });
				}
				
				return res.json({ success : true, result : typeCategories });
			});
		});
		
	
	router.route(api_prefix + '/:type_cat_id')
	
		// Get one type category
		.get(function(req, res) {	
			
			// Query find category by id
			TypeCategoryModel.findById(req.params.type_cat_id, function(err, typeCategory) {
				if(err) {
					return res.json({ success : false, message : 'Type category not found' });
				}
				
				return res.json({ success : true, result : typeCategory });
			});
		});
};