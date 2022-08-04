const { src, dest } = require ('gulp');
const { series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

function sync() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
};

function browserReload() {
    browserSync.reload();
}

function styles() {
    return src('./main.scss')
    .pipe(sourcemaps.init())
    .pipe (sass())
    .pipe(sass({
    outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe (dest('./css/'))
    .pipe(browserSync.stream());
    
};

function watchFiles() {
    gulp.watch('./main.scss', styles);
    gulp.watch('./index.html', browserReload);
};

exports.styles = styles;
exports.sync = sync;
exports.default = series(sync, watchFiles);