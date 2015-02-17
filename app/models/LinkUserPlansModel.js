var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// Schema
var schema = new Schema({
	user_id		: { type : ObjectId,
					required : true,
					index : { unique : true }},
    plans_id	: { type : [ ObjectId ],
    				required : true },
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
module.exports = mongoose.model('linkuserplans', schema);