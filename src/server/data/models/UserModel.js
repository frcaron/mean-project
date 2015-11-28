"use strict";

// Inject
var Path       = require('path');
var BPromise   = require('bluebird');
var Bcrypt     = require('bcrypt-nodejs');
var Validator  = require('validator');
var Mongoose   = BPromise.promisifyAll(require('mongoose'));
var DatePlugin = require(Path.join(global.__plugin, 'DatePlugin'));

var Schema     = Mongoose.Schema;

// Schema
var UserSchema = new Schema({
	_id         : Number,
	firstname   : String,
	surname     : String,
	displayname : String,
	verified    : {
		type     : Boolean,
		default  : false
	},
	admin       : {
		type     : Boolean,
		default  : false
	},
	local       : {
		email    : {
			type     : String,
			validate : {
				validator : function(v) {
					return Validator.isEmail(v);
				},
			message  : '{VALUE} is not a valid email'
		    }
		},
		password : {
			type    : String,
			select  : false
		},
		active   : {
			type    : Boolean,
			default : false
		}
    },
	facebook    : {
		id    : String,
		token : String,
		email : {
			type     : String,
			validate : {
				validator : function(v) {
					return Validator.isEmail(v);
				},
			message  : '{VALUE} is not a valid email'
		    }
		}
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
	if (!user.local.password || !user.isModified('local.password')) {
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