// Inject application
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');

// Schema
var TypeCategorySchema = new Schema({
	type   : {
		type     : String,
		required : true,
		index    : {
			unique : true
		}
	},
	active : {
		type    : Boolean,
		default : true
	}
});

TypeCategorySchema.plugin(datePlugin);

// Return
module.exports = mongoose.model('TypeCategory', TypeCategorySchema);