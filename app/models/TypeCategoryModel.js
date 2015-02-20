// Inject application
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var TypeCategorySchema = new Schema({
	type 			: { type : String, 
						index : { unique : true } },
    created_at 		: Date,
    updated_at 		: Date
});

//Previous function
TypeCategorySchema.pre('save', function(next) {
	
	var currentDate = new Date();
	
	this.updated_at = currentDate;
	
	if(!this.created_at) {
		this.created_at = currentDate;
	}
	
	return next();
});

// Return
module.exports = mongoose.model('TypeCategory', TypeCategorySchema);