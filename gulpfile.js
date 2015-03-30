var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('es6', function () {
  return gulp.src(['src/*.js', '!src/run.js', '!src/main.js', 'src/**/*.js', 'src/**/**/*.js'])
  .pipe(babel({ modules: 'amd' }))
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
  gulp.watch(['src/*.js', 'src/**/*.js', 'src/**/**/*.js'], ['es6', 'copy']);
});

gulp.task('copy', function() {
  gulp.src(['src/run.js', 'src/main.js', 'src/widgets/templates/*.html'], { base: 'src' })
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['es6', 'copy']);
