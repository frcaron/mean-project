module.exports = {
	client : {
		libs  : {
			css : {
				header : [
					"app/client/libs/angular/angular-csp.css",
					"app/client/libs/animate.css/animate.min.css",
					"app/client/libs/bootstrap/dist/css/bootstrap.min.css",
					"app/client/libs/font-awesome/css/font-awesome.min.css" ],
				footer : []
			},
			js  : {
				header : [
					"app/client/libs/jquery/dist/jquery.min.js",
					"app/client/libs/angular/angular.min.js",
					"app/client/libs/angular-route.min.js",
					"app/client/libs/bootstrap/dist/js/boostrap.min.js" ],
				footer : []
			},
		},
		css   : {
			header : [ "app/client/assets/css/*.css" ],
			footer : []
		},
		js    : {
			header : [
				"app/client/controlers/**/*.js",
				"app/client/routes/**/*.js",
				"app/client/services/**/*.js" ],
			footer : []
		},
		views : [ "app/client/views/**/*.html" ]
	}
};
