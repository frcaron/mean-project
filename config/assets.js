module.exports = {
	client : {
		root : 'app/client',
		css : {
			files : [ 'app/client/**/assets/css/**/*.css' ]
		},
		js : {
			files : [ 'app/client/client.js',
				'app/client/components/**/index.js',
				'app/client/components/*/controllers/**/*.js',
				'app/client/components/*/routes/**/*.js',
				'app/client/components/*/services/**/*.js' ]
		},
		views : {
			files   : [ 'app/client/components/*/views/**/*.html' ],
			folders : [ 'app/client/*/*/views' ]
		}
	},
	server : {
		root : 'app/server',
		js : {
			files : [ 'server.js',
				'config/**/*.js',
				'app/server/**/*.js' ]
		},
		views : {
			files : [ 'app/server/views/**/*.html' ]
		}
	},
	dist : {
		dir    : 'app/client/dist',
		src    : 'app/client/client.js' ,
		output : {
			all : {
				css : [  ]
			},
			development  : {
				js      : 'app.js',
				css     : 'app.css'
			},
			production : {
				js       : 'app.min.js',
				css      : 'app.min.css',
				template : 'template.min.js'
			},
			test       : {
				js       : 'app.min.js',
				css      : 'app.min.css',
				template : 'template.min.js'
			}
		}
	}
};
