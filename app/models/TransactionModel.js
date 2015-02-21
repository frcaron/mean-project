// Inject application
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Inject models
var PlanModel = require('./PlanModel');
var ProgramModel = require('./ProgramModel');

// Schema
var TransactionSchema = new Schema({
	date			: Date,
	sum 			: { type : Number,
						required : true },
	comment 		: String,
	_program		: { type : Schema.Types.ObjectId,
						ref : 'Program' },
	_user			: { type : Schema.Types.ObjectId,
						ref : 'User',
						required : true },
    created_at 		: Date,
    updated_at 		: Date
});

// Previous function
TransactionSchema.pre('save', function(next) {

	var transaction = this;
	var currentDate = new Date();
	
	this.updated_at = currentDate;
	
	if(!this.created_at) {
		this.created_at = currentDate;
	}
	
	return next();
});

TransactionSchema.methods.findOrGenerateProgram = function(date, category_id) {
	
	var transaction = this;
	
	var mm = date[1];
	var yy = date[2];
	
	PlanModel.find({ _user : transaction._user })
		.where('month').equals(mm)
		.where('year').equals(yy)
		.select('_id')
		.exec(function(err, plan) {
			if(err) {
				throw new Error('TransactionSchema#findOrGenerateProgram : Find plan error');
			}
			
			if(plan) {
				
				// Plan exist
				ProgramModel.find({ _user : transaction._user })
					.where('_plan').equals(plan._id)
					.where('category').equals(category_id)
					.select('_id')
					.exec(function(err, program) {
						if(err) {
							throw new Error('TransactionSchema#findOrGenerateProgram : Find program error');
						}
						
						if(program) {
							// Program exist
							return program._id;
						} 
					});
			} else {
				
				// Plan unexist for this date
				var newPlan = new PlanModel();
				
				newPlan.month =	mm;
				newPlan.year = yy;
				newPlan._user = transaction._user;
				
				newPlan.save(function(err) {
					if(err) {
						throw new Error('TransactionSchema#findOrGenerateProgram : Save plan error');
					}
					
					plan._id = newPlan._id;
				});
			}
				
			// Program unexist for this category
			var newProgram = new ProgramModel();
			
			newProgram._category = category_id;
			newProgram._plan = plan._id;
			newProgram._user = transaction._user;
			
			newProgram.save(function(err) {
				if(err) {
					throw new Error('TransactionSchema#findOrGenerateProgram : Save program error');
				}
				return newProgram._id;
			});
		});
};

// Return
module.exports = mongoose.model('Transaction', TransactionSchema);