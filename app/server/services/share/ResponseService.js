"use strict";

module.exports = {

	// Fail response
	fail    : function (res, options) {
		res.status(options.code_http || 500).json({
			success : false,
			message : '[Fail] ' + options.message,
			reason  :  options.reason
		});
	},

	// Success response
	success : function (res, options) {
		if (options.result) {
			res.status(200).json({
				success : true,
				message : '[Success] ' + options.message,
				result  : options.result
			});
		} else {
			res.status(200).json({
				success : true,
				message : '[Success] ' + options.message
			});
		}
	}
};
