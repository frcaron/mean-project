'use strict';

module.exports = ['$stateProvider',
	function($stateProvider) {

		$stateProvider

			.state('auth', {
				url          : '/auth',
				abstract     : true,
				templateUrl  : 'components/user/views/index.html',
				controller   : 'AuthCtrl',
				controllerAs : 'authCtrl'
			})

			.state('auth.login', {
				url          : '/login',
				templateUrl  : 'components/user/views/login.html',
				controller   : 'LoginCtrl',
				controllerAs : 'loginCtrl'
			})

			.state('auth.signup', {
				url          : '/signup',
				templateUrl  : 'components/user/views/signup.html',
				controller   : 'SignupCtrl',
				controllerAs : 'signupCtrl'
			});
	}
];