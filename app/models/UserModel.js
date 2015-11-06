// Inject application
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');

// Inject models
var CountersModel = require(global.__model + '/CountersModel');

// Schema
var UserSchema = new Schema({
	id        : Number,
	surname   : {
		type     : String,
		required : true
	},
	firstname : {
		type     : String,
		required : true
	},
	email  : {
		type     : String,
		required : true
	},
	password  : {
		type     : String,
		required : true,
		select   : false
	},
	admin     : {
		type    : Boolean,
		default : false
	}
});

// Plugin
UserSchema.plugin(datePlugin);

// Index
UserSchema.index({
	email : 1
}, {
	unique : true
});

// Static methods
UserSchema.methods.comparePassword = function (password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
};

// MiddleWare
UserSchema.pre('save', function (next) {

	var user = this;

	user._id =  CountersModel.getNextSequence('user_id');

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.hash(user.password, null, null, function (err, hash) {
		if (err) {
			return next(err);
		}

		user.password = hash;
		return next();
	});
});

// Return
module.exports = mongoose.model('User', UserSchema);