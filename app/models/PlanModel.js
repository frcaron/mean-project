var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// Schema
var schema = new Schema({
	month 			: { type : Number,
						required : true,
						min : [ 1, 'The value of month ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
						max : [ 12, 'The value of month ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ] }, 
	year			: { type : Number,
						required : true,
						min : [ 1900, 'The value of year ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
						max : [ 2100, 'The value of year ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ] }, 
	categories_id	: [ ObjectId ],
    created_at 		: Date,
    updated_at 		: Date
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

var Plan = mongoose.model('plan', schema);

// Validation
Plan.schema.path('month').validate(function(err){
	console.log(String(err));
});

Plan.schema.path('year').validate(function(err){
	console.log(String(err));
});

// Return
module.exports = Plan;