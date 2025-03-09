import {  DaoPlatform } from "@prisma/client"
import { CommonError, ErrorCode } from "~/lib/error"
import { Octokit } from "octokit"
import { type Repository } from "~/types/data"
import { type Pageable } from "~/lib/schema"

class RepoService{
  async fetchRepoContributors(url:string,platform: DaoPlatform) {
    // implementation
  }

  async fetchPublicRepos(accessToken: string, platform: DaoPlatform, pageable: Pageable) {
    if (platform === DaoPlatform.GITHUB) {
      const parseLinkHeader=(header: string)=> {
        const links: Record<string, string> = {}
        header.split(",").forEach(part => {
          const section = part.split(";")
          if (section.length !== 2) return
          const url = section[0]!.replace(/<(.*)>/, "$1").trim()
          const name = section[1]!.replace(/rel="(.*)"/, "$1").trim()
          links[name] = url
        })
        return links
      }
      const client = new Octokit({ auth: accessToken })
      if (!client) {
        throw new CommonError(ErrorCode.INTERNAL_ERROR, "GitHub client not available")
      }
      try {
        const { data: repos, headers } = await client.rest.repos.listForAuthenticatedUser({
          visibility: "public",
          sort: "updated",
          affiliation: "owner,collaborator",
          per_page: pageable.size,
          page: pageable.page
        })

        const linkHeader = headers.link
        let totalPages = 0
        if (linkHeader) {
          const links = parseLinkHeader(linkHeader)
          if (links.last) {
            const lastPageUrl = new URL(links.last)
            totalPages = parseInt(lastPageUrl.searchParams.get("page") ?? "1", 10)
          }
        }

        return {
          repositories: repos.map(repo => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            star: repo.stargazers_count,
            fork: repo.forks_count,
            watch: repo.watchers_count,
            license: repo.license?.spdx_id
          } as Repository)),
          totalPages
        }
      } catch (error) {
        console.error("Error fetching GitHub repos:", error)
        throw new CommonError(ErrorCode.INTERNAL_ERROR, "Failed to fetch GitHub repositories")
      }
    } else if (platform === DaoPlatform.GITLAB) {
      // Implement GitLab repository fetching here
      throw new CommonError(ErrorCode.INTERNAL_ERROR, "GitLab repository fetching not implemented yet")
    } else {
      throw new CommonError(ErrorCode.BAD_PARAMS, "Unsupported platform")
    }
  }

}

export const repoService = new RepoService()
