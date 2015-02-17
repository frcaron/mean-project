var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var schema = new Schema({
	type 	: { type : String, 
				index : { unique : true } }
});

// Return
module.exports = mongoose.model('typecategory', schema);