'use strict';

var browserify      = require('browserify');
var del             = require('del');
var source          = require('vinyl-source-stream');
var vinylPaths      = require('vinyl-paths');
var gulp            = require('gulp');
var runSequence     = require('run-sequence');
var _               = require('lodash');
var path            = require('path');
var gulpLoadPlugins = require('gulp-load-plugins');
var defaultAssets   = require('./config/assets');
var plugins         = gulpLoadPlugins();

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
		// nodeArgs : ['--debug'],
		ext      : 'js,html',
		watch    : _.union(defaultAssets.pattern.server.views, defaultAssets.pattern.server.js)
	}).on('restart', function () {
		// task in restart
	});
});

// Watch Files For Changes
gulp.task('watch', function () {
  // Start livereload
  plugins.livereload.listen();

  // Add watch rules
  gulp.watch(defaultAssets.pattern.server.js).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.pattern.server.views).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.pattern.client.js, ['browserify']).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.pattern.client.css).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.pattern.client.view).on('change', plugins.livereload.changed);
});

// =========================================================================
// Transform ===============================================================
// =========================================================================

// Clean task
gulp.task('clean', function () {
	return gulp.src([ defaultAssets.dist.dir] , {read: false})
		.pipe(vinylPaths(del));
});

// JS browserify task
gulp.task('browserify', function () {
	browserify({ entries : defaultAssets.dist.js })
		.bundle()
		.pipe(source('app.bundle.js'))
		.pipe(gulp.dest(path.join(defaultAssets.dist.dir, 'js')));
});

// JS browserify and minifying task
gulp.task('browserify-min', function () {
	return browserify({ entries : defaultAssets.dist.js })
		.bundle()
		.pipe(source('app.bundle.min.js'))
		.pipe(plugins.streamify(plugins.uglify({mangle: false})))
		.pipe(gulp.dest(path.join(defaultAssets.dist.dir, 'js')));
});

// CSS default task
gulp.task('css', function () {
  return gulp.src(defaultAssets.pattern.client.css)
	.pipe(source('app.css'))
	.pipe(gulp.dest(path.join(defaultAssets.dist.dir, 'css')));
});

// CSS minifying task
gulp.task('css-min', function () {
  return gulp.src(defaultAssets.pattern.client.css)
	.pipe(plugins.cssmin())
	.pipe(source('app.min.css'))
	.pipe(gulp.dest(path.join(defaultAssets.dist.dir, 'css')));
});

// =========================================================================
// Launcher ================================================================
// =========================================================================

// Run the project in development mode
gulp.task('default', function (done) {
	runSequence('env:dev', 'clean', ['browserify', 'css', 'nodemon', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
	runSequence('env:prod', 'clean', 'browserify-min', 'css-min', done);
});