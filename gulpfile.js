const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsPro = ts.createProject("tsconfig.pro.json");
const tslint = require('gulp-tslint');
const uglify = require('gulp-uglify');
const run = require('gulp-run');


gulp.task("build", function () {
    return tsPro.src()
    .pipe(tsPro())
    .js
    .pipe(uglify())
    .pipe(gulp.dest("./dist"));
});

gulp.task("test", function () {
    return run("npm test", {verbosity: 1})
    .exec(function (error) {
        if (error !== null) {
            console.log(error);
        }
    });
});

gulp.task("lint", function () {
    return gulp.src(["./src/**/*.ts", ",/test/**/*.ts"])
    .pipe(tslint())
    .pipe(tslint.report());
});

gulp.task("default", ["test", "build"]);