var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var CategorySchema = new Schema({
	name 			: { type : String,
						required : true },
	type			: { type : Schema.Types.ObjectId,
						ref : 'TypeCategory',
						required : true },
	_programs		: [ { type : Schema.Types.ObjectId, 
						ref : 'Program' } ],
	_user			: { type : Schema.Types.ObjectId,
						ref : 'User',
						required : true },
    created_at 		: Date,
    updated_at 		: Date
});

var CategoryModel = mongoose.model('Category', CategorySchema);

// Previous function
CategorySchema.pre('save', function(next) {
	
	var currentDate = new Date();
	
	this.updated_at = currentDate;
	
	if(!this.created_at) {
		this.created_at = currentDate;
	}
	
	return next();
});

// Return
module.exports = CategoryModel;
