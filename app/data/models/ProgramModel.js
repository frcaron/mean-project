// Inject
var Promise    = require('bluebird');
var Mongoose   = Promise.promisifyAll(require('mongoose'));
var Schema     = Mongoose.Schema;
var DatePlugin = require(global.__plugin + '/DatePlugin');
var UserPlugin = require(global.__plugin + '/UserPlugin');

// Schema
var ProgramSchema = new Schema({
	_id           :  Number,
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
ProgramSchema.plugin(DatePlugin);
ProgramSchema.plugin(UserPlugin);

// Index
ProgramSchema.index({
	_category : 1,
	_plan    : 1,
	_user    : 1
}, {
	unique : true
});

// Return
module.exports = Mongoose.model('Program', ProgramSchema);