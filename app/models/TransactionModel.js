var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var TransactionSchema = new Schema({
	date			: { type : Date,
						required : true	},
	sum 			: { type : Number,
						required : true },
	comment 		: String,
	_user			: { type : Schema.Types.ObjectId,
						ref : 'User' },
    created_at 		: Date,
    updated_at 		: Date
});

// Previous function
TransactionSchema.pre('save', function(next) {
	
	var currentDate = new Date();
	
	this.updated_at = currentDate;
	
	if(!this.created_at) {
		this.created_at = currentDate;
	}
	
	next();
});

// Return
module.exports = mongoose.model('Transaction', TransactionSchema);