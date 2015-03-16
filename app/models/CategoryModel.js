// Inject application
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');
var userPlugin = require(global.__plugin + '/UserPlugin');

// Schema
var CategorySchema = new Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: Schema.Types.ObjectId,
		ref: 'TypeCategory',
		required: true
	},
	active: {
		type: Boolean,
		default: true
	},
	_programs: [{
		type: Schema.Types.ObjectId,
		ref: 'Program'
	}]
});

CategorySchema.plugin(datePlugin);
CategorySchema.plugin(userPlugin);

// Return
module.exports = mongoose.model('Category', CategorySchema);