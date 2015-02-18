var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var TypeCategorySchema = new Schema({
	type 		: { type : String, 
					index : { unique : true } }
});

// Return
module.exports = mongoose.model('TypeCategory', TypeCategorySchema);