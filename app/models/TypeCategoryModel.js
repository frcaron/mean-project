// Inject application
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

// Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');

// Inject models
var CountersModel = require(global.__model + '/CountersModel');

// Schema
var TypeCategorySchema = new Schema({
	id     : Number,
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
TypeCategorySchema.plugin(datePlugin);

// Index
TypeCategorySchema.index({
	type   : 1
}, {
	unique : true
});

// MiddleWare
TypeCategorySchema.pre('save', function(next) {
	this._id = CountersModel.getNextSequence('type_category_id');
	return next();
});

// Return
module.exports = mongoose.model('TypeCategory', TypeCategorySchema);