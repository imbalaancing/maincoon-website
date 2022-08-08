const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();
const newer = require('gulp-newer');

const paths = {
    styles: {
        src: 'main.scss',
        dest: 'build/styles/'
    },
    html: {
        src: 'index.html',
        dest: 'build/'
    },
    fonts: {
        src: 'fonts/**',
        dest: 'build/fonts/'
    },
    images: {
        src: 'img/**/*',
        dest: 'build/img/'
    }
};

function clean() {
    return del(['build/*', '!build/img']);
};

function cleanImg() {
    return del(['build/img/']);
};

function cleanFonts() {
    return del(['build/fonts/'])
};

function copyHtml() {
    return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browsersync.stream())
};

function copyFonts() {
    return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browsersync.stream())
};

function styles() {
    return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream())
};

function img() {
    return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browsersync.stream())
};

function watch() {
    browsersync.init({
        server: {
            baseDir: 'build/'
        }
    })
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.html.src, copyHtml)
    gulp.watch(paths.html.dest).on('change', browsersync.reload)
    gulp.watch(paths.images.src, img)
    gulp.watch(paths.images.src).on('unlink', cleanImg)
    gulp.watch(paths.images.src).on('change', browsersync.reload)
    gulp.watch(paths.fonts.src, copyFonts)
    gulp.watch(paths.fonts.src).on('unlink', cleanFonts)
    gulp.watch(paths.images.src).on('change', browsersync.reload)
};


const build = gulp.series(clean, copyHtml, copyFonts, img, styles, watch);

exports.clean = clean;
exports.build = build;
exports.default = build;