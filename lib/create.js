const path = require('path')

//第三方包对fs的封装
const fs = require('fs-extra')

//ui选择框
const Inquirer = require('inquirer')

const Creator = require('./Creator')

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
    } else {
      //提示用户是否确定需要覆盖
      let { action } = await Inquirer.prompt([
        //配置询问的方式
        {
          name: 'action',
          type: 'list',//展现方式 list 列表
          message: `target directory already exists pick an action`,
          choices: [ //选择后，这里的value将会给到  返回对象中 就是结构出来的 action
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Cancel', value: false }
          ]
        }
      ])
      // console.log('act', action); //选择了Overwrite 值就是overwrite

      if (!action) {
        return
      } else if (action === 'overwrite') {
        console.log(`\r\nRemoving.....`);
        await fs.remove(targetDir)
      }
    }
  }

  //创建项目
  const creator = new Creator(projectName, targetDir)
  creator.create()
}