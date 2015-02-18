var mongoose = require('mongoose');

var ProgramModel = require('../../models/ProgramModel');
var TransactionModel = require('../../models/TransactionModel');

module.exports = function(router) {
	
	router.route('/transactions')
		
		// Create one transaction
		.post(function(req, res) {
			
			var decoded = req.decoded;
			if(!decoded) return res.json({ success : false, message : 'Error token' });

			var transaction = new TransactionModel();
			
			if(!req.body.date) return res.status(403).json({ success : false, message : 'Param date missing' });
			if(!req.body.sum) return res.status(403).json({ success : false, message : 'Param sum missing' });
			
			transaction.date = req.body.date;
			transaction.sum = req.body.sum;
			if(req.body.comment) transaction.comment = req.body.comment;
			transaction._user = decoded.id;
			
			transaction.save(function(err) {
				if(err) return res.json({ success : false, message : 'Add failed' });
				res.json({ success : true, message : 'Add success' });
			});
		});
		
	
	router.route('/transactions/:transaction_id')
	
		// Get one transaction
		.get(function(req, res) {
			
			var decoded = req.decoded;
			if(!decoded) return res.json({ success : false, message : 'Error token' });
			
			if(!req.params.transaction_id) return res.status(403).json({ success : false, message : 'Param transaction id missing' });
			
			TransactionModel.find({ _id : req.params.transaction_id, _user : decoded.id }, function(err, transaction) {
				if(err) return res.json({ success : false, message : 'Transaction not found' });
				res.json(transaction);
			});
		})
		
		// Update one transaction
		.put(function(req, res) {
			
			var decoded = req.decoded;
			if(!decoded) return res.json({ success : false, message : 'Error token' });
			
			if(!req.params.transaction_id) return res.status(403).json({ success : false, message : 'Param transaction id missing' });
			
			TransactionModel.find({ _id : req.params.transaction_id, _user : decoded.id }, function(err, transaction) {
				if(err) return res.json({ success : false, message : 'Transaction not found' });

				if(req.body.date) transaction.date = req.body.date;
				if(req.body.sum) transaction.sum = req.body.sum;
				if(req.body.comment) transaction.comment = req.body.comment;
				
				transaction.save(function(err) {
					if(err) return res.json({ success : false, message : 'Update failed' });
					res.json({ success : true, message : 'Update success' });
				});
			});
		})
		
		// Delete one transaction
		.delete(function(req, res) {
			
			var decoded = req.decoded;
			if(!decoded) return res.json({ success : false, message : 'Error token' });
			
			if(!req.params.transaction_id) return res.status(403).json({ success : false, message : 'Param transaction id missing' });
			
			TransactionModel.remove({ _id : req.params.transaction_id, _user : decoded.id }, function(err) {
				if(err) return res.json({ success : false, message : 'Remode failed' });
				res.json({ success : true, message : 'Remove success' });
			});
		});
	
	router.route('/transactions/type/:type_cat_id')
		
		// Get all transactions user by type category
		.get(function(req, res) {
			
			var decoded = req.decoded;
			if(!decoded) return res.json({ success : false, message : 'Error token' });
			
			if(!req.params.type_cat_id) return res.status(403).json({ success : false, message : 'Param type category id missing' });	
			
			ProgramModel.find({ _user : decoded.id })
				.populate('_category', '_type')
				.populate('_transactions')
				.where('_category._type').equals(req.params.type_cat_id)
				.exec(function(err, programs) {
					if(err) return res.json({ success : false, message : 'Transaction not found' });
					
					// TODO build json
					console.log(programs);
				});
		});
};