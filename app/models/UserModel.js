var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var schema = new Schema({
	name 		: String,
	username 	: { type : String, 
					required : true, 
					index : { unique : true }},
    password 	: { type : String, 
    				required : true, 
    				select : false},
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
module.exports = mongoose.model('user', schema);