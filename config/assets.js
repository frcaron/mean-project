module.exports = {
	client : {
		root : 'app/client',
		css : {
			files : [ 'app/client/**/assets/css/**/*.css' ],
			libs  : [ 'node_modules/angular/angular-csp.css',
				'node_modules/animate.css/animate.css',
				'node_modules/bootstrap/dist/css/bootstrap.css',
				'node_modules/font-awesome/css/font-awesome.css' ]
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
		root   : 'app/client/dist',
		src    : 'app/client/client.js',
		output : {
			js       : 'app',
			css      : 'app',
			template : 'template'
			// development : {
			// 	js  : 'app.js',
			// 	css : 'app.css'
			// },
			// production : {
			// 	js       : 'app.min.js',
			// 	css      : 'app.min.css',
			// 	template : 'template.min.js'
			// },
			// test : {
			// 	js       : 'app.min.js',
			// 	css      : 'app.min.css',
			// 	template : 'template.min.js'
			// }
		}
	}
};
