var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var schema = new Schema({
	date		: { type : Date,
					required : true	},
	sum 		: { type : Number,
					required : true },
	comment 	: String,
    created_at 	: Date,
    updated_at 	: Date
});

// Previous function
schema.pre('save', function(next) {
	
	var currentDate = new Date();
	
	this.updated_at = currentDate;
	
	if(!this.created_at) {
		this.created_at = currentDate;
	}
	
	next();
});

// Return
module.exports = mongoose.model('transaction', schema);