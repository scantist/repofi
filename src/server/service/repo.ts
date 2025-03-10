import { DaoPlatform } from "@prisma/client"
import { CommonError, ErrorCode } from "~/lib/error"
import { Octokit } from "octokit"
import { type PageableData, type Repository } from "~/types/data"
import { type Pageable } from "~/lib/schema"
import { fetchRepoContributors, parseRepoUrl } from "~/server/tool/repo"

class RepoService {
  async fetchPlatformInfo(accessToken: string, platform: DaoPlatform) {
    if (platform === DaoPlatform.GITHUB) {
      const client = new Octokit({ auth: accessToken })
      if (!client) {
        throw new CommonError(
          ErrorCode.INTERNAL_ERROR,
          "GitHub client not available",
        )
      }

      try {
        const { data: user } = await client.rest.users.getAuthenticated()
        console.log(user)
        return {
          email: user.email,
          avatar: user.avatar_url,
          name: user.name ?? user.login,
          username: user.login
        }
      } catch (error) {
        console.error("Error fetching GitHub user info:", error)
        throw new CommonError(
          ErrorCode.INTERNAL_ERROR,
          "Failed to fetch GitHub user information",
        )
      }
    } else if (platform === DaoPlatform.GITLAB) {
      // 实现 GitLab 用户信息获取
      throw new CommonError(
        ErrorCode.INTERNAL_ERROR,
        "GitLab user info fetching not implemented yet",
      )
    } else {
      throw new CommonError(ErrorCode.BAD_PARAMS, "Unsupported platform")
    }
  }

  async fetchPublicRepos(
    accessToken: string,
    platform: DaoPlatform,
    pageable: Pageable,
    search?: string,
  ) {
    if (platform === DaoPlatform.GITHUB) {
      const client = new Octokit({ auth: accessToken })
      if (!client) {
        throw new CommonError(
          ErrorCode.INTERNAL_ERROR,
          "GitHub client not available",
        )
      }
      try {
        const { data } = await client.rest.search.repos({
            q: `
            user:@me 
            is:public 
            fork:false
            sort:updated
            ${search ? `${search} in:name,description` : ""}
          `.trim().replace(/\s+/g, " "),
          per_page: pageable.size,
          page: pageable.page + 1
        })
        const repositories = data.items.map(
          (repo) =>
            ({
              id: repo.id,
              name: repo.name,
              description: repo.description,
              url: repo.html_url,
              star: repo.stargazers_count,
              fork: repo.forks_count,
              watch: repo.watchers_count,
              license: repo.license?.spdx_id
            }) as Repository,
        )
        return {
          list: repositories,
          total:data.total_count,
          pages: Math.ceil(data.total_count / pageable.size)
        } as PageableData<(typeof repositories)[number]>
      } catch (error) {
        console.error("Error fetching GitHub repos:", error)
        throw new CommonError(
          ErrorCode.INTERNAL_ERROR,
          "Failed to fetch GitHub repositories",
        )
      }
    } else if (platform === DaoPlatform.GITLAB) {
      // Implement GitLab repository fetching here
      throw new CommonError(
        ErrorCode.INTERNAL_ERROR,
        "GitLab repository fetching not implemented yet",
      )
    } else {
      throw new CommonError(ErrorCode.BAD_PARAMS, "Unsupported platform")
    }
  }

  async fetchRepoContributors(url: string) {
    const repoMeta = parseRepoUrl(url)
    return await fetchRepoContributors(
      repoMeta.platform,
      repoMeta.owner,
      repoMeta.repo,
    )
  }
}

export const repoService = new RepoService()
