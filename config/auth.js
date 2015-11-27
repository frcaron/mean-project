module.exports = {
	'sessionAuth'  : {
		'clientSecret' : process.env.SESSION_SECRET || 'secretmeanproject',
	},
	'facebookAuth' : {
		'clientID'     : process.env.FB_ID || '1729934680559589',
		'clientSecret' : process.env.FB_SECRET || 'c689f2ace8f09088e49747cbaf5b8768',
		'callbackURL'  : '/api/public/auth/facebook/callback'
	}
};