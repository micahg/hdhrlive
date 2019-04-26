var gulp = require('gulp');

/*gulp.task('copy-client-js', function() {
  gulp.src(['./client/app.component.html']).pipe(gulp.dest('./public'));
  gulp.src(['./client/images/glyphicons-17-bin.png',
            './client/images/glyphicons-31-pencil.png'
           ]).pipe(gulp.dest('./public/images'));
});*/

var copyHtml = function() {
  return gulp.src(['./client/app.component.html']).pipe(gulp.dest('./public'));
};

var copyImages = function() {
  return gulp.src(['./client/images/glyphicons-17-bin.png',
                   './client/images/glyphicons-31-pencil.png'
  ]).pipe(gulp.dest('./public/images'));
}

gulp.task('copy-client-js', gulp.series(copyHtml, copyImages));
