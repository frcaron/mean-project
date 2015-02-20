// Inject models
var TypeCategoryModel = require(global.__model + '/TypeCategoryModel');

//Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {
	
	// Create one type category
	create : function(req, res) {
		
		var typeCategory = new TypeCategoryModel();
		
		// Build object
		typeCategory.type = req.body.type;
		
		// Query save
		typeCategory.save(function(err) {
			if(err) {
				return res.json(responseService.fail('Add failed', err.message));
			}
			return res.json(responseService.success('Add success', typeCategory._id));
		});
	},
	
	// Update one type category
	update : function(req, res) {
		
		// Query find type category by id
		TypeCategoryModel.findById(req.params.type_category_id, function(err, typeCategory) {
			if(err) {
				return res.json(responseService.fail('Update failed', 'Find type category failed / ' + err.message));
			}

			if(!typeCategory) {
				
				// Type category not exist
				return res.json(responseService.fail('Update failed', 'Type category not found'));
				
			} else if(typeCategory) {
				
				// Build object
				if(req.body.type) {
					typeCategory.type = req.body.type;
				}
				
				// Query save
				typeCategory.save(function(err) {
					if(err) {
						return res.json(responseService.fail('Update failed', err.message));
					}
					return res.json(responseService.success('Update success'));
				});
			}
		});		
	},
	
	// Remove one type category
	remove : function(req, res) {
		
		// Query remove
		TypeCategoryModel.remove({ _id : req.params.type_category_id }, function(err) {
			if(err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
			return res.json(responseService.success('Remove success'));
		});
	},
	
	// Get all type category
	getAllByU : function(req, res) {
		
		// Query find categories
		var test = TypeCategoryModel.find(function(err, typeCategories) {
			if(err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', typeCategories));
		});		
	},
	
	// Get one type category by id
	getOneByIdU : function(req, res) {
		
		// Query find category by id
		TypeCategoryModel.findById(req.params.type_category_id, function(err, typeCategory) {
			if(err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', typeCategory));
		});		
	},
	
	// Test type category existing
	isExist : function(type_category_id) {

		TypeCategoryModel.findById(type_category_id, '_id', function(err, typeCategory) {
			if(err) {
				throw new Error('Find type category failed');
			}
			if(!typeCategory) {
				throw new Error('Type category id invalid');
			}
		});	
	}
};