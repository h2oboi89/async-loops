'use strict';

let gulp = require('gulp');
let jshint = require('gulp-jshint');
let _jasmine = require('gulp-jasmine');
let istanbul = require('gulp-istanbul');
let tap = require('gulp-tap');

let source = ['./src/**/*.js', './index.js'];
let tests = ['./spec/**/*.js'];
let gulpfile = ['./gulpfile.js'];
let all = [].concat(source).concat(tests).concat(gulpfile);

let jasmineConfig = {
  'spec_dir': 'spec',
  'spec_files': ['**/*[sS]pec.js']
};

gulp.task('test', function() {
  return gulp.src([].concat(tests))
    .pipe(_jasmine({
      config: jasmineConfig,
      includeStackTrace: true
    }));
});

gulp.task('lint', function() {
  return gulp.src(all)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('coverage', function() {
  return gulp.src([].concat(source))
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .pipe(tap(function(f) {
      require(f.path);
    }))
    .on('end', function() {
      gulp.src([].concat(tests))
        .pipe(_jasmine({
          config: jasmineConfig
        }))
        .pipe(istanbul.writeReports({
          dir: './coverage',
          reporters: ['text', 'text-summary', 'lcov'],
        }));
    });
});

gulp.task('watch', function() {
  gulp.watch(all, ['lint', 'test']);
});
