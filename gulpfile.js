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
var plugins         = gulpLoadPlugins({
	rename: {
		'gulp-angular-templatecache': 'templateCache'
	}
});

// =========================================================================
// Environnement ===========================================================
// =========================================================================

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
	process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
	process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
	process.env.NODE_ENV = 'production';
});

// =========================================================================
// Server ==================================================================
// =========================================================================

// Nodemon task
gulp.task('nodemon', function () {
	return plugins.nodemon({
		script   : 'server.js',
		// nodeArgs : ['--debug'],
		ext      : 'js,html',
		watch    : _.union(defaultAssets.server.views.files, defaultAssets.server.js.files)
	}).on('restart', function () {
		// task in restart
	});
});

// Watch Files For Changes
gulp.task('watch', function () {
	// Start livereload
	plugins.livereload.listen();

	// Add watch rules
	gulp.watch(defaultAssets.server.js.files).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.server.views.files).on('change', plugins.livereload.changed);

	if (process.env.NODE_ENV === 'test') {
		gulp.watch(defaultAssets.client.js.files, ['browserify-min']).on('change', plugins.livereload.changed);
		gulp.watch(defaultAssets.client.css.files, ['css-min']).on('change', plugins.livereload.changed);
		gulp.watch(defaultAssets.client.views.files, ['templatecache']).on('change', plugins.livereload.changed);
	} else {
		gulp.watch(defaultAssets.client.js.files, ['browserify']).on('change', plugins.livereload.changed);
		gulp.watch(defaultAssets.client.css.files, ['css']).on('change', plugins.livereload.changed);
		gulp.watch(defaultAssets.client.views.files).on('change', plugins.livereload.changed);
	}
});

// =========================================================================
// Transform ===============================================================
// =========================================================================

// Clean task
gulp.task('clean', function () {
	return gulp.src(path.join(defaultAssets.dist.root, '*'), {read: false})
		.pipe(vinylPaths(del));
});

// JS browserify task
gulp.task('browserify', function () {
	return browserify({ entries : defaultAssets.dist.src })
		.bundle()
		.pipe(source(defaultAssets.dist.output.js))
		.pipe(plugins.rename(function (path) {
		    path.extname = '.js';
		}))
		.pipe(gulp.dest(path.join(defaultAssets.dist.root, 'js')));
});

// JS browserify and minifying task
gulp.task('browserify-min', function () {
	return browserify({ entries : defaultAssets.dist.src })
		.bundle()
		.pipe(source(defaultAssets.dist.output.js))
		.pipe(plugins.rename(function (path) {
		    path.basename += '.min';
		    path.extname = '.js';
		}))
		.pipe(plugins.streamify(plugins.uglify({mangle: false})))
		.pipe(gulp.dest(path.join(defaultAssets.dist.root, 'js')));
});

// CSS default task
gulp.task('css', function () {
	gulp.src(defaultAssets.client.css.files)
		.pipe(plugins.concat(defaultAssets.dist.output.css))
		.pipe(plugins.rename(function (path) {
		    path.extname = '.css';
		}))
		.pipe(gulp.dest(path.join(defaultAssets.dist.root, 'css')));
	return gulp.src(defaultAssets.client.css.libs)
		.pipe(gulp.dest(path.join(defaultAssets.dist.root, 'css')));
});

// CSS minifying task
gulp.task('css-min', function () {
	gulp.src(defaultAssets.client.css.files)
		.pipe(plugins.cssmin())
		.pipe(plugins.concat(defaultAssets.dist.output.css))
		.pipe(plugins.rename(function (path) {
		    path.basename += '.min';
		    path.extname = '.css';
		}))
		.pipe(gulp.dest(path.join(defaultAssets.dist.root, 'css')));
	return gulp.src(defaultAssets.client.css.libs)
		.pipe(plugins.cssmin())
		.pipe(plugins.rename(function (path) {
		    path.basename += '.min';
		    path.extname = '.css';
		}))
		.pipe(gulp.dest(path.join(defaultAssets.dist.root, 'css')));
});

// Angular template cache task
gulp.task('templatecache', function () {
	var re = new RegExp('\\' + path.sep + 'client\\' + path.sep, 'g');
	return gulp.src(defaultAssets.client.views.files)
		.pipe(plugins.templateCache(defaultAssets.dist.output.template, {
			root   : 'components',
			module : 'app',
			templateHeader: '(function(){\'use strict\';angular.module(\'<%= module %>\'<%= standalone %>).run(templates);templates.$inject=[\'$templateCache\'];function templates($templateCache){',
			templateBody: '$templateCache.put(\'<%= url %>\',\'<%= contents %>\');',
			templateFooter: '}})();',
			transformUrl: function (url) {
				return url.replace(re, path.sep);
			}

		}))
		.pipe(plugins.rename(function (path) {
		    path.basename += '.min';
		    path.extname = '.js';
		}))
		.pipe(gulp.dest(path.join(defaultAssets.dist.root, 'js')));
});

// =========================================================================
// Launcher ================================================================
// =========================================================================

// Run the project in development mode
gulp.task('default', function (done) {
	runSequence('env:dev', 'clean', ['browserify', 'css'], ['nodemon', 'watch'], done);
});

// Run the project in simulate mode
gulp.task('test', function (done) {
	runSequence('env:test', 'clean', ['browserify-min', 'css-min', 'templatecache'], ['nodemon', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
	runSequence('env:prod', 'clean', ['browserify-min', 'css-min', 'templatecache'], done);
});