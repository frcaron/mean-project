"use strict";

// Inject
var angular = require('angular');

module.exports = function (AppConfig) {

	// Module
	var mod_name = module.exports = 'user';
	AppConfig.registerModule(mod_name);

	// =========================================================================
	// Routes ==================================================================
	// =========================================================================

	angular.module(mod_name).config(require('./routes/user'));

	// =========================================================================
	// Controllers =============================================================
	// =========================================================================

	angular.module(mod_name).controller('AuthCtrl', require('./controllers/auth'));
	angular.module(mod_name).controller('LoginCtrl', require('./controllers/login'));
	angular.module(mod_name).controller('SignupCtrl', require('./controllers/signup'));

	// =========================================================================
	// Services ================================================================
	// =========================================================================

	angular.module(mod_name).factory('UserService', require('./services/user'));
};