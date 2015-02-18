
var TypeCategoryModel = require('../../models/TypeCategoryModel');

module.exports = function(router) {
	
	router.route('/typeCategories')
		
		// Create type category
		.post(function(req, res) {
			
			var typeCategory = new TypeCategoryModel();
			
			if(!req.body.type) return res.status(403).json({ success : false, message : 'Param type missing' });
			
			typeCategory = req.body.type;
			
			typeCategory.save(function(err) {
				if(err) return res.json({ success : false, message : 'Add failed' });
				res.json({ success : true, message : 'Add success' });
			});
		});
		
	
	router.route('/typeCategories/:type_cat_id')
	
		// Update one type category by ID
		.put(function(req, res) {	
			
			if(!req.params.type_cat_id) return res.status(403).json({ success : false, message : 'Param type category id missing' });	
			
			TypeCategoryModel.findById(req.params.type_cat_id, function(err, typeCategory) {
				if(err) return res.json({ success : false, message : 'Type category not found' });

				if(!req.body.type) typeCategory = req.body.type;
				
				typeCategory.save(function(err) {
					if(err) return res.json({ success : false, message : 'Update failed' });
					res.json({ success : true, message : 'Update success' });
				});
			});
		})
	
		// Delete one type category by ID
		.delete(function(req, res) {
			
			if(!req.params.type_cat_id) return res.status(403).json({ success : false, message : 'Param type category id missing' });
			
			TypeCategoryModel.remove({ _id : req.params.type_cat_id }, function(err) {
				if(err) return res.json({ success : false, message : 'Remode failed' });
				res.json({ success : true, message : 'Remove success' });
			});
		});
};