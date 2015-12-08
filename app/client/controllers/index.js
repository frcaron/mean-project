'use strict';

var budgetApp = angular.module('budgetApp', ['ngRoute']);

budgetApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'dist/views/index.html',
                controller  : 'mainController'
            });
    });

budgetApp.controller('mainController', function ($scope) {
	$scope.message = 'Everyone come and see how good I look!';
	$scope.test = 'test1';
});