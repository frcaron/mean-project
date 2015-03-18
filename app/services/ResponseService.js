module.exports = {

	// Fail response
	fail    : function (res, message, detail, code) {
		if(!code) code = 500;
		return res.status(code).json({
			success : false,
			message : message,
			detail  : detail
		});
	},

	// Success response
	success : function (res, message, result) {
		if (result) {
			return res.status(200).json({
				success : true,
				message : message,
				result  : result
			});
		} else {
			return res.status(200).json({
				success : true,
				message : message
			});
		}
	}
};
