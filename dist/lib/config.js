"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var pjPath = process.env.pjPath;
var config = require(_path["default"].resolve(pjPath, "re-gulp.config.js"));
var env = process.env.NODE_ENV;
var isDev = env === "development";
var envConfig = isDev ? config.dev : config.prod;
var gulpConfig = _objectSpread(_objectSpread({}, config.normal), envConfig);
var _default = exports["default"] = {
  gulpJsInputDir: _path["default"].resolve(pjPath, gulpConfig.inputJs),
  gulpJsOutputDir: _path["default"].resolve(pjPath, gulpConfig.outputDir, "./js"),
  gulpScssInputDir: _path["default"].resolve(pjPath, gulpConfig.inputScss),
  gulpScssOutputDir: _path["default"].resolve(pjPath, gulpConfig.outputDir, "./css"),
  gulpHtmlInputDir: _path["default"].resolve(pjPath, gulpConfig.inputHtml),
  gulpHtmlOutputDir: _path["default"].resolve(pjPath, gulpConfig.outputDir),
  gulpImgInputDir: _path["default"].resolve(pjPath, gulpConfig.inputImg),
  gulpImgOutputDir: _path["default"].resolve(pjPath, gulpConfig.outputDir, "./".concat(gulpConfig.outputImgSrc)),
  gulpLibInputDir: _path["default"].resolve(pjPath, gulpConfig.inputLib),
  gulpLibOutputDir: _path["default"].resolve(pjPath, gulpConfig.outputDir, "./lib"),
  gulpInnerPath: _path["default"].resolve(pjPath, gulpConfig.inputSrc),
  gulpIsBabel: gulpConfig.isBabel,
  gulpIsSprite: gulpConfig.isSprite,
  gulpIsJsMinify: gulpConfig.isJsMinify,
  gulpIsCssMinify: gulpConfig.isCssMinify,
  gulpIsHtmlMinify: gulpConfig.isHtmlMinify,
  gulpCssSplitBeforeSrc: gulpConfig.cssSplitBeforeSrc,
  gulpJsSplitBeforeSrc: gulpConfig.jsSplitBeforeSrc,
  gulpHtmlSplitBeforeSrc: gulpConfig.htmlSplitBeforeSrc,
  gulpImgIgnore: gulpConfig.imgIgnore,
  gulpPort: gulpConfig.port,
  gulpImgSplitSrc: gulpConfig.imgSplitSrc,
  gulpImageName: gulpConfig.imageName,
  gulpOutPath: _path["default"].resolve(pjPath, gulpConfig.outputDir),
  gulpConvertEncoding: gulpConfig.isEncoding
};