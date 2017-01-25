const del = require('del');
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const colors  = require('colors');
const concat = require('gulp-concat');
const liveServer = require('gulp-live-server');
const plumber = require('gulp-plumber');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const sourcemaps = require('gulp-sourcemaps');


// Clean the js distribution directory
gulp.task('clean:dist:js', function () {
  return del('public/dist/js/*');
});

// Clean the css distribution directory
gulp.task('clean:dist:css', function () {
  return del('public/dist/css/*');
});

// Clean library directory
gulp.task('clean:lib', function () {
  return del('public/lib/**/*');
});

// Lint JavaScript
gulp.task('lint:js', function() {
  return gulp.src('client/app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Generate systemjs-based builds
/*
gulp.task('bundle:js', function() {
  var builder = new sysBuilder('public', './system.config.js');
  return builder.buildStatic('app', 'public/dist/js/app.min.js')
    .then(function () {
      return del(['public/dist/js/add-star-star-here/*', '!public/dist/js/app.min.js']);
    })
    .catch(function(err) {
      console.error('>>> [systemjs-builder] Bundling failed'.bold.green, err);
    });
});
*/

gulp.task('minify:js', function() {
  gulp.src(['client/app/**/*.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/js'));
});

// Lint Sass
gulp.task('lint:sass', function() {
  return gulp.src('client/app/**/*.scss')
    .pipe(plumber({
      errorHandler: function (err) {
        console.error('>>> [sass-lint] Sass linting failed'.bold.green);
        this.emit('end');
      }}))
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

// Compile SCSS to CSS, concatenate, and minify
gulp.task('compile:sass', function () {
  // concat and minify global scss files
  gulp
    .src('client/app/css/global/*.scss')
    .pipe(plumber({
      errorHandler: function (err) {
        console.error('>>> [sass] Sass global style compilation failed'.bold.green);
        this.emit('end');
      }}))
    .pipe(sourcemaps.init())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(concat('styles.min.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/dist/css/global'));

  // minify component specific scss files
  gulp
    .src('client/app/css/component/*.scss')
    .pipe(plumber({
      errorHandler: function (err) {
        console.error('>>> [sass] Sass component style compilation failed'.bold.green + err);
        this.emit('end');
      }}))
    .pipe(sourcemaps.init())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/dist/css/component'));
});

// Concat and minify CSS
gulp.task('minify:css', function() {
  // concat and minify global css files
  gulp
    .src('client/app/css/global/*.css')
    .pipe(concat('global.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/dist/css/global'));

  // minify component css files
  gulp
    .src('client/app/css/component/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/dist/css/component'));
});

// Watch src files for changes, then trigger recompilation
gulp.task('watch:app', function() {
  gulp.watch('client/app/**/*.js', ['scripts']);
  gulp.watch('client/app/**/*.scss', ['styles']);
});

// Run Express, auto rebuild and restart on src changes
gulp.task('serve', ['watch:app'], function () {
  var server = liveServer.new('server.js');
  server.start();

  gulp.watch('server.js', server.start.bind(server));
});


gulp.task('lint', ['lint:js', 'lint:sass']);

gulp.task('clean', ['clean:dist:js', 'clean:dist:css', 'clean:lib']);

gulp.task('scripts', function(callback) {
  runSequence(['lint:js', 'clean:dist:js'], 'minify:js', callback);
});
gulp.task('styles', function(callback) {
  runSequence(['lint:sass', 'clean:dist:css'], ['compile:sass', 'minify:css'], callback);
});
gulp.task('build', function(callback) {
  runSequence('scripts', 'styles', callback);
});

gulp.task('default', function(callback) {
  runSequence('build', 'serve', callback);
});