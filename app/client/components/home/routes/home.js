'use strict';

module.exports = ['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise(function ($injector) {
			$injector.get('$state').transitionTo('404', null, {
				location : true
			});
		});

		$stateProvider

			// route for the home page
			.state('home', {
				url          : '/',
				templateUrl  : 'components/home/views/index.html',
				controller   : 'HomeCtrl',
				controllerAs : 'homeCtrl'
			})

			// Bad request
			.state('400', {
				url          : '/400',
				templateUrl  : 'components/home/views/400.html',
				controller   : 'ErrorCtrl',
				controllerAs : 'errorCtrl'
			})

			// Forbidden
			.state('403', {
				url          : '/403',
				templateUrl  : 'components/home/views/403.html',
				controller   : 'ErrorCtrl',
				controllerAs : 'errorCtrl'
			})

			// Not found
			.state('404', {
				url          : '/404',
				templateUrl  : 'components/home/views/404.html',
				controller   : 'ErrorCtrl',
				controllerAs : 'errorCtrl'
			});
	}
];