'use strict';

module.exports = {
	db : {
		url : 'mongodb://' + process.env.DB_USR + ':' + process.env.DB_PWD + '@' + process.env.DB_ADDR + ' : ' + process.env.DB_PORT + '/' + process.env.DB_SCHEMA,
		seq : false
	},
	logging : {
		format : 'combined',
		transport : {
			console : {
				level   : 'error',
				timestamp : {
					format  : 'HH:mm:ss',
					enabled : false
				},
				enabled : true
			},
			file    : {
				filename : 'logs/app.log',
				level    : 'debug',
				timestamp : {
					format  : 'DD-MM-YY HH:mm:ss',
					enabled : false
				},
				enabled  : true
			}
		}
	},
	domain : process.env.DOMAIN,
	strategies : {
		local : {
			enabled : true
		},
		facebook: {
			clientID     : process.env.FB_ID,
			clientSecret : process.env.FB_SECRET,
			callbackURL  : '/api/auth/facebook/callback',
			enabled      : true
		}
	},
	session : {
		secret : process.env.SESSION_SECRET,
		delay  : 43200
	}
};