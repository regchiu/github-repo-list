import { Octokit } from 'octokit'

export default new Octokit({ auth: import.meta.env.VITE_GITHUB_API_TOKEN })
