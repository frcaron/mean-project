// Inject application
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

// Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');
var userPlugin = require(global.__plugin + '/UserPlugin');

// Inject models
var CountersModel = require(global.__model + '/CountersModel');

// Schema
var PlanSchema = new Schema({
	id            : Number,
	month         : {
		type     : Number,
		required : true,
		min      : [ 1, 'The value of month ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
		max      : [ 12, 'The value of month ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ]
	},
	year          : {
		type     : Number,
		required : true,
		min      : [ 1900, 'The value of year ‘{PATH}‘ ({VALUE} is beneath the limit {MIN})' ],
		max      : [ 2100, 'The value of year ‘{PATH}‘ ({VALUE} is above the limit {MAX})' ]
	}
});

// Plugin
PlanSchema.plugin(datePlugin);
PlanSchema.plugin(userPlugin);

// Index
PlanSchema.index({
	month : 1,
	year  : 1,
	_user : 1
}, {
	unique : true
});

// MiddleWare
PlanSchema.pre('save', function(next) {
	if(this._id) {
		this._id = CountersModel.getNextSequence('plan_id');
	}
	return next();
});

// Return
module.exports = mongoose.model('Plan', PlanSchema);