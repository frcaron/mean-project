// Inject models
var TransactionModel = require(global.__model + '/TransactionModel');

//Inject services
var responseService = require(global.__service + '/ResponseService');
var categoryService = require(global.__service + '/CategoryService');

module.exports = {
		
	// =========================================================================================
	// Public ==================================================================================
	// =========================================================================================
	
	// Create one transaction
	create : function(req, res) {
		
		var programService = require(global.__service + '/ProgramService');
		
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
			return res.json(responseService.fail('Add failed', err.message));
		}
			
		// Query save
		transaction.save(function(err) {
			if(err) {
				return res.json(responseService.fail('Add failed', err.message));
			}

			try {
				programService.addChildTransaction(transaction._program, transaction);
			} catch(err) {
				return res.json(responseService.fail('Add failed', err.message));
			}
			
			return res.json(responseService.success('Add success', transaction._id));
		});
	},
	
	// Update one transaction
	update : function(req, res) {
		
		var programService = require(global.__service + '/ProgramService');

		// Query find transaction by id and user
		TransactionModel
			.findOne({ _id : req.params.transaction_id, _user : req.decoded.id })
			.populate('_program', 'category')
			.exec(function(err, transaction) {
			
				if(err) {
					return res.json(responseService.fail('Update failed', 'Find transaction failed / ' + err.message));
				}

				if(!transaction) {
					
					// Transaction not exist
					return res.json(responseService.fail('Update failed', 'Transaction not found'));					
				
				} else if(transaction){
					
					var last_transaction = transaction;
					
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
					if(!req.body.category_id.equals(transaction._program.category) || 
							!req.body.date.equals(transaction.date)) {
							
						try {
							categoryService.isExist(req.body.category_id);
							transaction._program = transaction.findOrGenerateProgram(transaction.date, req.body.category_id);
						} catch(err) {
							return res.json(responseService.fail('Update failed', err.message));	
						}
					}
					
					try {
						programService.removeChildTransaction(last_transaction._program, last_transaction);
						programService.addChildTransaction(transaction._program, transaction);
					} catch(err) {
						return res.json(responseService.fail('Update failed', err.message));	
					}
					
					// Query save
					transaction.save(function(err) {
						if(err) {
							return res.json(responseService.fail('Update failed', err.message));	
						}
						return res.json(responseService.success('Update success'));
					});
				}
			});
	},
	
	// Remove one transaction
	remove : function(req, res) {

		var programService = require(global.__service + '/ProgramService');

		// Query remove
		TransactionModel.findOneAndRemove({ _id : req.params.transaction_id, _user : req.decoded.id }, function(err, transaction) {
			if(err) {
				return res.json(responseService.fail('Remove failed', err.message));	
			}
			
			if(!transaction) {
				return res.json(responseService.fail('Remove failed', 'Transaction not found'));
			} else if(transaction) {
				
				try {
					programService.removeChildTransaction(transaction._plan, transaction);
				} catch(err) {
					return res.json(responseService.fail('Remove failed', err.message));
				}

				return res.json(responseService.success('Remove success'));
			}
		});
	},
	
	// Get transactions by type category
	allByTypeCategoryU : function(req, res) {

		// Query find transactions by user and type category
		TransactionModel.find({ _user : req.decoded.id })
			.populate('_program', 'category')
			.populate('_program.category', 'type')
			.where('_program.category.type').equals(req.params.type_category_id)
			.exec(function(err, transactions) {
				if(err) {
					return res.json(responseService.fail('Find failed', err.message));	
				}
				return res.json(responseService.success('Find success', transactions));
			});
	},
	
	// Get transactions by program
	allByProgramU : function(req, res) {

		// Query find transactions by user and type category
		TransactionModel.find({ _user : req.decoded.id, _program : req.params.program_id }, function(err, transactions) {
				if(err) {
					return res.json(responseService.fail('Find failed', err.message));
				}
				return res.json(responseService.success('Find success', transactions));
			});
	},
	
	// Get one transaction by id
	getByIdU : function(req, res) {

		// Query find transaction by id and user
		TransactionModel.findOne({ _id : req.params.transaction_id, _user : req.decoded.id }, function(err, transaction) {
			if(err) {
				return res.json(responseService.fail('Find failed', err.message));
			}
			return res.json(responseService.success('Find success', transaction));
		});
	},
	
	// =========================================================================================
	// Private =================================================================================
	// =========================================================================================
	
	removeByProgram : function(program_id, user_id) {
		
		// Query remove
		TransactionModel.remove({ _program : program_id, _user : user_id }, function(err){
			if(err) {
				throw new Error('Remove failed', err.message);
			}
		});
	}
};