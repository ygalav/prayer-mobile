var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

////////////////////
// build
////////////////////
gulp.task('build', ['compile-stylus', 'jshint']);

////////////////////
// default
////////////////////
gulp.task('default', $.taskListing.withFilters(null, 'default'));

////////////////////
// compile-stylus
////////////////////
gulp.task('compile-stylus', function() {
  return gulp.src([__dirname + '/www/lib/onsen/stylus/*-theme.styl'])
    .pipe(plumber())
    .pipe($.stylus({errors: true, define: {mylighten: mylighten}}))
    .pipe($.autoprefixer('> 1%', 'last 2 version', 'ff 12', 'ie 8', 'opera 12', 'chrome 12', 'safari 12', 'android 2'))
    .pipe($.rename(function(path) {
      path.dirname = '.';
      path.basename = 'onsen-css-components-' + path.basename;
      path.ext = 'css';
    }))
    .pipe(gulp.dest(__dirname + '/www/lib/onsen/css/'));

  // needs for compile
  function mylighten(param) {
    if (param.rgba) {
      var result = param.clone();
      result.rgba.a = 0.2;
      return result;
    }
    throw new Error('mylighten() first argument must be color.');
  }
});

gulp.task('prepare', [], function () {
  return gulp.src('node_modules/onsenui/**/*').pipe(gulp.dest('www/lib/onsenui'))
});

