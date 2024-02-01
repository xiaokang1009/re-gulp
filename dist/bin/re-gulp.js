#!/usr/bin/env node
"use strict";

var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var pjPath = _path["default"].resolve(process.cwd());
process.env.pjPath = pjPath;
var argStr = process.argv.slice(2).join(" ");
var NODE_ENV = argStr.includes("build") ? "production" : "development";
process.env.NODE_ENV = NODE_ENV;
process.argv.push("--gulpfile", _path["default"].resolve(__dirname, "../gulpfile.js"));
require("gulp/bin/gulp");