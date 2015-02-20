var mongoose = require('mongoose');

var TransactionModel = require('../../models/TransactionModel');
var CategoryModel = require('../../models/CategoryModel');

var api_prefix = '/transactions'; 

module.exports = function(router) {
	
	router.route(api_prefix)
		
		// Create one transaction
		.post(function(req, res) {
			
			// Validation
			if(!req.body.date) {
				return res.json({ success : false, message : 'Param date missing' });
			}
			if(!req.body.sum) {
				return res.json({ success : false, message : 'Param sum missing' });
			}
			if(!req.body.category_id) {
				return res.json({ success : false, message : 'Param category missing' });
			} else {
				try {
					CategoryModel.findById(req.body.category_id, '_id', function(err, category) {
						if(err || !category) {
							throw err;
						}
					});
				} catch(err) {
					return res.json({ success : false, message : 'Category id invalid' });
				}
			}

			var transaction = new TransactionModel();
			
			// Build object
			transaction.day = req.body.date;
			transaction.sum = req.body.sum;
			if(req.body.comment) {
				transaction.comment = req.body.comment;
			}
			transaction._user = req.decoded.id;
			try {
				transaction._program = transaction.findOrGenerateProgram(req.body.date, req.body.category_id);	
			} catch(err) {
				return res.json({ success : false, message : 'findOrGenerateProgram error' });
			}
				
			// Query save
			transaction.save(function(err) {
				if(err) {
					return res.json({ success : false, message : 'Add failed' });
				}
				
				return res.json({ success : true, message : 'Add success', result : transaction._id });
			});
		});
		
	
	router.route(api_prefix + '/:transaction_id')
	
		// Get one transaction
		.get(function(req, res) {
			
			// Query find transaction by id and user
			TransactionModel.findOne({ _id : req.params.transaction_id, _user : req.decoded.id }, function(err, transaction) {
				if(err) {
					return res.json({ success : false, message : 'Transaction not found' });
				}
				
				return res.json({ success : true, result : transaction });
			});
		})
		
		// Update one transaction
		.put(function(req, res) {
			
			// Validation
			if(!req.body.date) {
				return res.json({ success : false, message : 'Param date missing' });
			}
			if(!req.body.category_id) {
				return res.json({ success : false, message : 'Param category missing' });
			}
			
			// Query find transaction by id and user
			TransactionModel
				.findOne({ _id : req.params.transaction_id, _user : req.decoded.id })
				.populate('_program', '_category')
				.exec(function(err, transaction) {
				
					if(err) {
						return res.json({ success : false, message : 'Transaction not found' });
					}
	
					// Build object
					if(!req.body.date.equals(transaction.date)) {
						transaction.date = req.body.date;
					}
					if(req.body.sum) {
						transaction.sum = req.body.sum;
					}
					if(req.body.comment) {
						transaction.comment = req.body.comment;
					}
					if(!req.body.category_id.equals(transaction._program._category) || 
							!req.body.date.equals(transaction.date)) {
							
						try {
							CategoryModel.findById(req.body.category_id, '_id', function(err, category) {
								if(err || !category) {
									throw err;
								}
							});
						} catch(err) {
							return res.json({ success : false, message : 'Category id invalid' });
						}
						
						try {
							transaction._program = transaction.findOrGenerateProgram(transaction.date, req.body.category_id);	
						} catch(err) {
							return res.json({ success : false, message : 'findOrGenerateProgram error' });
						}
					}
					
					// Query save
					transaction.save(function(err) {
						if(err) {
							return res.json({ success : false, message : 'Update failed' });
						}
						
						return res.json({ success : true, message : 'Update success' });
					});
				});
		})
		
		// Delete one transaction
		.delete(function(req, res) {
			
			// Query remove
			TransactionModel.remove({ _id : req.params.transaction_id, _user : req.decoded.id }, function(err) {
				if(err) {
					return res.json({ success : false, message : 'Remode failed' });
				}
				
				return res.json({ success : true, message : 'Remove success' });
			});
		});
	
	router.route(api_prefix + '/type/:type_category_id')
		
		// Get all transactions user by type category id
		.get(function(req, res) {
			
			// Query find transactions by user and type category
			TransactionModel.find({ _user : req.decoded.id })
				.populate('_program', '_category')
				.populate('_program._category', '_type')
				.where('_program._category._type').equals(req.params.type_category_id)
				.exec(function(err, transactions) {
					if(err) {
						return res.json({ success : false, message : 'Transaction not found' });
					}
					return res.json({ success : true, result : transactions });
				});
		});
	
	router.route(api_prefix + '/program/:program_id')
		
		// Get all transactions user by program id
		.get(function(req, res) {
			
			// Query find transactions by user and type category
			TransactionModel.find({ _user : req.decoded.id, _program : req.params.program_id }, function(err, transactions) {
					if(err) {
						return res.json({ success : false, message : 'Transaction not found' });
					}
					return res.json({ success : true, result : transactions });
				});
		});
};