module.exports = {
	db : {
		url : 'mongodb://localhost/mean-project',
		seq : true
	},
	logging : {
		morgan : {
			format : '                    ** :url :method :status',
			stream :  {
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
					enabled : false,
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
		local : {
			enabled : true
		},
		facebook: {
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
			maxAge   : 24 * (60 * 60 * 1000),
			httpOnly : true,
			secure   : false
		}
	}
};