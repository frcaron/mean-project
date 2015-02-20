// Inject models
var CategoryModel = require(global.__model + '/CategoryModel');

//Inject services
var responseService = require(global.__service + '/ResponseService');
var typeCategoryService = require(global.__service + '/TypeCategoryService');

module.exports = {
		
	// =========================================================================================
	// Public ==================================================================================
	// =========================================================================================
	
	// Create one category
	create : function(req, res) {
		
		var category = new CategoryModel();
		
		// Build object
		category.name = req.body.name;
		category.type = req.body.type_category_id;
		category._user = req.decoded.id;
		
		// Query save
		category.save(function(err) {
			if(err) {
				return res.json(responseService.fail('Add failed', err.message));
			}
			return res.json(responseService.success('Add success', category._id));
		});
	},
	
	// Update one category
	update : function(req, res) {

		// Query find category by id and user
		CategoryModel.findOne({ _id : req.params.category_id, _user : req.decoded.id}, function(err, category) {
			if(err) {
				return res.json(responseService.fail('Update failed', 'Find category failed  / ' + err.message));
			}

			if(!category) {
				
				// Category not exist
				return res.json(responseService.fail('Update failed', 'Category not found'));
				
			} else if(category) {
				
				// Build object
				if(req.body.name) {
					category.name = req.body.name;
				}
				if(req.body.type_category_id) {

					try {
						typeCategoryService.isExist(req.body.type_category_id);
					} catch(err) {
						return res.json(responseService.fail('Update failed', err.message));
					}
					
					category.type = req.body.type_category_id;
				}
				
				// Query save
				category.save(function(err) {
					if(err) {
						return res.json(responseService.fail('Update failed', err.message));
					}
					return res.json(responseService.success('Update success'));
				});
			}
		});
	},
	
	// Remove one category
	remove : function(req, res) {
		
		// Query remove
		CategoryModel.remove({ _id : req.params.category_id, _user : req.decoded.id}, function(err) {
			if(err) {
				return res.json(responseService.fail('Remove failed', err.message));
			}
			return res.json(responseService.success('Remove success'));
		});
	},
	
	// Get categories by user
	allByU : function(req, res) {

		// Query find categories by user
		CategoryModel.find({ _user : req.decoded.id }, function(err, categories) {
				if(err) {
					return res.json(responseService.fail('Find failed', err.message));
				}
				return res.json(responseService.success('Find success', categories));
			});
	},
	
	// Get categories by type category
	allByTypeCategoryU : function(req, res) {

		// Query find categories by id and type category
		CategoryModel.find({ _user : req.decoded.id, type : req.params.type_category_id }, function(err, categories) {
				if(err) {
					return res.json(responseService.fail('Find failed', err.message));
				}
				return res.json(responseService.success('Find success', categories));
			});
	},
	
	// Get one category by id
	getByIdU : function(req, res) {

		// Query find category by id and user
		CategoryModel.findOne({ _id : req.params.category_id, _user : req.decoded.id}, function(err, category) {
			if(err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', category));
		});
	},
	
	// =========================================================================================
	// Private =================================================================================
	// =========================================================================================
	
	// Test category existing
	isExist : function(category_id) {
		
		CategoryModel.findById(category_id, '_id', function(err, category) {
			if(err) {
				throw new Error('Find category failed');
			}
			if(!category) {
				throw new Error('Category id invalid');
			}
		});
	},

	// Add link program
	addParentProgram : function(id_parent, parent) {

		CategoryModel.findOne({ _id : id_parent, _user : parent._user }, function(err, category) {
				if(err) {
					throw err;
				}
				
				if(!category) {
					throw new Error('Category not found');
				} else if(category) {
					category._programs.push(parent);
					category.save(function(err){
						if(err) {
							throw err;
						}
					});
				}
		});
	},
	
	// Remove link program
	removeParentProgram : function(id_parent, parent) {

		CategoryModel.findOne({ _id : id_parent, _user : parent._user }, function(err, category) {
				if(err) {
					throw err;
				}
				
				if(!category) {
					throw new Error('Category not found');
				} else if(category) {
					category._programs.pull(parent);
					category.save(function(err){
						if(err) {
							throw err;
						}
					});
				}
		});
	},
};