'use strict';

var browserify = require('browserify');
var del        = require('del');
var source     = require('vinyl-source-stream');
var vinylPaths = require('vinyl-paths');
var gulp       = require('gulp');
var path       = require('path');

// Load all gulp plugins listed in package.json
let gulpPlugins = require('gulp-load-plugins')({
	pattern       : ['gulp-*', 'gulp.*'],
	replaceString : /\bgulp[\-.]/
});

// Define file path variables
let paths = {
	root : 'app',      // App root path
	src  : 'app/client',      // Source path
	dist : 'app/client/dist', // Distribution path
};

let liveReload = true;

gulp.task('clean', function () {
	return gulp
		.src([paths.dist, path.join(paths.root, 'ngAnnotate')], {read: false})
		.pipe(vinylPaths(del));
});

gulp.task('browserify', function () {
	return browserify(path.join(paths.src, 'client.js'), {debug: true})
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest(path.join(paths.dist, 'js')))
		.pipe(gulpPlugins.connect.reload());
});

gulp.task('ngAnnotate', function () {
	return gulp.src([path.join(paths.src, '**/*.js')])
		.pipe(gulpPlugins.ngAnnotate())
		.pipe(gulp.dest(path.join(paths.root, 'ngAnnotate')));
});

gulp.task('browserify-min', ['ngAnnotate'], function () {
	return browserify(path.join(paths.root, 'ngAnnotate', 'client.js'))
		.bundle()
		.pipe(source('app.min.js'))
		.pipe(gulpPlugins.streamify(gulpPlugins.uglify({mangle: false})))
		.pipe(gulp.dest(path.join(paths.dist, 'js')));
});

gulp.task('server', ['browserify'], function () {
	gulpPlugins.connect.server({
		root: 'server',
		livereload: liveReload,
	});
});

gulp.task('watch', function () {
	gulp.start('server');
	gulp.watch([path.join(paths.src, 'components', '**/*.js')], ['fast']);
});

gulp.task('fast', ['clean'], function () {
	gulp.start('browserify');
});

gulp.task('default', ['clean'], function () {
	liveReload = false;
	gulp.start('browserify', 'browserify-min');
});