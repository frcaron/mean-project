"use strict";

// Inject
var path       = require('path');
var BPromise   = require('bluebird');
var bcrypt     = require('bcrypt-nodejs');
var validator  = require('validator');
var mongoose   = BPromise.promisifyAll(require('mongoose'));
var datePlugin = require(path.join(global.__plugin, 'date'));
var config     = require(path.join(global.__core, 'system')).Config;

var Schema     = mongoose.Schema;
var Types      = Schema.Types;

// Schema
var UserSchema = new Schema({
	_id         : config.db.seq ? Number : Types.ObjectId,
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
					return validator.isEmail(v);
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
					return validator.isEmail(v);
				},
			message  : '{VALUE} is not a valid email'
		    }
		}
    },
});

// Plugin
UserSchema.plugin(datePlugin);

// Static methods
UserSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
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

	bcrypt.hash(user.local.password, bcrypt.genSaltSync(8), null, function (err, hash) {
		if (err) {
			return next(err);
		}
		user.local.password = hash;
		return next();
	});
});

// Return
module.exports = mongoose.model('User', UserSchema);