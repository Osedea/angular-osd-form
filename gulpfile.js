var gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    rename = require('gulp-rename'),
    argv = require('yargs').argv,
    ngAnnotate = require('gulp-ng-annotate'),
    karma = require('gulp-karma'),
    es = require('event-stream');

var paths = {
    js: [
        './angular-osd-form.js',
    ],
    test: [
        'node_modules/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'angular-osd-form.js',
        './test/**/*.js',
    ]
};

gulp.task('default', ['watch']);

gulp.task('build', ['js']);

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(concat('angular-osd-form.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./'))
        .on('error', gutil.log);
});

gulp.task('clean-js', function() {
    return gulp.src('./*.min.js', { read: false })
        .pipe(clean());
});

gulp.task('watch', ['build'], function() {
    gulp.watch(paths.js, ['js', 'test']);
});

gulp.task('test', function() {
    return gulp.src(paths.test)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            throw err;
        });
});
