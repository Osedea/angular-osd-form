var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    ngAnnotate = require('gulp-ng-annotate'),
    karma = require('gulp-karma');

var isTravis = process.env.TRAVIS || false;

var paths = {
    js: [
        './src/app.js',
        './src/config.js',
        './src/controllers/osd-submit.js',
        './src/controllers/osd-field.js',
        './src/validators/osd-validators.js',
        './src/directives/osd-error.js',
        './src/directives/osd-field.js',
        './src/directives/osd-submit.js',
    ],
    test: [
        './node_modules/angular/angular.js',
        './node_modules/angular-mocks/angular-mocks.js',
        './bower_components/ng-lodash/build/ng-lodash.js',
        './src/**/*.js',
        './test/**/*.js',
    ]
};

gulp.task('default', ['watch']);

gulp.task('build', ['js']);

gulp.task('js', function () {
    return gulp.src(paths.js)
        .pipe(concat('angular-osd-form.js'))
        .pipe(gulp.dest('./'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch(paths.js, ['js', 'test']);
});

gulp.task('test', function () {
    return gulp.src(paths.test)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: isTravis ? 'run' : 'watch',
            singleRun: isTravis,
        }))
        .on('error', function (err) {
            throw err;
        });
});
