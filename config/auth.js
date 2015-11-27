module.exports = {
	'sessionAuth'  : {
		'clientSecret' : process.env.SESSION_SECRET || 'secretmeanproject',
	},
	'facebookAuth' : {
		'clientID'     : process.env.FB_ID || '1729934680559589',
		'clientSecret' : process.env.FB_SECRET || 'wrong_secret',
		'callbackURL'  : '/api/public/auth/facebook/callback'
	}
};