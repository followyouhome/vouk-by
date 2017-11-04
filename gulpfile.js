var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish');
var watch = require('gulp-watch');
var shell = require('gulp-shell')

var paths = {
  'db': './db',
  'src': ['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json']
};

// gulp lint
gulp.task('lint', function(){
  gulp.src(paths.src)
    .pipe(jshint())
    .pipe(jshint.reporter(jshintReporter));
});
// gulp watcher for lint
gulp.task('watch:lint', function () {
  gulp.watch(paths.src, ['lint']);
});
gulp.task('watch', [
  'watch:lint'
]);

gulp.task('run-keystone', shell.task('node keystone.js'));

gulp.task('default', ['watch', 'run-keystone']);
