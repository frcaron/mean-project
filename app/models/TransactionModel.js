// Inject application
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Inject models
var PlanModel = require('./PlanModel');
var ProgramModel = require('./ProgramModel');

// Inject plugin
var datePlugin = require(global.__plugin + '/DatePlugin');
var userPlugin = require(global.__plugin + '/UserPlugin');

// Schema
var TransactionSchema = new Schema({
	date     : Date,
	sum      : {
		type     : Number,
		required : true,
		index    : true
	},
	comment  : String,
	_program : {
		type : Schema.Types.ObjectId,
		ref  : 'Program'
	}
});

TransactionSchema.plugin(datePlugin);
TransactionSchema.plugin(userPlugin);

TransactionSchema.methods.findOrGenerateProgram = function (date, category_id) {

	var transaction = this;

	var date_split = date.split('/');
	var mm = date_split[ 1 ];
	var yy = date_split[ 2 ];

	var id;

	PlanModel.findOne({
		_user : transaction._user,
		month : mm,
		year  : yy
	}).populate('programs').exec(function (err, plan) {
		if (err) {
			throw new Error('TransactionSchema#findOrGenerateProgram : Find plan error / ' + err.message);
		}

		console.log('Plan : ' + plan.programs);
		if (plan) {

		} else if (!plan) {

			// Plan unexist for this date
			var newPlan = new PlanModel();

			newPlan.month = mm;
			newPlan.year = yy;
			newPlan._user = transaction._user;

			newPlan.save(function (err) {
				if (err) {
					throw new Error('TransactionSchema#findOrGenerateProgram : Save plan error / ' + err.message);
				}

				id = newPlan._id;
			});
		}

		// Program unexist for this category
		// var newProgram = new ProgramModel();
		//			
		// newProgram._category = category_id;
		// newProgram._plan = id;
		// newProgram._user = transaction._user;
		//			
		// newProgram.save(function(err) {
		// if(err) throw new Error('TransactionSchema#findOrGenerateProgram :
		// Save program error / ' + err.message);
		// return newProgram._id;
		// });
	});
};

// Return
module.exports = mongoose.model('Transaction', TransactionSchema);