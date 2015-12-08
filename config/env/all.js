module.exports =  {
	app : {
		name        : 'Budget',
		description : 'Test descripton',
		keywords    : 'Budget Mean'
	},
	templateEngine : 'swig',
	hostname : process.env.HOST || process.env.HOSTNAME || 'localhost',
	http : {
		port : process.env.PORT || 3000
	},
	https : {
		port : false,
		ssl  : {
			key  : '',
			cert : ''
		}
	},
	public : {
		languages : [{
			locale : 'fr'
		}, {
			locale : 'en'
		}],
		currentLanguage : 'fr'
	},
	session : {
		name   : 'connect.sid'
	},
	bodyParser : {
		json       : { type : 'application/vnd.api+json' },
		urlencoded : { extended: true }
	}
};