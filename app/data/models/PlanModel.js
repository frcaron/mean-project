// Inject
var Promise    = require('bluebird');
var Mongoose   = Promise.promisifyAll(require('mongoose'));
var Schema     = Mongoose.Schema;
var DatePlugin = require(global.__plugin + '/DatePlugin');
var UserPlugin = require(global.__plugin + '/UserPlugin');

// Schema
var PlanSchema = new Schema({
	_id   : Number,
	month : {
		type     : Number,
		required : true,
		min      : [ 1, 'The value of month ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
		max      : [ 12, 'The value of month ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ]
	},
	year  : {
		type     : Number,
		required : true,
		min      : [ 1900, 'The value of year ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
		max      : [ 2100, 'The value of year ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ]
	}
});

// Plugin
PlanSchema.plugin(DatePlugin);
PlanSchema.plugin(UserPlugin);

// Index
PlanSchema.index({
	month : 1,
	year  : 1,
	_user : 1
}, {
	unique : true
});

// Return
module.exports = Mongoose.model('Plan', PlanSchema);