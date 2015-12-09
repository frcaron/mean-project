'use strict';

var browserify      = require('browserify');
var del             = require('del');
var source          = require('vinyl-source-stream');
var vinylPaths      = require('vinyl-paths');
var gulp            = require('gulp');
var runSequence     = require('run-sequence');
var glob            = require('glob');
var _               = require('lodash');
var path            = require('path');
var gulpLoadPlugins = require('gulp-load-plugins');
var Assets          = require('./config/assets/all');
var plugins         = gulpLoadPlugins();

// Define file path variables
let paths = {
	dist : 'app/client/dist'
};

// =========================================================================
// Environnement ===========================================================
// =========================================================================

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
	process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
	process.env.NODE_ENV = 'production';
});

// =========================================================================
// Nodemon =================================================================
// =========================================================================

// Nodemon task
gulp.task('nodemon', function () {
	return plugins.nodemon({
		script   : 'server.js',
		nodeArgs : ['--debug'],
		ext      : 'js,html',
		watch    : _.union(Assets.matching.server.views, Assets.matching.server.js)
	}).on('restart', function () {
		console.log('restarted!');
	});
});

// Watch Files For Changes
gulp.task('watch', function () {
  // Start livereload
  plugins.livereload.listen();

  // Add watch rules
  gulp.watch(Assets.matching.server.js).on('change', plugins.livereload.changed);
  gulp.watch(Assets.matching.server.views).on('change', plugins.livereload.changed);
  gulp.watch(Assets.matching.client.js, ['browserify']).on('change', plugins.livereload.changed);
  gulp.watch(Assets.matching.client.css).on('change', plugins.livereload.changed);
  gulp.watch(Assets.matching.client.view).on('change', plugins.livereload.changed);
});

// =========================================================================
// Transform ===============================================================
// =========================================================================
//
gulp.task('clean', function () {
	return gulp.src([paths.dist], {read: false})
		.pipe(vinylPaths(del));
});

gulp.task('browserify', function (done) {
	let assets = Assets.matching.client.js;
	assets.map(function (a) {
		glob(a, function(err, files) {
			if(err) {
				done(err);
			}

			files.map(function(entry) {
				return browserify({ entries: [entry] })
					.bundle()
					.pipe(source(path.basename(entry) + '.bundle.js'))
					// .pipe(rename({
					//     extname: '.bundle.js'
					// }))
					.pipe(gulp.dest(path.join(paths.dist, 'js')));
			});
		});
	});
});

// JS minifying task
gulp.task('browserify-min', function () {
	return browserify(Assets.matching.client.js)
		.bundle()
		.pipe(source('app.min.js'))
		.pipe(plugins.streamify(plugins.uglify({mangle: false})))
		.pipe(gulp.dest(path.join(paths.dist, 'js')));
});

// CSS minifying task
gulp.task('css', function () {
  return gulp.src(Assets.matching.client.css)
	.pipe(source('app.css'))
	.pipe(gulp.dest(path.join(paths.dist, 'css')));
});

// CSS minifying task
gulp.task('css-min', function () {
  return gulp.src(Assets.matching.client.css)
	.pipe(plugins.cssmin())
	.pipe(source('app.min.css'))
	.pipe(gulp.dest(path.join(paths.dist, 'css')));
});

// =========================================================================
// Launcher ================================================================
// =========================================================================

// Run the project in development mode
gulp.task('default', function (done) {
	runSequence('env:dev', 'clean', ['browserify', 'nodemon', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
	runSequence('env:prod', 'clean', 'browserify-min', 'css-min', done);
});