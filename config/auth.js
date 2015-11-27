module.exports = {
	'sessionAuth'  : {
		'clientSecret' : process.env.SESSION_SECRET || 'secretmeanproject',
	},
	'facebookAuth' : {
		'clientID'     : process.env.FB_ID,
		'clientSecret' : process.env.FB_SECRET,
		'callbackURL'  : '/api/public/auth/facebook/callback'
	}
};