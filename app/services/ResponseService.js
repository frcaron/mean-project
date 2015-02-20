
module.exports = {
	
	// Fail response
	fail : function(res, message, detail) {
		return { success : false, message : message, detail : detail };
	},
	
	// Success response
	success : function(message, result) {
		if(result) {
			return { success : true, message : message, result : result };
		} else {
			return { success : true, message : message };
		}
	}
};
