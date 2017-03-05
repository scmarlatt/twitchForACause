const del = require('del');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
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
const mocha = require('gulp-mocha');
const protractor = require('gulp-angular-protractor');
const Server = require('karma').Server;

// PATHS
const paths = {
	scripts: './client/app/**/*.js',
	styles: ['./client/app/**/*.css', './client/app/**/*.scss'],
	index: './client/index.html',
	partials: ['./client/app/**/*.html', '!./client/index.html'],
	dist: './public/dist',
	node_modules: [
			'./node_modules/angular-ui-router/release/angular-ui-router.min.js'
		],
	distScripts: './public/dist/js',
	distStyles: './public/dist/',
};

// Karma Tests
/**
 * Run test once and exit
 */
gulp.task('test:karma', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function(err) {
    console.log(err);
    done
  }).start();
});

// Mocha Tests
gulp.task('test:mocha', function () {
  gulp.src('test/event-routes.test.js', {read: false})
    .pipe(mocha({reporter: 'nyan'}))
});

//Protractor Tests
gulp.task('test:protractor', function () {
  gulp.src(['./e2e/**/*.spec.js'])
    .pipe(protractor({
        'configFile': 'protractor.conf.js',
        'args': ['--baseUrl', 'http://127.0.0.1:9000/home'],
        'autoStartStopServer': true,
        'debug': true
    }))
    .on('error', function(e) { throw e })
});

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

// Clean library directory
gulp.task('clean:partials', function () {
  return del('public/dist/**/*.html');
});

gulp.task('build:partials', function() {
  gulp.src(['client/app/scripts/**/*.html'])
  	.pipe(gulp.dest('public/dist/partials'));
});

gulp.task('build:js', function() {
  gulp.src(['client/app/**/*.js'])
    .pipe(plugins.sourcemaps.init())
	    .pipe(concat('app.min.js'))
	    .pipe(uglify()).on('error', function(e){
	    //.pipe(uglify({mangle: false, compress:true})).on('error', function(e){
            console.log(e);
         })
	.pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('public/dist/js'));
});

gulp.task('build:libs', function() {
  gulp.src(paths.node_modules)
  	.pipe(plugins.sourcemaps.init())
	    .pipe(concat('vendor.min.js'))
	.pipe(plugins.sourcemaps.write())
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


gulp.task('clean', function(callback) {
	runSequence(['clean:dist:js', 'clean:dist:css', 'clean:lib', 'clean:partials'], callback);
});
gulp.task('scripts', function(callback) {
  runSequence(['build:js', 'build:libs'], callback);
});
gulp.task('styles', function(callback) {
  runSequence(['compile:sass', 'minify:css'], callback);
});
gulp.task('build', function(callback) {
  runSequence(['build:partials'],'scripts', 'styles', callback);
});

gulp.task('default', function(callback) {
  runSequence('clean', 'build', 'serve', callback);
});