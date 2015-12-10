module.exports = {
	dist  : {
		// Folder to store dist file
		dir   : 'app/client/dist',
		// File to browserify
		js    : [ 'app/client/client.js' ],
		// Folder views to expose
		views : [ 'app/client/components/*/views' ]
	},
	pattern : {
		client : {
			css   : [ 'app/client/**/assets/**/*.css' ],
			js    : [ 'app/client/client.js',
				'app/client/components/**/index.js',
				'app/client/components/*/controllers/**/*.js',
				'app/client/components/*/routes/**/*.js',
				'app/client/components/*/services/**/*.js' ],
			views : [ 'app/client/components/*/views/**/*.html' ]
		},
		server : {
			js    : [ 'server.js',
				'config/**/*.js',
				'app/server/**/*.js' ],
			views : [ 'app/server/views/**/*.html' ]
		}
	}
};
