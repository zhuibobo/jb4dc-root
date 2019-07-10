'use strict';

require("@babel/polyfill");
const babel = require('gulp-babel');
const gulp = require('gulp');
const gulpCopy = require('gulp-copy');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlclean = require('gulp-htmlclean');
const less = require('gulp-less');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');

const replacecust = require("./gulp-plugin/gulp-replace-cust/index.js");

const replaceBlockObj=require("./replaceBlock.js");

const sourcePath = "static";
const distPath = "../resources/static";

gulp.task('config-html-only',()=>{
    //gulp.src(jarFromResourcePath+"/HTML/**/*", {base:jarFromResourcePath+"/HTML"}).pipe(gulp.dest(jarToResourcePath+"/HTML"))
    return copyAndResolveHtml(sourcePath + "/HTML/**/*.html",sourcePath + "/HTML",distPath + "/HTML");
    /*return gulp.src(jarFromResourcePath+"/HTML/!**!/!*.html", {base:jarFromResourcePath+"/HTML"}).pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS:true,
        minifyJS:false,
        removeComments:true
    })).pipe(gulp.dest(jarToResourcePath+"/HTML"));*/
});

gulp.task('dist-watch', function() {
    gulp.watch(sourcePath+"/HTML/**/*", gulp.series('config-html-only'));
});

//endregion

function copyAndResolveHtml(sourcePath,base,toPath) {
    /*拷贝HTML文件*/
    return gulp.src(sourcePath, {base: base})
        .pipe(replacecust(replaceBlockObj.replaceBlock('GeneralLib'), replaceBlockObj.replaceGeneralLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('CodeMirrorLib'), replaceBlockObj.replaceCodeMirrorLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('FormDesignLib'), replaceBlockObj.replaceFormDesignLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('JBuild4DFormDesignLib'), replaceBlockObj.replaceJBuild4DFormDesignLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ZTreeExtendLib'), replaceBlockObj.replaceZTreeExtendLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ThemesLib'), replaceBlockObj.replaceThemesLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('BootStrap4Lib'), replaceBlockObj.replaceBootStrap4Lib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('FrameV1Lib'), replaceBlockObj.replaceFrameV1Lib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('GoJsLib'), replaceBlockObj.replaceGoJsLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('Webix'), replaceBlockObj.replaceWebixLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('HTMLDesignRuntimeLib'), replaceBlockObj.replaceHTMLDesignRuntimeLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('HTMLDesignWysiwygLib'), replaceBlockObj.replaceHTMLDesignWysiwygLib))
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:false,
            removeComments:true
        }))
        /*.pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:false
        }))*/
        //.pipe(htmlclean({
        //    protect: /<\!--%fooTemplate\b.*?%-->/g,
        //    edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
        //}))
        .pipe(gulp.dest(toPath));
}