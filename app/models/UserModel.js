var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// Schema
var UserSchema = new Schema({
	name 			: String,
	username 		: { type : String, 
						required : true, 
						index : { unique : true }},
    password 		: { type : String, 
	    				required : true, 
	    				select : false},
	admin			: { type : Boolean, 
						default : false },
	plans			: [ { type : Schema.Types.ObjectId, 
						ref : 'Plan' } ],
    created_at 		: Date,
    updated_at 		: Date
});

var UserModel = mongoose.model('User', UserSchema);

// Previous function
UserSchema.pre('save', function(next) {
	
	var user = this;
	var currentDate = new Date();
	
	this.updated_at = currentDate;
	
	if(!this.created_at) {
		this.created_at = currentDate;
	}

	if(!user.isModified('password')) {
		return next();
	}
	
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if(err) {
			return next();
		}
		
		user.password = hash;
		return next();
	});
});

UserSchema.methods.comparePassword = function(password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
};

// Return
module.exports = UserModel;