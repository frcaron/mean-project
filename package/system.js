
"use strict";

// Inject
var Path = require('path');
var Fs   = require('fs');
var  _   = require('lodash');

function loadConfig() {
	var configPath = Path.join(process.cwd(), 'config/env');
	var load = ~Fs.readdirSync(configPath).map(function(file) {
			return file.slice(0, -3);
	}).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

	// Extend the base configuration in all.js with environment
	// specific configuration
	return _.extend(
		require(configPath + '/all'),
		require(configPath + '/' + load) || {}
	);
}

var defaultconfig;

module.exports = {
	loadConfig() {
		return defaultconfig || loadConfig();
	}
};