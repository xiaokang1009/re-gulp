import config from "./lib/config"
import gulp from "gulp"
import babel from "gulp-babel"
import gulpSass from "gulp-sass"
import dartSass from "sass"
import connect from "gulp-connect"
import watch from "gulp-watch"
import del from "del"
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
    const stream = gulp
      .src(this.src.js)
      .pipe(utils.addTimestamp(/\.(gif|ttf|otf|png|jpe?g|svg|avif|json)/g)) // 添加时间戳
    !this.isDev &&
      stream.pipe(utils.replacePath(this.jsBeforeSplitAddrReg, this.splitAddr)) // 分离路径
    this.isBabel && stream.pipe(babel()) // babel
    this.isJsMinify && stream.pipe(uglify()) // 压缩js
    this.isEncoding &&
      stream.pipe(
        utils.convertEncoding({
          from: "utf-8",
          to: "gbk"
        })
      ) // 转换编码
    stream.pipe(gulp.dest(this.dest.js))
    this.isDev && stream.pipe(connect.reload())
    return stream
  },
  // lib 任务
  taskLib() {
    const stream = gulp.src(this.src.lib).pipe(gulp.dest(this.dest.lib))
    this.isDev && stream.pipe(connect.reload())
    return stream
  },
  // html 任务
  taskHtml() {
    const stream = gulp
      .src(this.src.html)
      .pipe(utils.addTimestamp(/\.(gif|ttf|otf|png|jpe?g|svg|avif|js|css)/g)) // 添加时间戳
    !this.isDev &&
      stream.pipe(
        utils.replacePath(this.htmlBeforeSplitAddrReg, this.splitAddr)
      ) // 分离路径
    this.isHtmlMinify && stream.pipe(htmlmin()) // 压缩html
    this.isEncoding &&
      stream.pipe(
        utils.convertEncoding({
          from: "utf-8",
          to: "gbk"
        })
      ) // 转换编码
    stream.pipe(gulp.dest(this.dest.html))
    this.isDev && stream.pipe(connect.reload())
    return stream
  },
  // img 任务
  taskImg() {
    const stream = gulp.src([...this.src.img]).pipe(gulp.dest(this.dest.img))
    this.isDev && stream.pipe(connect.reload())
    return stream
  },
  // scss 任务
  taskScss() {
    let stream = gulp
      .src(this.src.scss)
      .pipe(
        sass({
          outputStyle: "expanded"
        })
      )
      .pipe(autofixer())
    stream = this.isSprite ? stream.pipe(spriteGenerator()) : stream
    stream
      .pipe(
        cleanCSS({
          format: this.isCssMinify ? false : "beautify"
        })
      )
      .pipe(utils.addTimestamp(/\.(gif|ttf|otf|png|jpe?g|svg|avif)/g)) // 添加时间戳
    !this.isDev &&
      stream.pipe(utils.replacePath(this.cssBeforeSplitAddrReg, this.splitAddr)) // 分离路径
    this.isEncoding &&
      stream.pipe(
        utils.convertEncoding({
          from: "utf-8",
          to: "gbk"
        })
      ) // 转换编码
    stream.pipe(gulp.dest(this.dest.scss))
    this.isDev && stream.pipe(connect.reload())
    return stream
  },
  // 清除任务
  taskClean() {
    return del([path.resolve(this.outPath, "./**/*")], {
      force: true
    })
  },
  // watch 任务
  taskWatch() {
    connect.server({
      root: this.outPath,
      port: this.port,
      livereload: true
    })
    watch(this.src.js, this.taskJs.bind(this))
    watch(this.src.lib, this.taskLib.bind(this))
    watch(this.src.html, this.taskHtml.bind(this))
    watch([...this.src.img], this.taskImg.bind(this))
    watch(this.src.scss, this.taskScss.bind(this))
  }
} as const

gulp.task(
  "build",
  gulp.series(
    gulpTask.taskClean.bind(gulpTask),
    gulp.parallel(
      gulpTask.taskJs.bind(gulpTask),
      gulpTask.taskLib.bind(gulpTask),
      gulpTask.taskHtml.bind(gulpTask),
      gulpTask.taskImg.bind(gulpTask),
      gulpTask.taskScss.bind(gulpTask)
    )
  )
)

gulp.task("dev", gulp.series("build", gulpTask.taskWatch.bind(gulpTask)))
