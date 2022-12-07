const { fetchRepoList, fetchTagList } = require('./api')

//ui 交互效果
const Inquirer = require('inquirer')

async function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

//loading效果
const ora = require('ora')
async function loading(fn, message, ...args) {
  const spin = ora(message)
  spin.start() //开启loading
  //请求可能会出错
  try {
    let repos = await fn(...args)
    spin.succeed() //成功
    return repos
  } catch (error) {
    spin.fail('request failed, refetch...')
    await sleep(1000)
    return loading(fn, message, ...args)  //递归去请求
  }

}

const downloadGitRepo = require('download-git-repo') //不持支promise，需要转换

const util = require('util') //node 自带方法

const path = require('path')

class Creator {
  constructor(projectName, targetDir) {
    this.name = projectName
    this.target = targetDir
    //变成promise方法
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  async create() {
    // 实现一个交互式功能 inquirer

    //将模板下载下来  download-git-repo

    //根据用户的选择动态的生成内容 metalsmith

    //拉去模板
    let repo = await this.fetchRepo()

    //通过模板找到版本号
    let tag = await this.fetchTag(repo)

    console.log(repo, tag);

    //下载模板
    let downloadUrl = await this.download(repo, tag)
  }

  async fetchRepo() {
    //这个地方请求有可能失败，或者很慢，拉取的github
    let repos = await loading(fetchRepoList, 'waiting fetch template')
    //repos 请求到的仓库数据，数组形式
    // console.log(repos);
    if (!repos) return

    repos = repos.map(item => item.name)
    let { repo } = await Inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'please choose a template to create project'
    })
    // console.log('repo', repo);
    return repo
  }

  async fetchTag(repo) {
    let tags = await loading(fetchTagList, 'waiting fetch tagsList', repo)
    if (!tags) return
    tags = tags.map(item => item.name)

    let { tag } = await Inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tags,
      message: 'please choose a tag to create project'
    })
    return tag
  }

  async download(repo, tag) {
    //1.拼接下载路径
    //zhu-cli/vue-template#1.0
    let requestUrl = `zhu-cli/${repo}${tag ? '#' + tag : ''}`
    //2.把资源下载到某个路径上(后续增加缓存,应该下载到系统目录中，
    //之后可以使用ejs handlerbar 去渲染模板，最后生成结果  再写入)
    // await this.downloadGitRepo(requestUrl, path.resolve(process.cwd(), `${repo}@${tag}`))
    await loading(this.downloadGitRepo, 'waiting fetch template from git', requestUrl, path.resolve(process.cwd(), `${repo}@${tag}`))

    return this.target
  }
}

module.exports = Creator