const { fetchRepoList } = require('./api')

const Inquirer = require('inquirer')

async function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

const ora = require('ora')
async function loading(fn, message) {
  const spin = ora(message)
  spin.start() //开启loading
  //请求可能会出错
  try {
    let repos = await fn()
    spin.succeed() //成功
    return repos
  } catch (error) {
    spin.fail('request failed, refetch...')
    await sleep(1000)
    return loading(fn, message)  //递归去请求
  }

}

class Creator {
  constructor(projectName, targetDir) {
    this.name = projectName
    this.target = targetDir
  }

  async create() {
    // 实现一个交互式功能 inquirer

    //将模板下载下来  download-git-repo

    //根据用户的选择动态的生成内容 metalsmith

    //拉去模板
    let repo = await this.fetchRepo()

    //通过模板找到版本号
    let tag = await this.fetchTag(repo)

    //下载模板
    let downloadUrl = await this.download(repo, tag)
  }

  async fetchRepo() {
    //这个地方请求有可能失败，或者很慢，拉取的github
    let repos = await loading(fetchRepoList, 'waiting fetch template')
    //repos 请求到的仓库数据，数组形式
    console.log(repos);
    if (!repos) return

    repos = repos.map(item => item.name)
    let { repo } = await Inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'please choose a template to create project'
    })
    console.log('repo', repo);
    return repo
  }

  fetchTag() {

  }

  download() {

  }
}

module.exports = Creator