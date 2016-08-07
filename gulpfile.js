// TODO: copy css/fonts into the distribution version.

var gulp = require('gulp'),
    exit = require('gulp-exit'),
    del = require('del'),
    open = require('gulp-open'),
    browserSync = require('browser-sync').create(),
    ngrok = require('ngrok'),
    gulpSequence = require('gulp-sequence'),
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    imageop = require('gulp-image-optimization');

var site = '',
    portVal = 8000;

// Minification tasks
gulp.task('contents', function() {
    return gulp.src('src/**/*.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
    return gulp.src('src/**/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
    return gulp.src('src/**/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('img', function() {
    return gulp.src('src/**/*.png')
        .pipe(imageop())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return del('dist');
});

// Build the distribution version
gulp.task('build', function(cb) {
    return gulpSequence('clean', ['contents', 'styles', 'scripts', 'img'], cb);
});

// Browser-sync configs
gulp.task('browser-sync-serve', ['build'], function(cb) {
    browserSync.init({
        port: portVal,
        open: false,
        server: {
            baseDir: 'dist/'
        }
    }, cb);
});

// All subtasks for printing Google PageSpeed Index scores
gulp.task('ngrok-serve', ['browser-sync-serve'], function(cb) {
    return ngrok.connect(portVal, function(err, url) {
        site = url;
        console.log('Serving your tunnel from: ' + site);
        cb();
    });
});

// Open the site in browsers
gulp.task('open-local', function() {
    return gulp.src('')
        .pipe(open({
            uri: 'http://localhost:' + portVal
        }));
});

gulp.task('open-external', function() {
    return gulp.src('')
        .pipe(open({
            uri: site
        }));
});

// Serve the minimized version
gulp.task('serve', function(cb) {
    return gulpSequence('ngrok-serve', ['open-local', 'open-external'], cb);
});

// Testing mode
gulp.task('test', function() {
    browserSync.init({
        port: portVal,
        open: 'local',
        browser: 'Google Chrome Canary',
        server: {
            baseDir: 'src/',
        }
    });
});
