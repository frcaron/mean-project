// Inject application
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var DatePlugin = require(global.__plugin + '/DatePlugin');

// Schema
var TypeCategorySchema = new Schema({
	_id     : Number,
	type   : {
		type     : String,
		required : true
	},
	active : {
		type    : Boolean,
		default : true
	}
});

// Plugin
TypeCategorySchema.plugin(DatePlugin);

// Index
TypeCategorySchema.index({
	type   : 1
}, {
	unique : true
});

// Return
module.exports = mongoose.model('TypeCategory', TypeCategorySchema);