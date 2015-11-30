'use strict';

module.exports = {
	db : 'mongodb://' + process.env.DB_USR + ':' + process.env.DB_PWD + '@' +
						process.env.DB_ADDR + ':' + process.env.DB_PORT + '/' + process.env.DB_SCHEMA,
	logging : {
		level  : process.env.LOG_LEVEL,
    	format: 'combined'
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
		secret : process.env.SESSION_SECRET
	}
};