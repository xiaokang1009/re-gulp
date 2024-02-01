"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var stream = _interopRequireWildcard(require("stream"));
var _iconvLite = _interopRequireDefault(require("iconv-lite"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/**
 * 路径分离
 * @param reg
 * @param replaceStr
 */
var replacePath = function replacePath(reg, replaceStr) {
  var transform = new stream.Transform({
    objectMode: true
  });
  transform._transform = function (file, encoding, callback) {
    if (file.isBuffer()) {
      file.contents = Buffer.from(file.contents.toString().replace(reg, replaceStr));
    }
    callback();
  };
  return transform;
};
/**
 * 给路径后面添加时间戳
 */
var addTimestamp = function addTimestamp(reg) {
  var transform = new stream.Transform({
    objectMode: true
  });
  transform._transform = function (file, encoding, callback) {
    if (file.isBuffer()) {
      file.contents = Buffer.from(file.contents.toString().replace(reg, function (match, p1, p2, p3, offset, string) {
        return "".concat(match, "?t=").concat(new Date().getTime());
      }));
    }
    callback();
  };
  return transform;
};
var UTF8 = "utf8";
var convertEncoding = function convertEncoding(options) {
  options = options || "";
  if (!options.to && !options.from) {
    throw new Error("At least one of from or to encoding required");
  }
  options.from = options.from || UTF8;
  options.to = options.to || UTF8;
  options.iconv = options.iconv ? options.iconv : {
    decode: {},
    encode: {}
  };
  var transform = new stream.Transform({
    objectMode: true,
    highWaterMark: 16
  });
  transform._transform = function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      callback();
      return;
    }
    if (file.isStream()) {
      try {
        file.contents = file.contents.pipe(_iconvLite["default"].decodeStream(options.from, options.iconv.decode)).pipe(_iconvLite["default"].encodeStream(options.to, options.iconv.encode));
        this.push(file);
      } catch (error) {
        this.emit("error", error);
      }
    }
    if (file.isBuffer()) {
      try {
        var str = _iconvLite["default"].decode(file.contents, options.from, options.iconv.decode);
        file.contents = _iconvLite["default"].encode(str, options.to, options.iconv.encode);
        this.push(file);
      } catch (error) {
        this.emit("error", error);
      }
    }
    callback();
  };
  return transform;
};
var _default = exports["default"] = {
  replacePath: replacePath,
  addTimestamp: addTimestamp,
  convertEncoding: convertEncoding
};