// Include gulp
var gulp = require('gulp');

// Include our plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Compile our SASS
gulp.task('sass', function() {
  gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css'))
    .on('error', console.log.bind(console));
});

// JS Lint task
gulp.task('js-lint', function() {
  return gulp.src([
      'js/components/*.js',
      '!js/vendor/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .on('error', function(error) {
      console.log(error.toString());
      this.emit('end');
    });
});

gulp.task('js-vendor', function() {
  // concat all minified vendor files
  gulp.src([
      'js/vendor/jquery-1.12.3.min.js',
      'js/vendor/underscore-min.js',
      'js/vendor/moment.min.js',
      'js/vendor/eventemitter2.min.js',
      'js/vendor/tinyModal.min.js',
    ])
    .pipe(concat('all-vendor.min.js'))
    .pipe(gulp.dest('dist'))
    .on('error', console.log.bind(console));
});

// Concatenate & minify JS
gulp.task('js-src', function() {

  // Note: moved vendor files concatenation to a separate task to
  // quicken gulp watch compiliation
  gulp.src([
      'js/app.js'
    ])
    .pipe(concat('all-src.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('all-src.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .on('error', console.log.bind(console));

  // concat minified vendor and source files
  gulp.src([
    // 'dist/all-vendor.min.js',
    'dist/all-src.min.js'
  ])
  .pipe(concat('all.min.js'))
  .pipe(gulp.dest('dist'))
  .on('error', console.log.bind(console));
});

// Concatenate & minify CSS
gulp.task('css', ['sass'], function() {
  gulp.src([
      'css/vendor/**/*.css'
    ])
    .pipe(concat('all.css'))
    .on('error', console.log.bind(console))
    .pipe(gulp.dest('dist'));
});

// watch files for changes
gulp.task('watch', function() {
  gulp.watch('*.html');
  gulp.watch('js/**/*.js', ['js-lint', 'js-src']);
  gulp.watch(['scss/*.scss', 'css/*css'], ['css']);
});

// default task
gulp.task('default', ['sass', 'js-lint', 'js-vendor', 'js-src', 'css']);
