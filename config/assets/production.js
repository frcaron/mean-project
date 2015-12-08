module.exports = {
	client : {
		css   : {
			src   : 'app/client/build/css',
			dist  : 'dist/css',
			files : [
				"combined.min.css",
				"app.header.min.css"
			]
		},
		js    : {
			src   : 'app/client/build/js',
			dist  : 'dist/js',
			files : [
				"combined.min.js",
				"app.header.min.js"
			]
		},
		views : {
			src   : 'app/client/views',
			dist  : 'dist/views',
			files : [
				"views/**/*.html"
			]
		}
	}
};
