import gulp from 'gulp';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';

gulp.task('build', () => {
  gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', function() {
  return gulp.src('test/*-test.js', { read: false })
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('default', ['test']);
