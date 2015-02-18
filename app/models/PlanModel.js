var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var PlanSchema = new Schema({
	month 			: { type : Number,
						required : true,
						min : [ 1, 'The value of month ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
						max : [ 12, 'The value of month ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ] }, 
	date			: { type : Number,
						required : true,
						min : [ 1900, 'The value of year ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
						max : [ 2100, 'The value of year ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ] }, 
	_programs		: [ { type : Schema.Types.ObjectId, ref : 'Program' } ],
	_user			: { type : Schema.Types.ObjectId,
						ref : 'User' },
    created_at 		: Date,
    updated_at 		: Date
});

// Previous function
PlanSchema.pre('save', function(next) {
	
	var currentDate = new Date();
	
	this.updated_at = currentDate;
	
	if(!this.created_at) {
		this.created_at = currentDate;
	}
	
	next();
});

var Plan = mongoose.model('Plan', PlanSchema);

// Validation
Plan.schema.path('month').validate(function(err){
	console.log(String(err));
});

Plan.schema.path('year').validate(function(err){
	console.log(String(err));
});

// Return
module.exports = Plan;