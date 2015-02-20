var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var ProgramSchema = new Schema({
	_category		: { type : Schema.Types.ObjectId,
						ref : 'Category',
						required : true },
	sum				: Number,
	_plan			: { type : Schema.Types.ObjectId,
						ref : 'Plan',
						required : true },		
	_user			: { type : Schema.Types.ObjectId,
						ref : 'User',
						required : true },
    created_at 		: Date,
    updated_at 		: Date
});

var ProgramModel = mongoose.model('Program', ProgramSchema);

// Previous function
ProgramSchema.pre('save', function(next) {
	
	var currentDate = new Date();
	
	this.updated_at = currentDate;
	
	if(!this.created_at) {
		this.created_at = currentDate;
	}

	ProgramModel.findOne({ _category : this._category, _plan : this._plan }, '_id', function(err, program) {
		if(err || program) {
			return next(new Error('The pair category/plan already exist'));
		} 
		return next();
	});
});

// Return
module.exports = ProgramModel;