import gulp from 'gulp';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';

gulp.task('build', () => {
  gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('dest'));
});

gulp.task('test', function() {
  return gulp.src('test/chained-preprocessors-test.js', { read: false })
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('default', ['test']);
