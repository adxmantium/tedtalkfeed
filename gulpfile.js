// Include gulp
var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	babel = require('gulp-babel'),
    react = require('gulp-react');

// Lint Task
// gulp.task('lint', function() {
//     return gulp.src('js/*.js')
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

gulp.task('copy', function(){
	gulp.src([
	    // 'node_modules/react/dist/react-with-addons.min.js',
	    // 'node_modules/react-dom/dist/react-dom.min.js',
	    // 'node_modules/underscore/underscore-min.js',
	    // 'node_modules/jquery/dist/jquery.min.js',
	    'node_modules/moment/min/moment.min.js'
	]).pipe(gulp.dest('assets/js'));
});

//concat files
gulp.task('concat-js', function(){
	return gulp.src([
			'assets/js/jquery.min.js',
			'assets/js/underscore-min.js',
			'assets/js/react-with-addons.min.js', 
			'assets/js/react-dom.min.js',
			'assets/js/moment.min.js'
			])
		.pipe(concat('libraries.min.js'))
		.pipe(gulp.dest('public/js'));
});


// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('assets/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css'));
});

//compile jsx to js
gulp.task('jsx', function () {
  return gulp.src('assets/js/react/*.jsx')
        .pipe(react({harmony: false, es6module: true}))
        .pipe(gulp.dest('public/js'));
});

// Concatenate & Minify JS
// gulp.task('scripts', function() {
//     return gulp.src('js/*.js')
//         .pipe(concat('all.js'))
//         .pipe(gulp.dest('dist'))
//         .pipe(rename('all.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('dist'));
// });

// Watch Files For Changes
// gulp.task('watch', function() {
//     gulp.watch('assests/js/react/*.jsx', ['jsx']);
//     // gulp.watch('scss/*.scss', ['sass']);
// });

gulp.task('default', ['jsx', 'sass']);