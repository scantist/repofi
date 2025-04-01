import {DaoPlatform} from "@prisma/client"
import {CommonError, ErrorCode} from "~/lib/error"
import {Octokit} from "octokit"
import {type PageableData, type Repository} from "~/types/data"
import {type Pageable} from "~/lib/schema"
import {fetchRepoContributors, fetchUserRepos, parseRepoUrl} from "~/server/tool/repo"

class RepoService {
  async fetchPlatformInfo(accessToken: string, platform: DaoPlatform) {
    if (platform === DaoPlatform.GITHUB) {
      const client = new Octokit({auth: accessToken})
      if (!client) {
        throw new CommonError(ErrorCode.INTERNAL_ERROR, "GitHub client not available")
      }

      try {
        const {data: user} = await client.rest.users.getAuthenticated()
        console.log(user)
        return {
          email: user.email,
          avatar: user.avatar_url,
          name: user.name ?? user.login,
          username: user.login
        }
      } catch (error) {
        console.error("Error fetching GitHub user info:", error)
        throw new CommonError(ErrorCode.INTERNAL_ERROR, "Failed to fetch GitHub user information")
      }
    } else if (platform === DaoPlatform.GITLAB) {
      // 实现 GitLab 用户信息获取
      throw new CommonError(ErrorCode.INTERNAL_ERROR, "GitLab user info fetching not implemented yet")
    } else {
      throw new CommonError(ErrorCode.BAD_PARAMS, "Unsupported platform")
    }
  }

  async fetchPublicRepos(accessToken: string, platform: DaoPlatform, pageable: Pageable, search?: string) {
    let repos = await fetchUserRepos(accessToken, platform)
    if (search) {
      repos = repos.filter((repo) =>
        repo.name.toLowerCase().includes(search.toLowerCase()) || repo.description?.toLowerCase().includes(search.toLowerCase()))
    }
    const offset = pageable.page * pageable.size;
    return {
      list: repos.slice(offset, offset + pageable.size),
      pages: Math.ceil(repos.length / pageable.size),
      total: repos.length
    }
  }

  async fetchRepoContributors(url: string, pageable: Pageable) {
    const repoMeta = parseRepoUrl(url)
    return await fetchRepoContributors(repoMeta.platform, repoMeta.owner, repoMeta.repo, pageable)
  }
}

export const repoService = new RepoService()
