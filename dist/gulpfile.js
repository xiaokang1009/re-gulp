"use strict";

var _config = _interopRequireDefault(require("./lib/config"));
var _gulp = _interopRequireDefault(require("gulp"));
var _gulpBabel = _interopRequireDefault(require("gulp-babel"));
var _gulpSass = _interopRequireDefault(require("gulp-sass"));
var _sass = _interopRequireDefault(require("sass"));
var _gulpConnect = _interopRequireDefault(require("gulp-connect"));
var _gulpWatch = _interopRequireDefault(require("gulp-watch"));
var _rimraf = require("rimraf");
var _gulpAutoprefixer = _interopRequireDefault(require("gulp-autoprefixer"));
var _gulpCleanCss = _interopRequireDefault(require("gulp-clean-css"));
var _gulpUglify = _interopRequireDefault(require("gulp-uglify"));
var _gulpHtmlmin = _interopRequireDefault(require("gulp-htmlmin"));
var _utils = _interopRequireDefault(require("./lib/utils"));
var _spriteGenerator = _interopRequireDefault(require("./lib/spriteGenerator"));
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
    var stream = _gulp["default"].src(gulpTask.src.js).pipe(_utils["default"].addTimestamp(/\.(gif|ttf|otf|png|jpe?g|svg|avif|json)/g)); // 添加时间戳
    !gulpTask.isDev && stream.pipe(_utils["default"].replacePath(gulpTask.jsBeforeSplitAddrReg, gulpTask.splitAddr)); // 分离路径
    gulpTask.isBabel && stream.pipe((0, _gulpBabel["default"])()); // babel
    gulpTask.isJsMinify && stream.pipe((0, _gulpUglify["default"])()); // 压缩js
    if (gulpTask.isEncoding) {
      stream = stream.pipe(_utils["default"].convertEncoding({
        from: "utf-8",
        to: "gbk"
      })); // 转换编码
    }
    stream.pipe(_gulp["default"].dest(gulpTask.dest.js));
    gulpTask.isDev && stream.pipe(_gulpConnect["default"].reload());
    return stream;
  },
  // lib 任务
  taskLib: function taskLib() {
    var stream = _gulp["default"].src(gulpTask.src.lib).pipe(_gulp["default"].dest(gulpTask.dest.lib));
    gulpTask.isDev && stream.pipe(_gulpConnect["default"].reload());
    return stream;
  },
  // html 任务
  taskHtml: function taskHtml() {
    var stream = _gulp["default"].src(gulpTask.src.html).pipe(_utils["default"].addTimestamp(/\.(gif|ttf|otf|png|jpe?g|svg|avif|js|css)/g)); // 添加时间戳
    !gulpTask.isDev && stream.pipe(_utils["default"].replacePath(gulpTask.htmlBeforeSplitAddrReg, gulpTask.splitAddr)); // 分离路径
    gulpTask.isHtmlMinify && stream.pipe((0, _gulpHtmlmin["default"])()); // 压缩html
    if (gulpTask.isEncoding) {
      stream = stream.pipe(_utils["default"].convertEncoding({
        from: "utf-8",
        to: "gbk"
      })); // 转换编码
    }
    stream.pipe(_gulp["default"].dest(gulpTask.dest.html));
    gulpTask.isDev && stream.pipe(_gulpConnect["default"].reload());
    return stream;
  },
  // img 任务
  taskImg: function taskImg() {
    var stream = _gulp["default"].src(_toConsumableArray(gulpTask.src.img)).pipe(_gulp["default"].dest(gulpTask.dest.img));
    gulpTask.isDev && stream.pipe(_gulpConnect["default"].reload());
    return stream;
  },
  // scss 任务
  taskScss: function taskScss() {
    var stream = _gulp["default"].src(gulpTask.src.scss).pipe(sass({
      outputStyle: "expanded"
    })).pipe((0, _gulpAutoprefixer["default"])());
    stream = gulpTask.isSprite ? stream.pipe((0, _spriteGenerator["default"])()) : stream;
    stream.pipe((0, _gulpCleanCss["default"])({
      format: gulpTask.isCssMinify ? false : "beautify"
    })).pipe(_utils["default"].addTimestamp(/\.(gif|ttf|otf|png|jpe?g|svg|avif)/g)); // 添加时间戳
    !gulpTask.isDev && stream.pipe(_utils["default"].replacePath(gulpTask.cssBeforeSplitAddrReg, gulpTask.splitAddr)); // 分离路径
    if (gulpTask.isEncoding) {
      stream = stream.pipe(_utils["default"].convertEncoding({
        from: "utf-8",
        to: "gbk"
      })); // 转换编码
    }
    stream.pipe(_gulp["default"].dest(gulpTask.dest.scss));
    gulpTask.isDev && stream.pipe(_gulpConnect["default"].reload());
    return stream;
  },
  // 清除任务
  taskClean: function taskClean() {
    return (0, _rimraf.rimraf)(gulpTask.outPath);
  },
  // watch 任务
  taskWatch: function taskWatch() {
    _gulpConnect["default"].server({
      root: gulpTask.outPath,
      port: gulpTask.port,
      livereload: true
    });
    (0, _gulpWatch["default"])(gulpTask.src.js, gulpTask.taskJs.bind(gulpTask));
    (0, _gulpWatch["default"])(gulpTask.src.lib, gulpTask.taskLib.bind(gulpTask));
    (0, _gulpWatch["default"])(gulpTask.src.html, gulpTask.taskHtml.bind(gulpTask));
    (0, _gulpWatch["default"])(_toConsumableArray(gulpTask.src.img), gulpTask.taskImg.bind(gulpTask));
    (0, _gulpWatch["default"])(gulpTask.src.scss, gulpTask.taskScss.bind(gulpTask));
  }
};
_gulp["default"].task("build", _gulp["default"].series(gulpTask.taskClean, _gulp["default"].series(gulpTask.taskJs, gulpTask.taskLib, gulpTask.taskHtml, gulpTask.taskImg, gulpTask.taskScss)));
_gulp["default"].task("dev", _gulp["default"].series("build", gulpTask.taskWatch));