"use strict";

module.exports = function (schema) {
	schema.add({
		created_date : Date,
		updated_date : Date
	});

	// MiddleWare
	schema.pre('save', function (next) {

		var currentDate = new Date();

		this.updated_date = currentDate;

		if (!this.created_date) {
			this.created_date = currentDate;
		}
		return next();
	});
};