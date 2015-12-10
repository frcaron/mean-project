"use strict";

// Inject
var angular = require('angular');
require('angular-route');

var app = angular.module('app', [ 'ngRoute' ]);

require('./components');

// =========================================================================
// Config client ===========================================================
// =========================================================================

app.config(function($routeProvider, $locationProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'components/home/views/index.html',
			controller  : 'HomeCtrl'
		})

		// .otherwise({
		// 	redirectTo : '/'
		// });

		// use the HTML5 History API
        $locationProvider.html5Mode(true);
});