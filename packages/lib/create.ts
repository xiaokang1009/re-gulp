import path from "path"
import fs from "fs-extra"
import inquirer from "inquirer"
import { Generator } from "./generator"
export const create = async (
  projectName: string,
  options: { force: boolean }
) => {
  const cwd: string = process.cwd()
  // 在当前目录创建项目
  const targetPath: string = path.join(cwd, projectName)

  // 判断当前目录是否存在
  if (fs.existsSync(targetPath)) {
    if (options.force) {
      await fs.remove(targetPath)
    } else {
      // 询问是否覆盖
      const { isExist } = await inquirer.prompt([
        {
          type: "confirm",
          name: "isExist",
          message: "当前目录已存在，是否覆盖？ y/n",
          default: "y"
        }
      ])
      if (isExist) {
        // 删除当前目录
        await fs.remove(targetPath)
      }
    }
  }
  // 创建项目
  const generator = new Generator(projectName, targetPath)
  generator.create()
}
