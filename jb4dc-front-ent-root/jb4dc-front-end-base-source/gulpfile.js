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

const jarFromResourcePath = "source/static";
const jarToResourcePath = "../jb4dc-front-end-base-dist/src/main/resources/static";

//region 基础Jar包相关的编译

/*拷贝Themes下的所有文件*/
gulp.task('front-end-base-themes-all',()=>{
    return gulp.src(jarFromResourcePath+"/Themes/**/*", {base:jarFromResourcePath+"/Themes"}).pipe(gulp.dest(jarToResourcePath+"/Themes"));
});

/*编译Themes下的Less文件*/
gulp.task('front-end-base-themes-less',()=>{
    return gulp.src(jarFromResourcePath+"/Themes/Default/Css/*.less")
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jarToResourcePath+'/Themes/Default/Css'));
});

/*编译Js下的工具类JS*/
gulp.task('front-end-base-js-utility',()=>{
    return gulp.src([jarFromResourcePath + '/Js/Utility/*.js'])
        .pipe(babel({
            presets: ['@babel/env'],
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('JBuild4DPlatformLib.js'))
        /*.pipe(uglify(
            {
                compress: {drop_debugger: false}
            }
        ))*/
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jarToResourcePath + "/Js"));
});

/*编译Js下旧的UI的组件*/
gulp.task('front-end-base-js-ui-component',()=>{
    return gulp.src([jarFromResourcePath + '/Js/EditTable/**/*.js',jarFromResourcePath + '/Js/TreeTable/**/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('UIEXComponent.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jarToResourcePath + "/Js"));
});

/*拷贝Js下的第三方库*/
gulp.task('front-end-base-js-external',()=>{
    return gulp.src(jarFromResourcePath+"/Js/External/**/*", {base:jarFromResourcePath+"/Js/External"}).pipe(gulp.dest(jarToResourcePath+"/Js/External"));
});

/*拷贝HTML下的所有文件*/
gulp.task('front-end-base-html',()=>{
    return gulp.src(jarFromResourcePath+"/HTML/**/*", {base:jarFromResourcePath+"/HTML"}).pipe(gulp.dest(jarToResourcePath+"/HTML"));
});


gulp.task('Dist-Watch', function() {
    gulp.watch(jarFromResourcePath+"/HTML/**/*", gulp.series('front-end-base-html'));
    gulp.watch(jarFromResourcePath+"/Js/Utility/*.js", gulp.series('front-end-base-js-utility'));
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