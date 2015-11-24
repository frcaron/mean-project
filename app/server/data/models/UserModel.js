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
		type     : String,
		required : true
	},
	firstname : {
		type     : String,
		required : true
	},
	admin     : {
		type     : Boolean,
		default  : false
	},
	local     : {
        email    : String, // validation email
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

// Index
UserSchema.index({ // TODO
	email: 1
}, {
	unique: true
});

// Static methods
UserSchema.methods.generateHash = function(password) {
    return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8), null);
};
UserSchema.methods.comparePassword = function (password) {
	return Bcrypt.compareSync(password, this.local.password);
};

// MiddleWare
UserSchema.pre('save', function (next) {

	if (!this.isModified('local.password')) {
		return next();
	}

	Bcrypt.hash(this.local.password, Bcrypt.genSaltSync(8), null, function (err, hash) {
		if (err) {
			return next(err);
		}

		this.local.password = hash;

		return next();
	});
});

// Return
module.exports = Mongoose.model('User', UserSchema);