"use strict";

// Inject
var Angular = require('angular');
require('angular-route');

var app = Angular.module('budgetApp', [ 'ngRoute' ]);

require('./components');

// =========================================================================
// Config client ===========================================================
// =========================================================================

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'dist/views/index.html',
			controller  : 'HomeCtrl'
		});
}]);