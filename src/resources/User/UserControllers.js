import { Octokit } from "@octokit/core"

export const main = async (req, res) => {
  if (!req.query || !req.query.account) {
    return res.status(400).end('Missing GitHub account')
  }

  const octokit = new Octokit({
    auth: '',
  })

  const repoList = [
    'https://github.com/WeLightProject/Tai-Shang-NFT-Wallet',
    'https://github.com/WeLightProject/WeLightBlockchainOS',
  ]

  let contributors = []

  for (let i = 0; i < repoList.length; i++) {
    const matches = repoList[i].match(/\/\/github\.com\/(.+)\/(.+)/)
    const owner = matches[1]
    const repo = matches[2]

    // 调用 API 获取 contributors
    // 只包含有 commit 的人
    const result = await octokit.request(`GET /repos/${owner}/${repo}/contributors?ano=1`)

    if (!result.data.length) {
      continue
    }

    // 添加 contribution 信息
    result.data.forEach(contributor => {
      contributors.push({
        ...contributor,
        repo: repoList[i],
      })
    })
  }
  
  // 检查指定账户是否在 contributors 中
  if (!contributors.find(item => item.login === req.query.account)) {
    res.status(200).end(`${req.query.account} is not a contributor!`)
    return
  }

  // 统计 contributor 在各个 repo 中的 commit 数量
  let contribution = []
  contributors.forEach((ele) => {
    if (ele.login === req.query.account) {
      contribution.push({
        repo: ele.repo,
        commits: ele.contributions,
      })
    }
  })

  return res.status(200).json({
    name: req.query.account,
    contribution,
  })
}
