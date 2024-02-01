#!/usr/bin/env node

import path from "path"

const pjPath: string = path.resolve(process.cwd())

process.env.pjPath = pjPath

const argStr: string = process.argv.slice(2).join(" ")
const NODE_ENV: string = argStr.includes("build") ? "production" : "development"

process.env.NODE_ENV = NODE_ENV

process.argv.push("--gulpfile", path.resolve(__dirname, "../gulpfile.js"))

require("gulp/bin/gulp")
