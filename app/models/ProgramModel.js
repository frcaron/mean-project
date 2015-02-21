// Inject application
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var ProgramSchema = new Schema({
	category		: { type : Schema.Types.ObjectId,
						ref : 'Category',
						required : true },
	sum				: Number,
	transactions	: [ { type : Schema.Types.ObjectId, 
						ref : 'Transaction' } ],
	_plan			: { type : Schema.Types.ObjectId,
						ref : 'Plan' },		
	_user			: { type : Schema.Types.ObjectId,
						ref : 'User',
						required : true },
    created_at 		: Date,
    updated_at 		: Date
});

// Previous function
ProgramSchema.pre('save', function(next) {
	
	var currentDate = new Date();
	
	this.updated_at = currentDate;
	
	if(!this.created_at) {
		this.created_at = currentDate;
	}

	ProgramModel.findOne({ category : this.category, _plan : this._plan }, '_id', function(err, program) {
		if(err || program) {
			return next(new Error('The pair category/plan already exist'));
		} 
		return next();
	});
});

var ProgramModel = mongoose.model('Program', ProgramSchema);

// Return
module.exports = ProgramModel;