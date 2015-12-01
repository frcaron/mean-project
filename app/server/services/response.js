"use strict";

module.exports = {

	// Fail response
	fail (res, options) {
		options = options || {};
		res.status(options.code_http || 500).json({
			success : false,
			reason  :  options.reason || 'Unknow',
			detail  :  options.detail
		});
	},

	// Success response
	success (res, options) {
		options = options || {};
		if (options.result) {
			res.status(200).json({
				success : true,
				result  : options.result
			});
		} else {
			res.status(200).json({
				success : true
			});
		}
	}
};
