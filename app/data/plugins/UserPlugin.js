// Inject
var Mongoose = require('mongoose');

var Schema = Mongoose.Schema;

module.exports = function (schema, options) {
	schema.add({
		_user : {
			type     : Schema.Types.ObjectId,
			ref      : 'User',
			required : true
		}
	});

	if (options && options.index) {
		schema.index('_user', {
			unique : true
		});
	}
};