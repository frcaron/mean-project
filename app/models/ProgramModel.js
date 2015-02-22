// Inject application
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');
var userPlugin = require(global.__plugin + '/UserPlugin');

// Schema
var ProgramSchema = new Schema({
	category		: { type : Schema.Types.ObjectId,
						ref : 'Category',
						required : true },
	sum				: Number,
	transactions	: [ { type : Schema.Types.ObjectId, 
						ref : 'Transaction' } ],
	_plan			: { type : Schema.Types.ObjectId,
						ref : 'Plan', 
						required : true }
});

ProgramSchema.plugin(datePlugin);
ProgramSchema.plugin(userPlugin);

ProgramSchema.index({ category : 1, _plan : 1, _user : 1 } , { unique : true });

// Return
module.exports = mongoose.model('Program', ProgramSchema);