let project_folder = 'dist';
let source_folder = "#src";

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css",
        js: project_folder + "/js",
        img: project_folder + "/img",
        fonts: project_folder + "/fonts"
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/main.scss",
        js: source_folder + "/js/*.js",
        img: source_folder + "/img/**/*.{jpg,jpeg,png,svg,pdf,webp,ico}",
        fonts: source_folder + "/fonts/**/*.{ttf,otf,woff,woff2,svg}"
    },
    watch: {
        html: source_folder + "/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,jpeg,png,svg,pdf,webp,ico}"
    },
    clean: "./" + project_folder + "/"
};

let { src, dest } = require("gulp");
let gulp = require("gulp");
let browsersync = require("browser-sync").create();
let fileinclude = require('gulp-file-include');
let del = require('del');
let scss = require("gulp-sass")(require("sass"));
let autoprefixer = require("gulp-autoprefixer");
let imagemin = require('gulp-imagemin');

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    });
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css() {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: "expanded"
        }))
        .pipe(autoprefixer({
            cascade: true,
            overrideBrowserslist: ['last 5 versions'],
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function img() {
    return src(path.src.img)
        // .pipe(imagemin([
        //     imagemin.mozjpeg({ quality: 75, progressive: true }),
        //     imagemin.optipng({ optimizationLevel: 5 })],
        //     { verbose: true }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], img);
}

function clean() {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html, js, img));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.build = build;
exports.html = html;
exports.css = css;
exports.js = js;
exports.img = img;
exports.watch = watch;
exports.default = watch;