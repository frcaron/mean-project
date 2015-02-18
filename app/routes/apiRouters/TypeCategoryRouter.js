
var TypeCategoryModel = require('../../models/TypeCategoryModel');

module.exports = function(router) {
	
	router.route('/typeCategories')
		
		.get(function(req, res) {
			TypeCategoryModel.find(function(err, typeCategories) {				
				if(err) return res.send(err);
				res.json(typeCategories);
			});
		});
		
	
	router.route('/typeCategories/:type_cat_id')
	
		.get(function(req, res) {			
			TypeCategoryModel.findById(req.params.type_cat_id, function(err, typeCategory) {
				if(err) return res.send(err);
				res.json(typeCategory);
			});
		});
};