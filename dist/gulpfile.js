"use strict";

var _config = _interopRequireDefault(require("./lib/config"));
var _gulp = _interopRequireDefault(require("gulp"));
var _gulpBabel = _interopRequireDefault(require("gulp-babel"));
var _gulpSass = _interopRequireDefault(require("gulp-sass"));
var _sass = _interopRequireDefault(require("sass"));
var _gulpConnect = _interopRequireDefault(require("gulp-connect"));
var _gulpWatch = _interopRequireDefault(require("gulp-watch"));
var _del = _interopRequireDefault(require("del"));
var _gulpAutoprefixer = _interopRequireDefault(require("gulp-autoprefixer"));
var _gulpCleanCss = _interopRequireDefault(require("gulp-clean-css"));
var _gulpUglify = _interopRequireDefault(require("gulp-uglify"));
var _gulpHtmlmin = _interopRequireDefault(require("gulp-htmlmin"));
var _utils = _interopRequireDefault(require("./lib/utils"));
var _spriteGenerator = _interopRequireDefault(require("./lib/spriteGenerator"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var sass = (0, _gulpSass["default"])(_sass["default"]);
var gulpTask = {
  src: {
    js: _config["default"].gulpJsInputDir,
    lib: _config["default"].gulpLibInputDir,
    html: _config["default"].gulpHtmlInputDir,
    img: [_config["default"].gulpImgInputDir, "!".concat(_config["default"].gulpImgIgnore)],
    scss: _config["default"].gulpScssInputDir
  },
  dest: {
    js: _config["default"].gulpJsOutputDir,
    lib: _config["default"].gulpLibOutputDir,
    html: _config["default"].gulpHtmlOutputDir,
    img: _config["default"].gulpImgOutputDir,
    scss: _config["default"].gulpScssOutputDir
  },
  isBabel: _config["default"].gulpIsBabel,
  splitAddr: _config["default"].gulpImgSplitSrc,
  isSprite: _config["default"].gulpIsSprite,
  isDev: process.env.NODE_ENV === "development",
  cssBeforeSplitAddrReg: _config["default"].gulpCssSplitBeforeSrc,
  htmlBeforeSplitAddrReg: _config["default"].gulpHtmlSplitBeforeSrc,
  jsBeforeSplitAddrReg: _config["default"].gulpJsSplitBeforeSrc,
  outPath: _config["default"].gulpOutPath,
  port: _config["default"].gulpPort,
  isEncoding: _config["default"].gulpConvertEncoding,
  isJsMinify: _config["default"].gulpIsJsMinify,
  isCssMinify: _config["default"].gulpIsCssMinify,
  isHtmlMinify: _config["default"].gulpIsHtmlMinify,
  // js 任务
  taskJs: function taskJs() {
    var stream = _gulp["default"].src(this.src.js).pipe(_utils["default"].addTimestamp(/\.(gif|ttf|otf|png|jpe?g|svg|avif|json)/g)); // 添加时间戳
    !this.isDev && stream.pipe(_utils["default"].replacePath(this.jsBeforeSplitAddrReg, this.splitAddr)); // 分离路径
    this.isBabel && stream.pipe((0, _gulpBabel["default"])()); // babel
    this.isJsMinify && stream.pipe((0, _gulpUglify["default"])()); // 压缩js
    this.isEncoding && stream.pipe(_utils["default"].convertEncoding({
      from: "utf-8",
      to: "gbk"
    })); // 转换编码
    stream.pipe(_gulp["default"].dest(this.dest.js));
    this.isDev && stream.pipe(_gulpConnect["default"].reload());
    return stream;
  },
  // lib 任务
  taskLib: function taskLib() {
    var stream = _gulp["default"].src(this.src.lib).pipe(_gulp["default"].dest(this.dest.lib));
    this.isDev && stream.pipe(_gulpConnect["default"].reload());
    return stream;
  },
  // html 任务
  taskHtml: function taskHtml() {
    var stream = _gulp["default"].src(this.src.html).pipe(_utils["default"].addTimestamp(/\.(gif|ttf|otf|png|jpe?g|svg|avif|js|css)/g)); // 添加时间戳
    !this.isDev && stream.pipe(_utils["default"].replacePath(this.htmlBeforeSplitAddrReg, this.splitAddr)); // 分离路径
    this.isHtmlMinify && stream.pipe((0, _gulpHtmlmin["default"])()); // 压缩html
    this.isEncoding && stream.pipe(_utils["default"].convertEncoding({
      from: "utf-8",
      to: "gbk"
    })); // 转换编码
    stream.pipe(_gulp["default"].dest(this.dest.html));
    this.isDev && stream.pipe(_gulpConnect["default"].reload());
    return stream;
  },
  // img 任务
  taskImg: function taskImg() {
    var stream = _gulp["default"].src(_toConsumableArray(this.src.img)).pipe(_gulp["default"].dest(this.dest.img));
    this.isDev && stream.pipe(_gulpConnect["default"].reload());
    return stream;
  },
  // scss 任务
  taskScss: function taskScss() {
    var stream = _gulp["default"].src(this.src.scss).pipe(sass({
      outputStyle: "expanded"
    })).pipe((0, _gulpAutoprefixer["default"])());
    stream = this.isSprite ? stream.pipe((0, _spriteGenerator["default"])()) : stream;
    stream.pipe((0, _gulpCleanCss["default"])({
      format: this.isCssMinify ? false : "beautify"
    })).pipe(_utils["default"].addTimestamp(/\.(gif|ttf|otf|png|jpe?g|svg|avif)/g)); // 添加时间戳
    !this.isDev && stream.pipe(_utils["default"].replacePath(this.cssBeforeSplitAddrReg, this.splitAddr)); // 分离路径
    this.isEncoding && stream.pipe(_utils["default"].convertEncoding({
      from: "utf-8",
      to: "gbk"
    })); // 转换编码
    stream.pipe(_gulp["default"].dest(this.dest.scss));
    this.isDev && stream.pipe(_gulpConnect["default"].reload());
    return stream;
  },
  // 清除任务
  taskClean: function taskClean() {
    return (0, _del["default"])([_path["default"].resolve(this.outPath, "./**/*")], {
      force: true
    });
  },
  // watch 任务
  taskWatch: function taskWatch() {
    _gulpConnect["default"].server({
      root: this.outPath,
      port: this.port,
      livereload: true
    });
    (0, _gulpWatch["default"])(this.src.js, this.taskJs.bind(this));
    (0, _gulpWatch["default"])(this.src.lib, this.taskLib.bind(this));
    (0, _gulpWatch["default"])(this.src.html, this.taskHtml.bind(this));
    (0, _gulpWatch["default"])(_toConsumableArray(this.src.img), this.taskImg.bind(this));
    (0, _gulpWatch["default"])(this.src.scss, this.taskScss.bind(this));
  }
};
_gulp["default"].task("build", _gulp["default"].series(gulpTask.taskClean.bind(gulpTask), _gulp["default"].parallel(gulpTask.taskJs.bind(gulpTask), gulpTask.taskLib.bind(gulpTask), gulpTask.taskHtml.bind(gulpTask), gulpTask.taskImg.bind(gulpTask), gulpTask.taskScss.bind(gulpTask))));
_gulp["default"].task("dev", _gulp["default"].series("build", gulpTask.taskWatch.bind(gulpTask)));