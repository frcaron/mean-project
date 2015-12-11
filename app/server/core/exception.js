"use strict";

// Inject
var util = require('util');

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

util.inherits(MetierEx, Error);
util.inherits(DuplicateEx, MetierEx);
util.inherits(NoResultEx, MetierEx);
util.inherits(ValidatorEx, MetierEx);
util.inherits(ParamEx, MetierEx);
util.inherits(LoginEx, MetierEx);
util.inherits(RouteEx, Error);