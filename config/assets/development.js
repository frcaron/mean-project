module.exports = {
	client : {
		libs  : {
			css : {
				src   : 'app/client',
				dist  : 'dist',
				files : [
					"libs/angular/angular-csp.css",
					"libs/animate.css/animate.min.css",
					"libs/bootstrap/dist/css/bootstrap.min.css"
				]
			},
			js  : {
				src   : 'app/client',
				dist  : 'dist',
				files : [
					"libs/jquery/dist/jquery.min.js",
					"libs/angular/angular.min.js",
					"libs/angular-route.min.js",
					"libs/bootstrap/dist/js/boostrap.min.js"
				]
			}
		},
		css   : {
			src   : 'app/client',
			dist  : 'dist',
			files : [
				"assets/css/*.css"
			]
		},
		js    : {
			src   : 'app/client',
			dist  : 'dist',
			files : [
				"controlers/**/*.js",
				"routes/**/*.js",
				"services/**/*.js"
			]
		},
		views : {
			src   : 'app/client',
			dist  : 'dist',
			files : [
				"views/**/*.html"
			]
		}
	}
};
