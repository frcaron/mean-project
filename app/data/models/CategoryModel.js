// Inject application
var Promise = require('bluebird');
var Mongoose = Promise.promisifyAll(require('mongoose'));
var Schema = Mongoose.Schema;

// Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');
var userPlugin = require(global.__plugin + '/UserPlugin');

// Inject models
var CountersModel = require(global.__model + '/CountersModel');

// Schema
var CategorySchema = new Schema({
	_id       : Number,
	name      : {
		type     : String,
		required : true
	},
	_type      : {
		type     : Schema.Types.ObjectId,
		ref      : 'TypeCategory',
		required : true
	},
	active    : {
		type    : Boolean,
		default : true
	}
});

// Plugin
CategorySchema.plugin(datePlugin);
CategorySchema.plugin(userPlugin);

// Index
CategorySchema.index({
	name   : 1,
	_type  : 1,
	_user  : 1,
	active : 1
}, {
	unique : true
});

// MiddleWare
CategorySchema.pre('save', function(next) {
	if(this._id) {
		this._id = CountersModel.getNextSequence('category_id');
	}
	return next();
});

// Return
module.exports = Mongoose.model('Category', CategorySchema);