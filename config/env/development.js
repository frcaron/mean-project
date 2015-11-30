'use strict';

module.exports = {
	db : 'mongodb://localhost/mean-project',
	logging : {
		level  : 'debug',
		format : 'dev'
	},
	domain : 'http://localhost:3000',
	strategies : {
		local : {
			enabled : true
		},
		facebook: {
			clientID     : 'DEFAULT_APP_ID',
			clientSecret : 'APP_SECRET',
			callbackURL  : '/api/auth/facebook/callback',
			enabled      : false
		}
	},
	session : {
		secret : 'secretmeanproject'
	}
};