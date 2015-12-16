'use strict';

module.exports = function (AppConfig) {
	require('./home')(AppConfig);
	require('./user')(AppConfig);
};