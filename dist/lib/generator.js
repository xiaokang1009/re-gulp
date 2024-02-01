"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Generator = void 0;
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Generator = exports.Generator = /*#__PURE__*/function () {
  function Generator(name, targetDir) {
    _classCallCheck(this, Generator);
    this.name = name;
    this.targetDir = targetDir;
  }
  _createClass(Generator, [{
    key: "create",
    value: function create() {
      var _this = this;
      // 创建目录
      _fsExtra["default"].mkdirSync(this.targetDir);
      // 获取当前目录模板
      var templatePath = _path["default"].resolve(__dirname, "../template");
      // 将模板下的文件全部转换到目标目录
      _fsExtra["default"].readdir(templatePath, function (err, files) {
        if (err) {
          throw err;
        }
        // 遍历模板下的文件
        files.forEach(function (file) {
          // 拼接完整的文件路径
          var filePath = _path["default"].resolve(templatePath, file);
          // 拼接目标文件路径
          var targetPath = _path["default"].resolve(_this.targetDir, file);
          // 将模板下的文件转换到目标目录
          _fsExtra["default"].copyFileSync(filePath, targetPath);
          console.log("创建成功!");
        });
      });
    }
  }]);
  return Generator;
}();