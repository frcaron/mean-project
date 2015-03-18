// Inject application
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');

// Schema
var UserSchema = new Schema({
	name     : String,
	username : {
		type     : String,
		required : true,
		index    : {
			unique : true
		}
	},
	password : {
		type     : String,
		required : true,
		select   : false
	},
	admin    : {
		type    : Boolean,
		default : false
	},
	plans    : [ {
		type : Schema.Types.ObjectId,
		ref  : 'Plan'
	} ]
});

UserSchema.plugin(datePlugin);

UserSchema.methods.comparePassword = function (password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
};

// Previous function
UserSchema.pre('save', function (next) {

	var user = this;

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.hash(user.password, null, null, function (err, hash) {
		if (err) {
			return next();
		}

		user.password = hash;
		return next();
	});
});

// Return
module.exports = mongoose.model('User', UserSchema);