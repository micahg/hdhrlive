var gulp = require('gulp');

gulp.task('copy-client-js', function() {
  gulp.src(['./client/main.js',
            './client/app.component.js',
            './client/app.component.html',
            './client/app.module.js'])
  .pipe(gulp.dest('./client/public/app/'));
});
