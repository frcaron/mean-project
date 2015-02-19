var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var ProgramSchema = new Schema({
	_category		: { type : Schema.Types.ObjectId,
						ref : 'Category',
						required : true },
	sum				: Number,
	_plan			: { type : Schema.Types.ObjectId,
						ref : 'Plan',
						required : true },		
	_user			: { type : Schema.Types.ObjectId,
						ref : 'User',
						required : true },
    created_at 		: Date,
    updated_at 		: Date
});

// Previous function
ProgramSchema.pre('save', function(next) {
	
	var currentDate = new Date();
	
	this.updated_at = currentDate;
	
	if(!this.created_at) {
		this.created_at = currentDate;
	}
	
	return next();
});

// Return
module.exports = mongoose.model('Program', ProgramSchema);