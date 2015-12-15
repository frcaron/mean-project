"use strict";

// Inject ordered
require('jquery');
var angular = require('angular');
require('angular-ui-router');

// Init the application configuration module for AngularJS application
var AppConfig = (function () {

	// Init module configuration options
	var appModuleName = 'app';
	var appModuleDep  =  [ 'ui.router' ];

	// Add a new vertical module
	var registerModule = function (moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(appModuleName).requires.push(moduleName);
	};

	return {
		appModuleName  : appModuleName,
		appModuleDep   : appModuleDep,
		registerModule : registerModule
	};
})();

//Start by defining the main module and adding the module dependencies
angular.module('app', ['ui.router']);

angular.module('app').config(['$locationProvider',
	function ($locationProvider) {
		$locationProvider.html5Mode(true);
	}
]);

angular.module('app').run([
	function() {
		// TODO load static data
	}
]);

// Module app
require('./components')(AppConfig);