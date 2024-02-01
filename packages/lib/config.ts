import path from "path"

const pjPath = process.env.pjPath as string

type iReGulpConfig<K> = {
  normal: {
    // k is the key of the object
    [k in keyof K]: K[k]
  }
  dev: {
    [k in keyof K]: K[k]
  }
  prod: {
    [k in keyof K]: K[k]
  }
}

type iGulpConfigStringKey =
  | "inputJs"
  | "inputScss"
  | "inputHtml"
  | "inputImg"
  | "inputLib"
  | "inputSrc"
  | "outputDir"
  | "outputImgSrc"
  | "imgSplitSrc"
  | "imageName"

type iGulpConfigBooleanKey =
  | "isBabel"
  | "isSprite"
  | "isJsMinify"
  | "isCssMinify"
  | "isHtmlMinify"
  | "isEncoding"
type iGulpConfig = {
  [k in iGulpConfigStringKey]: string
} & {
  [k in iGulpConfigBooleanKey]: boolean
} & {
  cssSplitBeforeSrc: RegExp //样式文件分离前的路径
  jsSplitBeforeSrc: RegExp //js文件分离前的路径
  htmlSplitBeforeSrc: RegExp //html文件分离前的路径
  imgIgnore?: string
  port?: number
}

const config: iReGulpConfig<any> = require(
  path.resolve(pjPath, "re-gulp.config.js")
)

const env = process.env.NODE_ENV

const isDev: boolean = env === "development"

const envConfig = isDev ? config.dev : config.prod

const gulpConfig: iGulpConfig = <iGulpConfig>{
  ...config.normal,
  ...envConfig
}

export default {
  gulpJsInputDir: path.resolve(pjPath, gulpConfig.inputJs),
  gulpJsOutputDir: path.resolve(pjPath, gulpConfig.outputDir, "./js"),

  gulpScssInputDir: path.resolve(pjPath, gulpConfig.inputScss),
  gulpScssOutputDir: path.resolve(pjPath, gulpConfig.outputDir, "./css"),

  gulpHtmlInputDir: path.resolve(pjPath, gulpConfig.inputHtml),
  gulpHtmlOutputDir: path.resolve(pjPath, gulpConfig.outputDir),

  gulpImgInputDir: path.resolve(pjPath, gulpConfig.inputImg),
  gulpImgOutputDir: path.resolve(
    pjPath,
    gulpConfig.outputDir,
    `./${gulpConfig.outputImgSrc}`
  ),

  gulpLibInputDir: path.resolve(pjPath, gulpConfig.inputLib),
  gulpLibOutputDir: path.resolve(pjPath, gulpConfig.outputDir, "./lib"),

  gulpInnerPath: path.resolve(pjPath, gulpConfig.inputSrc),
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
  gulpOutPath: path.resolve(pjPath, gulpConfig.outputDir),
  gulpConvertEncoding: gulpConfig.isEncoding
}
