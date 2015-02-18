var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var CategorySchema = new Schema({
	name 			: { type : String,
						required : true },
	_type			: { type : Schema.Types.ObjectId,
						ref : 'TypeCategory',
						required : true },
    created_at 		: Date,
    updated_at 		: Date
});

// Previous function
CategorySchema.pre('save', function(next) {
	
	var currentDate = new Date();
	
	this.updated_at = currentDate;
	
	if(!this.created_at) {
		this.created_at = currentDate;
	}
	
	next();
});

// Return
module.exports = mongoose.model('Category', CategorySchema);