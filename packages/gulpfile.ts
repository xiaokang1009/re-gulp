import config from "./lib/config"
import gulp from "gulp"
import babel from "gulp-babel"
import gulpSass from "gulp-sass"
import dartSass from "sass"
import connect from "gulp-connect"
import watch from "gulp-watch"
import { rimraf } from "rimraf"
import autofixer from "gulp-autoprefixer"
import cleanCSS from "gulp-clean-css"
import uglify from "gulp-uglify"
import htmlmin from "gulp-htmlmin"

import utils from "./lib/utils"
import spriteGenerator from "./lib/spriteGenerator"
import path from "path"

const sass = gulpSass(dartSass)

const gulpTask = {
  src: {
    js: config.gulpJsInputDir,
    lib: config.gulpLibInputDir,
    html: config.gulpHtmlInputDir,
    img: [config.gulpImgInputDir, `!${config.gulpImgIgnore}`],
    scss: config.gulpScssInputDir
  },
  dest: {
    js: config.gulpJsOutputDir,
    lib: config.gulpLibOutputDir,
    html: config.gulpHtmlOutputDir,
    img: config.gulpImgOutputDir,
    scss: config.gulpScssOutputDir
  },
  isBabel: config.gulpIsBabel,
  splitAddr: config.gulpImgSplitSrc,
  isSprite: config.gulpIsSprite,
  isDev: process.env.NODE_ENV === "development",
  cssBeforeSplitAddrReg: config.gulpCssSplitBeforeSrc,
  htmlBeforeSplitAddrReg: config.gulpHtmlSplitBeforeSrc,
  jsBeforeSplitAddrReg: config.gulpJsSplitBeforeSrc,
  outPath: config.gulpOutPath,
  port: config.gulpPort,
  isEncoding: config.gulpConvertEncoding,
  isJsMinify: config.gulpIsJsMinify,
  isCssMinify: config.gulpIsCssMinify,
  isHtmlMinify: config.gulpIsHtmlMinify,
  // js 任务
  taskJs() {
    let stream = gulp
      .src(gulpTask.src.js)
      .pipe(utils.addTimestamp(/\.(gif|ttf|otf|png|jpe?g|svg|avif|json)/g)) // 添加时间戳
    !gulpTask.isDev &&
      stream.pipe(
        utils.replacePath(gulpTask.jsBeforeSplitAddrReg, gulpTask.splitAddr)
      ) // 分离路径
    gulpTask.isBabel && stream.pipe(babel()) // babel
    gulpTask.isJsMinify && stream.pipe(uglify()) // 压缩js
    if (gulpTask.isEncoding) {
      stream = stream.pipe(
        utils.convertEncoding({
          from: "utf-8",
          to: "gbk"
        })
      ) // 转换编码
    }
    stream.pipe(gulp.dest(gulpTask.dest.js))
    gulpTask.isDev && stream.pipe(connect.reload())
    return stream
  },
  // lib 任务
  taskLib() {
    const stream = gulp.src(gulpTask.src.lib).pipe(gulp.dest(gulpTask.dest.lib))
    gulpTask.isDev && stream.pipe(connect.reload())
    return stream
  },
  // html 任务
  taskHtml() {
    let stream = gulp
      .src(gulpTask.src.html)
      .pipe(utils.addTimestamp(/\.(gif|ttf|otf|png|jpe?g|svg|avif|js|css)/g)) // 添加时间戳
    !gulpTask.isDev &&
      stream.pipe(
        utils.replacePath(gulpTask.htmlBeforeSplitAddrReg, gulpTask.splitAddr)
      ) // 分离路径
    gulpTask.isHtmlMinify && stream.pipe(htmlmin()) // 压缩html
    if (gulpTask.isEncoding) {
      stream = stream.pipe(
        utils.convertEncoding({
          from: "utf-8",
          to: "gbk"
        })
      ) // 转换编码
    }
    stream.pipe(gulp.dest(gulpTask.dest.html))
    gulpTask.isDev && stream.pipe(connect.reload())
    return stream
  },
  // img 任务
  taskImg() {
    const stream = gulp
      .src([...gulpTask.src.img])
      .pipe(gulp.dest(gulpTask.dest.img))
    gulpTask.isDev && stream.pipe(connect.reload())
    return stream
  },
  // scss 任务
  taskScss() {
    let stream = gulp
      .src(gulpTask.src.scss)
      .pipe(
        sass({
          outputStyle: "expanded"
        })
      )
      .pipe(autofixer())
    stream = gulpTask.isSprite ? stream.pipe(spriteGenerator()) : stream
    stream
      .pipe(
        cleanCSS({
          format: gulpTask.isCssMinify ? false : "beautify"
        })
      )
      .pipe(utils.addTimestamp(/\.(gif|ttf|otf|png|jpe?g|svg|avif)/g)) // 添加时间戳
    !gulpTask.isDev &&
      stream.pipe(
        utils.replacePath(gulpTask.cssBeforeSplitAddrReg, gulpTask.splitAddr)
      ) // 分离路径
    if (gulpTask.isEncoding) {
      stream = stream.pipe(
        utils.convertEncoding({
          from: "utf-8",
          to: "gbk"
        })
      ) // 转换编码
    }
    stream.pipe(gulp.dest(gulpTask.dest.scss))
    gulpTask.isDev && stream.pipe(connect.reload())
    return stream
  },
  // 清除任务
  taskClean() {
    return rimraf(gulpTask.outPath)
  },
  // watch 任务
  taskWatch() {
    connect.server({
      root: gulpTask.outPath,
      port: gulpTask.port,
      livereload: true
    })
    watch(gulpTask.src.js, gulpTask.taskJs.bind(gulpTask))
    watch(gulpTask.src.lib, gulpTask.taskLib.bind(gulpTask))
    watch(gulpTask.src.html, gulpTask.taskHtml.bind(gulpTask))
    watch([...gulpTask.src.img], gulpTask.taskImg.bind(gulpTask))
    watch(gulpTask.src.scss, gulpTask.taskScss.bind(gulpTask))
  }
} as const

gulp.task(
  "build",
  gulp.series(
    gulpTask.taskClean,
    gulp.series(
      gulpTask.taskJs,
      gulpTask.taskLib,
      gulpTask.taskHtml,
      gulpTask.taskImg,
      gulpTask.taskScss
    )
  )
)

gulp.task("dev", gulp.series("build", gulpTask.taskWatch))
