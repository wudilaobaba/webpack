const path = require('path')

//当前项目运行的命令行所在路径
const appDir = process.cwd()

const resolveApp = (relativePath) => {
  return path.resolve(appDir, relativePath)
}

module.exports = resolveApp
