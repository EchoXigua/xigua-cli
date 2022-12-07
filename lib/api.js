const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data
})

function fetchRepoList() {
  return axios.get('https://api.github.com/orgs/zhu-cli/repos')
}

function fetchTagList(repo) {
  return axios.get(`https://api.github.com/repos/zhu-cli/${repo}/tags`)
}

module.exports = {
  fetchRepoList,
  fetchTagList
}