
var TypeCategoryModel = require('../../models/TypeCategoryModel');

module.exports = function(router) {
	
	router.route('/typeCategories')
		
		// Get all type category
		.get(function(req, res) {
			TypeCategoryModel.find(function(err, typeCategories) {
				if(err) return res.json({ success : false, message : 'Type category not found' });
				res.json(typeCategories);
			});
		});
		
	
	router.route('/typeCategories/:type_cat_id')
	
		// Get one type category by ID
		.get(function(req, res) {		
			
			if(!req.params.type_cat_id) return res.status(403).json({ success : false, message : 'Param type category id missing' });
			
			TypeCategoryModel.findById(req.params.type_cat_id, function(err, typeCategory) {
				if(err) return res.json({ success : false, message : 'Type category not found' });
				res.json(typeCategory);
			});
		});
};