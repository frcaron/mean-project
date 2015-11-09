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
var ProgramSchema = new Schema({
	id           :  Number,
	_category     : {
		type     : Schema.Types.ObjectId,
		ref      : 'Category',
		required : true
	},
	budget       : Number,
	_plan        : {
		type     : Schema.Types.ObjectId,
		ref      : 'Plan',
		required : true
	}
});

// Plugin
ProgramSchema.plugin(datePlugin);
ProgramSchema.plugin(userPlugin);

// Index
ProgramSchema.index({
	_category : 1,
	_plan    : 1,
	_user    : 1
}, {
	unique : true
});

// MiddleWare
ProgramSchema.pre('save', function(next) {
	if(this._id) {
		this._id = CountersModel.getNextSequence('program_id');
	}
	return next();
});

// Return
module.exports = mongoose.model('Program', ProgramSchema);