'use strict';

module.exports = ['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider

			// route for the home page
			.state('home', {
				url         : '/',
				templateUrl : 'components/home/views/index.html',
				controller  : 'HomeCtrl'
			})

			// route for the home page
			.state('test', {
				url         : '/test'
			});
	}
];