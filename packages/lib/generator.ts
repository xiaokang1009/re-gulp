import fs from "fs-extra"
import path from "path"
export class Generator {
  private name: string
  private targetDir: string
  constructor(name: string, targetDir: string) {
    this.name = name
    this.targetDir = targetDir
  }
  create() {
    // 创建目录
    fs.mkdirSync(this.targetDir)
    // 获取当前目录模板
    const templatePath: string = path.resolve(__dirname, "../template")
    // 将模板下的文件全部转换到目标目录
    fs.readdir(templatePath, (err, files) => {
      if (err) {
        throw err
      }
      // 遍历模板下的文件
      files.forEach(file => {
        // 拼接完整的文件路径
        const filePath: string = path.resolve(templatePath, file)
        // 拼接目标文件路径
        const targetPath: string = path.resolve(this.targetDir, file)
        // 将模板下的文件转换到目标目录
        fs.copyFileSync(filePath, targetPath)
        console.log("创建成功!")
      })
    })
  }
}
