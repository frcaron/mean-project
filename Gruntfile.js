"use strict";

module.exports = function(grunt) {

	// Project configuration
	// grunt.initConfig({
	// 	pkg    : grunt.file.readJSON('package.json'),
	// 	clean  : [ 'app/client/libs/build' ],
	// 	concat : {
	// 		options : {
	// 			separator: ';'
	// 		},
	// 		dist    : {
	// 			src  : [ 'app/client/routes/**/*.js', 'app/client/controllers/**/*.js',
	// 				'app/client/services/**/*.js' ],
	// 			dest : 'app/client/libs/build/js/<%= pkg.name %>.js'
	// 		}
	// 	},
	// 	uglify : {
	// 		options : {
	// 			banner : '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
	// 		},
	// 		dist    : {
	// 			src  : [ '<%= concat.dist.dest %>' ],
	// 			dest : 'app/client/libs/build/js/<%= pkg.name %>.min.js'
	// 		}
	// 	}
	// });

	// // Load the plugin
	// grunt.loadNpmTasks('grunt-contrib-clean');
	// grunt.loadNpmTasks('grunt-contrib-concat');
	// grunt.loadNpmTasks('grunt-contrib-uglify');

	// // Default task(s)
	// grunt.registerTask('minify', ['clean', 'concat', 'uglify']);
};