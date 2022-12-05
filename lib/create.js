const path = require('path')

//第三方包对fs的封装
const fs = require('fs-extra')

//里面会有异步的操作
module.exports = async function (projectName, options) {
  console.log(projectName, options);
  //获取当前命令执行时的工作目录
  const cwd = process.cwd()
  //目标目录
  const targetDir = path.join(cwd, projectName)
  //当前目录是否存在
  if (fs.existsSync(targetDir)) {
    //强制安装的话，删除已有的
    if (options.force) {
      await fs.remove(targetDir)
    }
  }
  console.log(cwd);
}