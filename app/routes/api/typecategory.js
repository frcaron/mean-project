var TypeCategoryModel = require('../../models/TypeCategoryModel');

var api_prefix = '/typeCategories'; 

module.exports = function(router) {
	
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
		
	
	router.route(api_prefix + '/:type_category_id')
	
		// Get one type category
		.get(function(req, res) {	
			
			// Query find category by id
			TypeCategoryModel.findById(req.params.type_category_id, function(err, typeCategory) {
				if(err) {
					return res.json({ success : false, message : 'Type category not found' });
				}
				
				return res.json({ success : true, result : typeCategory });
			});
		});
};