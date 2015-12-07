'use strict';

module.exports = {
	db : {
		url : 'mongodb://' + process.env.DB_USR + ':' + process.env.DB_PWD + '@' + process.env.DB_ADDR + ' : ' + process.env.DB_PORT + '/' + process.env.DB_SCHEMA,
		seq : false
	},
	logging : {
		morgan : {
			format : 'combined',
			stream :  {
				enabled     : true,
				filename    : 'logs/morgan/app.%DATE%',
				frequency   : 'daily',
				date_format : "YYYY-MM-DD"
			}
		},
		winston : {
			console : {
				enabled   : true,
				level     : 'error',
				timestamp : {
					enabled : false,
					format  : 'HH:mm:ss'
				}
			},
			file    : {
				enabled     : true,
				filename    : 'logs/winston/app',
				date_format : ".yyyy-MM-dd",
				level       : 'debug',
				timestamp   : {
					enabled : true,
					format  : 'HH:mm:ss'
				}
			}
		}
	},
	domain : process.env.DOMAIN,
	strategies : {
		local : {
			enabled : true
		},
		facebook: {
			enabled      : true,
			clientID     : process.env.FB_ID,
			clientSecret : process.env.FB_SECRET,
			callbackURL  : '/api/auth/facebook/callback'
		}
	},
	session : {
		secret : process.env.SESSION_SECRET,
		delay  : 43200
	}
};