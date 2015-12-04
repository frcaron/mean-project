"use strict";

// Inject
var Util = require('util');

var MetierEx = function (message, detail) {
	Error.captureStackTrace(this, this.constructor);
	this.name    = 'MetierEx';
	this.message = message || '';
	this.detail  = detail || undefined;
};
var DuplicateEx = function (message) {
	Error.captureStackTrace(this, this.constructor);
	this.name    = 'DuplicateEx';
	this.message = message || '';
};
var NoResultEx = function (message) {
	Error.captureStackTrace(this, this.constructor);
	this.name    = 'NoResultEx';
	this.message = message || '';
};
var ValidatorEx = function (message, detail) {
	Error.captureStackTrace(this, this.constructor);
	this.name    = 'ValidatorEx';
	this.message = message || '';
	this.detail  = detail || undefined;
};
var ParamEx = function (message) {
	Error.captureStackTrace(this, this.constructor);
	this.name    = 'ParamEx';
	this.message = message || '';
};
var LoginEx = function (message) {
	Error.captureStackTrace(this, this.constructor);
	this.name    = 'LoginEx';
	this.message = message || '';
};
var RouteEx = function (message) {
	Error.captureStackTrace(this, this.constructor);
	this.name    = 'RouteEx';
	this.message = message || undefined;
};

module.exports = {
	MetierEx    : MetierEx,
	DuplicateEx : DuplicateEx,
	NoResultEx  : NoResultEx,
	ValidatorEx : ValidatorEx,
	ParamEx     : ParamEx,
	LoginEx     : LoginEx,
	RouteEx     : RouteEx
};

Util.inherits(MetierEx, Error);
Util.inherits(DuplicateEx, MetierEx);
Util.inherits(NoResultEx, MetierEx);
Util.inherits(ValidatorEx, MetierEx);
Util.inherits(ParamEx, MetierEx);
Util.inherits(LoginEx, MetierEx);
Util.inherits(RouteEx, Error);