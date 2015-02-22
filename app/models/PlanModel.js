// Inject application
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');
var userPlugin = require(global.__plugin + '/UserPlugin');

// Schema
var PlanSchema = new Schema({
	month 			: { type : Number,
						required : true,
						min : [ 1, 'The value of month ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
						max : [ 12, 'The value of month ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ] },
	year			: { type : Number,
						required : true,
						min : [ 1900, 'The value of year ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
						max : [ 2100, 'The value of year ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ] },
	programs		: [ { type : Schema.Types.ObjectId, 
						ref : 'Program' } ],
	programUnknow	: { type : Schema.Types.ObjectId, 
						ref : 'Program' }
});

PlanSchema.plugin(datePlugin);
PlanSchema.plugin(userPlugin);

PlanSchema.index({ month : 1, year : 1, _user : 1 } , { unique : true });

// Return
module.exports = mongoose.model('Plan', PlanSchema);