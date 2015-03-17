module.exports = {

	// Fail response
	fail    : function (res, message, detail) {
		return res.status(500).json({
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
