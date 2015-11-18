"use strict";

// Inject
var Util = require('util');

var programmerError = function (message) {
 	Error.captureStackTrace(this, this.constructor);
	this.name    = this.constructor.name;
	this.message = message || '';
};

module.exports = {
	DuplicateError : programmerError,
	NoResultError  : programmerError,
	ParamsError    : programmerError,
	LoginError     : programmerError,
	MetierError    : programmerError
};

Util.inherits(programmerError, Error);