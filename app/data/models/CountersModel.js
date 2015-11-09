// Inject application
var Promise  = require('bluebird');
var Mongoose = Promise.promisifyAll(require('mongoose'));
var Schema   = Mongoose.Schema;

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
var CountersModel = Mongoose.model('Counters', CountersSchema);

module.exports = {

	// Get next id table
	getNextSequence : function (name) {
		return CountersModel.findByIdAndUpdateAsync(
					name, 
					{ $inc : { seq : 1 } }, 
					{ new  : true,
					upsert : true
					})
				.then(function(ret) {
					return Promise.resolve(ret.seq);
				});
	}
};