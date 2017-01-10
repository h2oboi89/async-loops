'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const _jasmine = require('gulp-jasmine');
const JasmineConsoleReporter = require('jasmine-console-reporter');
const istanbul = require('gulp-istanbul');
const runSequence = require('run-sequence');
const tap = require('gulp-tap');
const path = require('path');

const source = ['./src/**/*.js', './index.js'];
const sample = ['./sample/**/*.js'];
const tests = ['./spec/**/*.js'];
const gulpfile = ['./gulpfile.js'];
const all = [].concat(source).concat(sample).concat(tests).concat(gulpfile);

const lcovOutputFile = path.join(__dirname, 'coverage', 'lcov-report', 'index.html');

const jasmineConfig = {
  'spec_dir': 'spec',
  'spec_files': ['**/*[sS]pec.js']
};

gulp.task('setup-istanbul', () => {
  return gulp.src(source)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('require-all', ['setup-istanbul'], () => {
  return gulp.src(source)
    .pipe(tap((f) => require(f.path)));
});

gulp.task('test', ['require-all'], () => {
  return gulp.src(tests)
    .pipe(_jasmine({
      config: jasmineConfig,
      reporter: new JasmineConsoleReporter(),
      includeStackTrace: true
    }))
    .pipe(istanbul.writeReports({
      dir: './coverage',
      reporters: ['text', 'text-summary', 'lcov'],
    }))
    .on('end', () => {
      console.log();
      console.log(`Coverage details: file://${lcovOutputFile}`);
      console.log();
    });
});

gulp.task('lint', () => {
  const fail = process.argv[2] !== '-i';

  const lint = gulp.src(all)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));

  if(fail) {
    return lint.pipe(jshint.reporter('fail'));
  } else {
    return lint;
  }
});

gulp.task('default', () => {
  runSequence('lint', 'test');
});
