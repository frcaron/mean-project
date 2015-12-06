'use strict';

module.exports = {
	db : {
		url : 'mongodb://localhost/mean-project',
		seq : true
	},
	logging : {
		format : 'dev',
		transport : {
			console : {
				level     : 'debug',
				timestamp : {
					format  : 'HH:mm:ss',
					enabled : false
				},
				enabled   : true
			},
			file    : {
				filename : 'logs/app.log',
				level    : 'debug',
				timestamp : {
					format  : 'DD-MM-YY HH:mm:ss',
					enabled : false
				},
				enabled  : false
			}
		}
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
		secret : 'secretmeanproject',
		delay  : 1440
	}
};