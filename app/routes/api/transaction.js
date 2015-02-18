var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var UserModel = require('../../models/UserModel');
var LinkUserPlansModel = require('../../models/LinkUserPlansModel');
var TransactionModel = require('../../models/TransactionModel');

module.exports = function(router) {
	
	router.route('/transactions/all/:type_category_id')
		
		.get(function(req, res) {
			
			var user_token = undefined;
			
			UserModel.findOne({ token : user_token }, function(err, user) {
				if(err) return res.send(err);
				LinkUserPlansModel.findOne({ user_id : user._id }, function(err, link) {
					if(err) return res.send(err);
				});
			});
		});
		
	
	router.route('/transactions/:transaction_id')
	
		.get(function(req, res) {			
			TransactionModel.findById(req.params.transaction_id, function(err, transaction) {
				if(err) return res.send(err);
				res.json(transaction);
			});
		})
		
		.put(function(req, res) {
			TransactionModel.findById(req.params.transaction_id, function(err, transaction) {
				if(err) return res.send(err);

				if(req.body.date) {
					transaction.date = req.body.date;
				}
				if(req.body.sum) {
					transaction.sum = req.body.sum;
				}
				if(req.body.comment) {
					transaction.comment = req.body.comment;
				}
				
				transaction.save(function(err) {
					if(err) return res.send(err);
					res.json({ success : true, message : 'Update success' });
				});
			});
		})
		
		.delete(function(req, res) {
			TransactionModel.remove({ _id : req.params.transaction_id }, function(err) {
				if(err) return res.send(err);
				res.json({ success : true, message : 'Remove success' });
			});
		});
};