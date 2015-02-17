var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TypeCategoryModel = require('/TypeCategoryModel');

// Schema
var schema = new Schema({
	name 			: { type : String,
						required : true },
	typeCategory	: { type : TypeCategoryModel,
						required : true },
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

// Return
module.exports = mongoose.model('category', schema);