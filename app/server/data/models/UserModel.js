"use strict";

// Inject
var BPromise   = require('bluebird');
var Mongoose   = BPromise.promisifyAll(require('mongoose'));
var Bcrypt     = require('bcrypt-nodejs');
var DatePlugin = require(global.__plugin + '/DatePlugin');

var Schema     = Mongoose.Schema;

// Schema
var UserSchema = new Schema({
	_id       : Number,
	surname   : {
		type     : String
	},
	firstname : {
		type     : String
	},
	admin     : {
		type     : Boolean,
		default  : false
	},
	local     : {
        email    : String,
        password : {
			type     : String,
			select   : false
		},
    },
	facebook  : {
        id       : String,
        token    : String,
        email    : String,
        name     : String
    },
});

// Plugin
UserSchema.plugin(DatePlugin);

// Static methods
UserSchema.methods.comparePassword = function (password) {
	return Bcrypt.compareSync(password, this.local.password);
};

// Index
UserSchema.index({
	'local.email' : 1
}, {
	unique : true,
	sparse : true
});

UserSchema.index({
	'facebook.id' : 1
}, {
	unique : true,
	sparse : true
});

// MiddleWare
UserSchema.pre('save', function (next) {

	var user = this;
	if (!user.isModified('local.password')) {
		return next();
	}

	Bcrypt.hash(user.local.password, Bcrypt.genSaltSync(8), null, function (err, hash) {
		if (err) {
			return next(err);
		}
		user.local.password = hash;
		return next();
	});
});

// Return
module.exports = Mongoose.model('User', UserSchema);