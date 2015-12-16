'use strict';

module.exports = ['$stateProvider',
	function($stateProvider) {

		$stateProvider

			// route for the home page
			.state('test', {
				url      : '/test',
				template : '<h1>Test</h1>',
			});
	}
];