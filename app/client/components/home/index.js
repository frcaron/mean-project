"use strict";

// Inject
var angular = require('angular');

module.exports = function (AppConfig) {

	// Module
	var mod_name = module.exports = 'home';
	AppConfig.registerModule(mod_name);

	// =========================================================================
	// Routes ==================================================================
	// =========================================================================

	angular.module(mod_name).config(require('./routes/home'));
	angular.module(mod_name).config(require('./routes/header'));

	// =========================================================================
	// Controllers =============================================================
	// =========================================================================

	angular.module(mod_name).controller('HomeCtrl', require('./controllers/home'));
	angular.module(mod_name).controller('HeaderCtrl', require('./controllers/header'));
	angular.module(mod_name).controller('ErrorCtrl', require('./controllers/error'));

	// =========================================================================
	// Services ================================================================
	// =========================================================================

	angular.module(mod_name).factory('HomeService', require('./services/home'));

	// =========================================================================
	// Directives ==============================================================
	// =========================================================================

	angular.module(mod_name).directive('appHeader', require('./directives/header'));
};