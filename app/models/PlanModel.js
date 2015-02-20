var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var PlanSchema = new Schema({
	month 			: { type : Number,
						required : true,
						min : [ 1, 'The value of month ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
						max : [ 12, 'The value of month ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ] }, 
	year			: { type : Number,
						required : true,
						min : [ 1900, 'The value of year ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
						max : [ 2100, 'The value of year ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ] },
	programs		: [ { type : Schema.Types.ObjectId, 
						ref : 'Program' } ],
	_user			: { type : Schema.Types.ObjectId,
						ref : 'User',
						required : true },
    created_at 		: Date,
    updated_at 		: Date
});

var PlanModel = mongoose.model('Plan', PlanSchema);

// Previous function
PlanSchema.pre('save', function(next) {
	
	var currentDate = new Date();
	
	this.updated_at = currentDate;
	
	if(!this.created_at) {
		this.created_at = currentDate;
	}

	PlanModel.findOne({ month : this.month, year : this.year }, '_id', function(err, program) {
		if(err || program) {
			return next(new Error('The pair month/year already exist'));
		} 
		return next();
	});
	
	return next();
});

// Validation
PlanModel.schema.path('month').validate(function(err){
	console.log(String(err));
});

PlanModel.schema.path('year').validate(function(err){
	console.log(String(err));
});

// Return
module.exports = PlanModel;