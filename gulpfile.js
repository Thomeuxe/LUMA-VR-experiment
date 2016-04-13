var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var uncss = require('gulp-uncss');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var argv = require('yargs').argv;
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');


/**********************
 *
 * PATH AND FILES VARIABLES
 *
 *********************/

var DIR = {};
DIR.src = "./src";
DIR.build = "./build";
DIR.assets = DIR.src + "/assets";
DIR.sass = DIR.assets + "/scss";
DIR.css = DIR.assets + "/css";
DIR.images = DIR.assets + "/img";
DIR.js = DIR.assets + "/js";
DIR.vendors = DIR.assets + "/vendors"; // Sync this path with bower FILES directory (in .bowerrc)

var FILES = {
    watchable: DIR.src + "/**/*.{html,php}",
    inject: DIR.src + "/**/*.{html,php}",
    css: DIR.css + "/*.css",
    sass: DIR.sass + "/**/*.scss",
    js: DIR.js + "/**/*.js",
    mainJs: DIR.js + "/main.js",
    images: DIR.images + "/**/*",
    svg: DIR.src + "/img/**/*.svg",
    build: DIR.build + "**/*"
};


/**********************
 *
 * DEV TASKS
 *
 *********************/


/********
 * Serve task
 */

gulp.task('serve', ['imagemin', 'sass', 'inject'], function () {

    if (argv.env == "prod") {
        browserSync.init({
            server: DIR.build
        });
    } else {
        browserSync.init({
            server: DIR.src
        });

        gulp.watch(FILES.sass, ['sass']);
        gulp.watch(FILES.js, ['browserify', 'inject']);
        gulp.watch([FILES.watchable, FILES.js, FILES.watchable]).on('change', browserSync.reload);
    }
});


/********
 * SASS compilation task
 */

gulp.task('sass', function () {
    return gulp.src(FILES.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIR.css))
        .pipe(browserSync.stream());
});


/********
 * Image Optimization task
 */

gulp.task('imagemin', function () {
    return gulp.src([FILES.images, DIR.js + "/Models/**/*"])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(DIR.images));
});


/********
 * Script and style injection task
 */

gulp.task('inject', ['browserify', 'sass'], function () {
    var target = gulp.src(FILES.inject);

    var bowerFiles = gulp.src(mainBowerFiles({
        paths: {
            bowerDirectory: DIR.vendors,
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        }
    }), {read: false});

    var sources = gulp.src([DIR.js + '/main.browserify.js', FILES.css + ""], {read: false});

    return target.pipe(inject(sources, {relative: true}))
        .pipe(inject(bowerFiles, {relative: true, name: 'bower'}))
        .pipe(gulp.dest(DIR.src));
});

gulp.task('browserify', function() {
    return gulp.src(DIR.js + '/main.js')
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(rename({
            suffix: ".browserify",
        }))
        .pipe(gulp.dest(DIR.js));
});


/**********************
 *  _                _
 * /!\ DEFAULT TASK /!\
 * ¯¯¯              ¯¯¯
 *********************/

gulp.task('src-build', ['imagemin', 'sass', 'browserify', 'inject']);

gulp.task('default', ['serve']);


/**********************
 *  _                    _
 * /!\ PRODUCTION TASKS /!\
 * ¯¯¯                  ¯¯¯
 *********************/


/********
 * Clean build directory
 */

gulp.task('build-clean', function () {
    return gulp.src(FILES.build, {read: false})
        .pipe(clean({force: true}));
});

/********
 *
 * Build vendors scripts
 */

gulp.task('build-vendors', ['src-build', 'build-clean'], function () {

    var filterJS = gulpFilter('**/*.js', {restore: true});
    var filterCSS = gulpFilter('**/*.css', {restore: true});

    //TODO: add browserigy task

    return gulp.src(mainBowerFiles({
            paths: {
                bowerDirectory: DIR.vendors,
                bowerrc: '.bowerrc',
                bowerJson: 'bower.json'
            }
        }))
        .pipe(filterJS)
        .pipe(concat('vendors.min.js'))
        .pipe(uglify())
        .pipe(filterJS.restore)
        .pipe(filterCSS)
        .pipe(concat('vendors.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(filterCSS.restore)
        .pipe(gulp.dest(DIR.build + "/assets"));
});

/********
 *
 * Build user custom scripts and styles
 */

gulp.task('build-scripts', ['src-build', 'build-clean'], function () {

    var filterJS = gulpFilter('**/*.js', {restore: true});
    var filterCSS = gulpFilter('**/*.css', {restore: true});

    return gulp.src([FILES.mainJs, FILES.css])
        .pipe(filterJS)
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(uglify())
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest(DIR.build + "/assets/js"))
        .pipe(filterJS.restore)
        .pipe(filterCSS)
        .pipe(concat('styles.min.css'))
        /*.pipe(uncss({
            html: [FILES.watchable],
            ignore: [
                /\.js-/
            ]
        }))*/
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(DIR.build + "/assets/css"))
        .pipe(filterCSS.restore);
});


/********
 *
 * Copy images, fonts, audio files
 */

gulp.task('build-copy', function() {
    return gulp.src([DIR.assets + '/*.*', DIR.assets + '/**/*.*'], {base: DIR.assets})
        .pipe(gulp.dest(DIR.build + "/assets/"));
});


/********
 *
 * Script and style injection task
 */

gulp.task('build-inject', ['src-build', 'build-clean', 'build-copy', 'build-vendors', 'build-scripts'], function () {
    var target = gulp.src(FILES.watchable);

    var userFiles = gulp.src([DIR.build + "/assets/js/scripts.min.js", DIR.build + "/assets/css/styles.min.css"]);
    var vendorsFiles = gulp.src(DIR.build + "/assets/vendors.min.js");

    return target.pipe(gulp.dest(DIR.build))
        .pipe(inject(userFiles, {relative: true, empty: true}))
        .pipe(inject(vendorsFiles, {relative: true, name: 'bower', empty: true}))
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(DIR.build));
});


/**********************
 *  _                           _
 * /!\ DEFAULT PRODUCTION TASK /!\
 * ¯¯¯                         ¯¯¯
 *********************/


gulp.task('build', ['src-build', 'build-clean', 'build-vendors', 'build-scripts', 'build-inject']);