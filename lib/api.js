const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data
})

function fetchRepoList() {
  return axios.get('https://api.github.com/orgs/zhu-cli/repos1')
}

module.exports = {
  fetchRepoList
}