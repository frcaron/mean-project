"use strict";

// Inject application
var path     = require('path');
var BPromise = require('bluebird');
var mongoose = BPromise.promisifyAll(require('mongoose'));
var config   = require(path.join(global.__core, 'system')).Config;

var Schema   = mongoose.Schema;
var Types    = mongoose.Types;

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

module.exports = {

	// Get next id table
	getNextSequence : function (name) {
		var promise;
		if(config.db.seq) {
			promise = CountersModel.findByIdAndUpdateAsync(
				name,
				{ $inc : { seq : 1 } },
				{
					new    : true,
					upsert : true
				})
			.then(function(ret) {
				return BPromise.resolve(ret.seq);
			});
		} else {
			promise = BPromise.resolve(new Types.ObjectId());
		}
		return promise;
	}
};