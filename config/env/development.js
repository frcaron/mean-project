module.exports = {
	db : {
		url : 'mongodb://localhost/mean-project',
		seq : true
	},
	logging : {
		morgan : {
			enabled : false,
			format  : '>> :status :method  	:url',
			stream  : {
				enabled     : false,
				filename    : 'logs/morgan/log',
				frequency   : 'daily',
				date_format : "YYYY-MM-DD"
			}
		},
		winston : {
			console : {
				enabled   : true,
				level     : 'debug',
				timestamp : {
					enabled : true,
					format  : 'HH:mm:ss'
				}
			},
			file    : {
				enabled     : false,
				filename    : 'logs/winston/log',
				date_format : ".yyyy-MM-dd",
				level       : 'debug',
				timestamp   : {
					enabled : false,
					format  : 'HH:mm:ss'
				}
			}
		}
	},
	domain : 'http://localhost:3000',
	strategies : {
		local    : {
			enabled : true
		},
		facebook : {
			enabled      : false,
			clientID     : 'DEFAULT_APP_ID',
			clientSecret : 'APP_SECRET',
			callbackURL  : '/api/auth/facebook/callback'
		}
	},
	session : {
		secret : 'secretmeanproject',
		delay  : 60,
		cookie : {
			// Only set the maxAge to null if the cookie shouldn't be expired
			// at all. The cookie will expunge when the browser is closed.
			maxAge   : 24 * (60 * 60 * 1000),
			httpOnly : true,
			secure   : false
		}
	}
};