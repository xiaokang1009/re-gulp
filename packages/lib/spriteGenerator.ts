import gulp from "gulp"
import sprites from "spritesmith"
import Vinyl from "vinyl"
import postcss, { Postcss } from "postcss"
import * as stream from "stream"
import config from "./config"

let spriteNameIndex = 0

/**
 * 生成雪碧图
 * @param src
 */
const spritesRun = (
  src: string[]
): Promise<Error | null | sprites.SpritesmithResult> => {
  return new Promise((resolve, reject) => {
    sprites.run(
      { src: src, padding: 10 },
      (err: Error | null, result: sprites.SpritesmithResult) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      }
    )
  })
}

/**
 * 生成雪碧图样式
 */
const spriteGenerator = (): NodeJS.ReadWriteStream => {
  const innerPath: string = config.gulpInnerPath
  const gulpImgName = config.gulpImageName
  const transform: stream.Transform = new stream.Transform({ objectMode: true })
  transform._transform = async (file: Vinyl, encoding, callback) => {
    if (file.isBuffer()) {
      const content = file.contents.toString(encoding)
      // 根据css内容生成ast语法树 遍历ast语法树，找到对应的图片，生成精灵图
      const postcssResult = postcss.parse(content)
      const imgList: string[] = []
      const imgMap: { [key: string]: boolean } = {}
      const selectorList: string[] = []
      postcssResult.walkRules((rule: postcss.Rule) => {
        rule.walkDecls((decl: postcss.Declaration) => {
          if (decl.value.includes("url") && decl.value.includes("sprite")) {
            const imgPath = decl.value.match(/sprite\/.*\.(png|jpe?g)/)![0]
            if (!imgList[imgPath]) {
              imgMap[imgPath] = true
              imgList.push(`${innerPath}/${gulpImgName}/${imgPath}`)
            }
            selectorList.push(rule.selector)
          }
        })
      })
      // 判断样式中是否有需要生成精灵图的图片
      if (!(imgList.length >= 1)) {
        callback(null, file)
        return null
      }
      const spriteName = `sprite/sprite-${spriteNameIndex++}.png`
      // 生成精灵图
      const spriteResult = await spritesRun(imgList)

      if (spriteResult instanceof Error) {
        callback(spriteResult, file)
        return null
      }

      // 将具体的css插入对应选择器
      postcssResult.walkRules((rule: postcss.Rule) => {
        rule.walkDecls((decl: postcss.Declaration) => {
          if (decl.value.includes("url") && decl.value.includes("sprite")) {
            const imgPath = decl.value.match(/sprite\/.*\.(png|jpe?g)/)![0]
            if (imgMap[imgPath]) {
              decl.remove()
              const position =
                spriteResult?.coordinates[
                  `${innerPath}/${gulpImgName}/${imgPath}`
                ]
              rule.append({
                prop: "background-position",
                value: `-${position!.x}px -${position!.y}px`
              })
            }
          }
        })
      })

      // 生成精灵图ast语法树
      const rule = postcss.rule({
        selector: selectorList.join(","),
        nodes: [
          postcss.decl({
            prop: "width",
            value: `${spriteResult?.properties.width}px`
          }),
          postcss.decl({
            prop: "height",
            value: `${spriteResult?.properties.height}px`
          }),
          postcss.decl({
            prop: "background",
            value: `url(../${gulpImgName}/${spriteName}) no-repeat`
          }),
          postcss.decl({
            prop: "background-size",
            value: `${spriteResult?.properties.width}px ${spriteResult?.properties.height}px`
          })
        ]
      })

      // 将rule 插入到ast语法树的最前面
      postcssResult.nodes.unshift(rule)
      // 将ast语法树转换成css
      const css = postcssResult.toResult().css
      // 将css 插入到文件流中
      file.contents = Buffer.from(css)
      // 输出精灵图
      const spriteFile = new Vinyl({
        path: spriteName,
        contents: spriteResult?.image
      })

      const spriteStream = new stream.Readable({
        objectMode: true,
        highWaterMark: 16
      })
      spriteStream._read = () => {
        spriteStream.push(spriteFile)
        spriteStream.push(null)
      }
      spriteStream.pipe(gulp.dest(config.gulpImgOutputDir))
      callback(null, file)
    }
  }
  return transform
}

export default spriteGenerator
