// Inject
var Util = require('util');

var programmerError = function (message) {
 	Error.captureStackTrace(this, this.constructor);
	this.name    = this.constructor.name;
	this.message = message || '';
};

module.exports = {
	DuplicateError : programmerError(message),
	NoResultError  : programmerError(message),
	ParamsError    : programmerError(message),
	LoginError     : programmerError(message),
};

Util.inherits(programmerErrorr, Error);