"use strict";

// Inject 
var BPromise      = require('bluebird');
var Mongoose      = BPromise.promisifyAll(require('mongoose'));
var Bcrypt        = require('bcrypt-nodejs');
var DatePlugin    = require(global.__plugin + '/DatePlugin');

var Schema        = Mongoose.Schema;

// Schema
var UserSchema = new Schema({
	_id       : Number,
	surname   : {
		type     : String,
		required : true
	},
	firstname : {
		type     : String,
		required : true
	},
	email     : {
		type     : String,
		required : true
	},
	password  : {
		type     : String,
		required : true,
		select   : false
	},
	admin     : {
		type     : Boolean,
		default  : false
	}
});

// Plugin
UserSchema.plugin(DatePlugin);

// Index
UserSchema.index({
	email: 1
}, {
	unique: true
});

// Static methods
UserSchema.methods.comparePassword = function (password) {
	var user = this;
	return Bcrypt.compareSync(password, user.password);
};

// MiddleWare
UserSchema.pre('save', function (next) { 
	var user = this;

	if (!user.isModified('password')) {
		return next();
	}

	Bcrypt.hash(user.password, null, null, function (err, hash) {
		if (err) {
			return next(err);
		}

		user.password = hash;
		return next();
	});
});

// Return
module.exports = Mongoose.model('User', UserSchema);