"use strict";

// Inject application
var Path     = require('path');
var BPromise = require('bluebird');
var Mongoose = BPromise.promisifyAll(require('mongoose'));
var Config   = require(Path.join(global.__core, 'system')).Config;

var Schema   = Mongoose.Schema;
var Types    = Mongoose.Types;

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
		var promise;
		if(Config.db.seq) {
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