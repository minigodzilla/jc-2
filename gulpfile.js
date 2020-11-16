const gulp = require('gulp');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const jsImport = require('gulp-js-import');
const sourcemaps = require('gulp-sourcemaps');
const cssbeautify = require('gulp-cssbeautify');
const isProd = process.env.NODE_ENV === 'prod';

var options = { };

function html() {
}

function css() {
    return gulp.src('assets/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(cssbeautify({
            indent: '  ',
            openbrace: 'separate-line',
            autosemicolon: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulpIf(isProd, cssmin()))
        .pipe(gulp.dest('assets/css/'));
}

function js() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
        'node_modules/owl.carousel/dist/owl.carousel.min.js',
        'assets/scripts/script.js'])
        .pipe(sourcemaps.init())
        .pipe(jsImport({
            hideConsole: true
        }))
        .pipe(concat('script.js'))
        .pipe(gulpIf(isProd, uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/js'));
}

function img() {
}

function fonts() {
}

function serve() {
    browserSync.init({
        open: true,
        notify: false,
        server: '.'
    });
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}


function watchFiles() {
    gulp.watch('*.html', gulp.series(browserSyncReload));
    gulp.watch('assets/sass/*.scss', gulp.series(css, browserSyncReload));
    gulp.watch('assets/scripts/*.js', gulp.series(js, browserSyncReload));

    return;
}

exports.css = css;
exports.js = js;

// this is the serve 
exports.default = gulp.parallel(css, js, watchFiles, serve);

// this is the build task
exports.build = gulp.series(css, js);