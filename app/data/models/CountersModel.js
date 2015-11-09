// Inject application
var Promise  = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var Schema   = mongoose.Schema;

// Schema
var CountersSchema = new Schema({
	_id : {
		type      : String,
		lowercase : true,
		text      : true
	},
	seq : {
		type     : Number,
		default  : 0
	}
});

// Model
var CountersModel = mongoose.model('Counters', CountersSchema);

// Return
module.exports = {

	// Get next id table
	getNextSequence : function (name) {
		return CountersModel.findByIdAndUpdateAsync(
					name, 
					{ $inc : { seq : 1 } }, 
					{ new : true, upsert : true })
				.then(function(ret) {
					return ret.seq;
				});
	}
};