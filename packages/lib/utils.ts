import * as stream from "stream"
import iconv from "iconv-lite"

/**
 * 路径分离
 * @param reg
 * @param replaceStr
 */
const replacePath = (
  reg: RegExp,
  replaceStr: string
): NodeJS.ReadWriteStream => {
  const transform = new stream.Transform({ objectMode: true })
  transform._transform = function (file, encoding, callback) {
    if (file.isBuffer()) {
      file.contents = Buffer.from(
        file.contents.toString().replace(reg, replaceStr)
      )
    }
    callback()
  }
  return transform
}
/**
 * 给路径后面添加时间戳
 */
const addTimestamp = (reg: RegExp): NodeJS.ReadWriteStream => {
  const transform = new stream.Transform({ objectMode: true })
  transform._transform = function (file, encoding, callback) {
    if (file.isBuffer()) {
      file.contents = Buffer.from(
        file.contents
          .toString()
          .replace(reg, (match, p1, p2, p3, offset, string) => {
            return `${match}?t=${new Date().getTime()}`
          })
      )
    }
    callback()
  }
  return transform
}

type iconvOptions = {
  from: string
  to: string
  iconv?: any
}

const UTF8 = "utf8"

const convertEncoding = (options: iconvOptions): NodeJS.ReadWriteStream => {
  options = options || ""

  if (!options.to && !options.from) {
    throw new Error("At least one of from or to encoding required")
  }
  options.from = options.from || UTF8
  options.to = options.to || UTF8
  options.iconv = options.iconv ? options.iconv : { decode: {}, encode: {} }
  const transform = new stream.Transform({
    objectMode: true,
    highWaterMark: 16
  })
  transform._transform = function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file)
      callback()
      return
    }
    if (file.isStream()) {
      try {
        file.contents = file.contents
          .pipe(iconv.decodeStream(options.from, options.iconv.decode))
          .pipe(iconv.encodeStream(options.to, options.iconv.encode))
        this.push(file)
      } catch (error) {
        this.emit("error", error)
      }
    }
    if (file.isBuffer()) {
      try {
        const str = iconv.decode(
          file.contents,
          options.from,
          options.iconv.decode
        )
        file.contents = iconv.encode(str, options.to, options.iconv.encode)
        this.push(file)
      } catch (error) {
        this.emit("error", error)
      }
    }
    callback()
  }
  return transform
}

export default { replacePath, addTimestamp, convertEncoding }
