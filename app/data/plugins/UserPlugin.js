module.exports = function (schema, options) {
	schema.add({
		_user : {
			type     : Number,
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