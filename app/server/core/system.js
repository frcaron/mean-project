"use strict";

// Inject
var path = require('path');
var fs   = require('fs');
var  _   = require('lodash');

// =========================================================================
// Config ==================================================================
// =========================================================================

// Generate conf with env
let defaultconfig = (function() {

	// Config app
	let configPath = path.join(process.cwd(), 'config/env');
	let load = ~fs.readdirSync(configPath).map(function(file) {
			return file.slice(0, -3);
	}).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

	// Assets env
	let dist = require(path.join(process.cwd(), 'config/assets')).dist.root || 'app/client/dist';
	if(!fs.existsSync(dist) || !fs.existsSync(path.join(dist, 'js')) || !fs.existsSync(path.join(dist, 'css'))) {
		throw new Error('Error folder dist');
	}

	let aggregatedassets = { js : [], css : [] };
	fs.readdirSync(path.join(process.cwd(), dist, 'js')).map(function(file) {
		aggregatedassets.js.push(path.join('dist/js', file));
	});
	fs.readdirSync(path.join(process.cwd(), dist, 'css')).map(function(file) {
		aggregatedassets.css.push(path.join('dist/css', file));
	});

	// Extend the base configuration in all.js with specific environnment and assets location
	return _.extend(
		require(configPath + '/all'),
		require(configPath + '/' + load) || {},
		{ 'aggregatedassets' : aggregatedassets }
	);
})();

module.exports = {
	Config : defaultconfig
};